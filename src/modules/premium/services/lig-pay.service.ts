import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';

import { UserID } from '../../../common/types/entity-ids.type';
import { LiqPayConfig } from '../../../config/config.types';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PremiumPurchaseRepository } from '../../repository/services/premium.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AccountTypeEnum } from '../../users/enums/account-type.enum';
import {
  MessageDto,
  OrderIdDto,
  PaymentResponseDto,
  PaymentStatusDto,
} from '../dto/res/payment-res.dto';

@Injectable()
export class LiqPayService {
  private readonly liqPayConfig: LiqPayConfig;
  private readonly logger = new Logger(LiqPayService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly premiumPurchaseRepository: PremiumPurchaseRepository,
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
  ) {
    this.liqPayConfig = this.configService.get<LiqPayConfig>('liqpay');
  }

  private handleError(error: any, customMessage: string): void {
    this.logger.error(customMessage, error);
    throw new HttpException(customMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async getPayPaymentStatus(
    orderId: string,
    userData: IUserData,
  ): Promise<PaymentStatusDto> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Checking payment status for orderId: ${orderId}`);

    const params = {
      public_key: this.liqPayConfig.liqPayPublicKey,
      version: '3',
      action: 'status',
      order_id: orderId,
    };

    const encodedData = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature = this.generateSignature(encodedData);

    try {
      const response = await this.sendRequestToLiqPay(encodedData, signature);

      if (response.status === 'success') {
        user.accountType = AccountTypeEnum.PREMIUM;
        await this.userRepository.save(user);
        return {
          payment_status: response.status,
          message: `Congratulations, your account is now Premium!`,
        };
      } else {
        return {
          payment_status: response.status,
          message: `Your payment not found`,
        };
      }
    } catch (error) {
      this.handleError(error, 'Error requesting LiqPay API for status check');
    }
  }

  async sendRequestToLiqPay(data: string, signature: string): Promise<any> {
    const url = 'https://www.liqpay.ua/api/request';

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          `data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'LiqPay API Error: Failed to send request');
    }
  }

  async createPayment(
    userData: IUserData,
  ): Promise<PaymentResponseDto | MessageDto> {
    const user = await this.findUserByEmail(userData.email);
    const existingPurchase = await this.premiumPurchaseRepository.findOne({
      where: { user },
    });

    if (existingPurchase) {
      return { message: 'You already have a premium account' };
    }

    const orderId = this.generateOrderId();
    const jsonData = this.buildPaymentData(orderId);
    const encodedData = this.base64Encode(
      Buffer.from(JSON.stringify(jsonData)),
    );
    const signature = this.generateSignature(encodedData);

    try {
      const response = await this.callLiqPayApi(encodedData, signature);

      if (response.status === 200 && response?.request?.res?.responseUrl) {
        await this.createPremiumPurchase(orderId, user);
        return this.createPaymentSuccessResponse(response, orderId);
      }

      throw new HttpException(
        'Payment request failed. Response from LiqPay:',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      this.handleError(error, 'Payment request failed. Response from LiqPay:');
    }
  }

  private generateOrderId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private base64Encode(data: Buffer): string {
    return data.toString('base64');
  }

  private generateSignature(data: string): string {
    const signString =
      this.liqPayConfig.liqPayPrivateKey +
      data +
      this.liqPayConfig.liqPayPrivateKey;
    return this.base64Encode(
      crypto.createHash('sha1').update(signString).digest(),
    );
  }

  private async callLiqPayApi(data: string, signature: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://www.liqpay.ua/api/3/checkout', null, {
          params: {
            data,
            signature,
          },
        }),
      );

      if (!response?.data) {
        throw new Error('No data received from LiqPay API');
      }

      return response;
    } catch (error) {
      this.handleError(error, 'Payment request failed. Response from LiqPay:');
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  private buildPaymentData(orderId: string) {
    return {
      public_key: this.liqPayConfig.liqPayPublicKey,
      version: '3',
      action: 'pay',
      amount: '100',
      currency: 'UAH',
      description: 'Purchase of a premium account',
      order_id: orderId,
    };
  }

  private async createPremiumPurchase(orderId: string, user: any) {
    const premiumPurchase = this.premiumPurchaseRepository.create({
      orderId,
      user,
    });
    await this.premiumPurchaseRepository.save(premiumPurchase);
  }

  private createPaymentSuccessResponse(
    response: any,
    orderId: string,
  ): PaymentResponseDto {
    return {
      status: response.status,
      message: 'Payment link generated successfully',
      orderId,
      paymentLink: response.request.res.responseUrl,
      testCards: [
        {
          cardNumber: '4000000000003055',
          message: 'Successful payment with CVV',
        },
        { cardNumber: '4000000000000002', message: 'Unsuccessful payment' },
      ],
      confirmationInstruction: `After payment, confirm the payment with your "orderId" by sending a POST request to: apiUrl/premium/confirmation-of-payment/${orderId}`,
    };
  }

  async getOrderIdByUserId(userId: UserID): Promise<OrderIdDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const premiumPurchase =
      await this.premiumPurchaseRepository.findPremiumPurchaseByUserId(userId);
    if (!premiumPurchase)
      throw new HttpException(
        'No premium purchase found for this user',
        HttpStatus.NOT_FOUND,
      );

    return { orderId: premiumPurchase.orderId };
  }
}
