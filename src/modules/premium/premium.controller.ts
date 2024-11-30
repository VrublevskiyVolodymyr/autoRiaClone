import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import {
  MessageDto,
  OrderIdDto,
  PaymentResponseDto,
  PaymentStatusDto,
} from './dto/res/payment-res.dto';
import { LiqPayService } from './services/lig-pay.service';

@ApiBearerAuth()
@ApiTags('Premium')
@Controller('premium')
export class PremiumController {
  constructor(private readonly liqPayService: LiqPayService) {}

  @ApiOperation({
    summary: 'Buy Premium Account',
    description:
      'Initiates the payment process for upgrading the current user to a premium account. Returns payment details or a confirmation message.',
  })
  @Get('/buy-premium')
  async buyPremiumAccount(
    @CurrentUser() userData: IUserData,
  ): Promise<PaymentResponseDto | MessageDto> {
    return await this.liqPayService.createPayment(userData);
  }

  @ApiOperation({
    summary: 'Confirm Payment Status',
    description:
      'Retrieves the payment status for a specific order by its unique identifier (orderId). This endpoint requires the user’s data for verification.',
  })
  @Get('/confirmation-of-payment/:orderId')
  async getPaymentStatus(
    @Param('orderId') orderId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<PaymentStatusDto> {
    return await this.liqPayService.getPayPaymentStatus(orderId, userData);
  }

  @ApiOperation({
    summary: 'Get Order ID by User ID',
    description:
      'Fetches the payment order ID associated with a specific user by their unique identifier (userId). Accessible only by admin and manager roles.',
  })
  @Roles('admin', 'manager')
  @Get(':userId')
  async getOrderIdByUserId(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<OrderIdDto> {
    return await this.liqPayService.getOrderIdByUserId(userId);
  }
}
