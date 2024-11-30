import { ApiProperty } from '@nestjs/swagger';

class TestCardDto {
  @ApiProperty({ description: 'Card number', example: '4000000000003055' })
  cardNumber: string;

  @ApiProperty({
    description: 'Message for the card',
    example: 'Successful payment with CVV',
  })
  message: string;
}

export class OrderIdDto {
  @ApiProperty({
    description: 'Order ID for the premium purchase',
    example: '7cd1db427da2662d1acc962ac16a9a07',
  })
  orderId: string;
}

export class MessageDto {
  @ApiProperty({
    description: 'Message indicating the status or response',
    example: 'You already have a premium account',
  })
  message: string;
}

export class PaymentStatusDto {
  @ApiProperty({
    description: 'The status of the payment indicating whether it was successful or not',
    example: 'successful',
  })
  payment_status: string;

  @ApiProperty({
    description: 'A message confirming the upgrade to Premium account',
    example: 'Congratulations, your account is now Premium!',
  })
  message: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Response status', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Message indicating successful payment link generation',
    example: 'Payment link generated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Order ID',
    example: '7cd1db427da2662d1acc962ac16a9a07',
  })
  orderId: string;

  @ApiProperty({
    description: 'Payment link',
    example:
      'https://www.liqpay.ua/api/3/checkout?order_id=7cd1db427da2662d1acc962ac16a9a07',
  })
  paymentLink: string;

  @ApiProperty({ description: 'Array of test cards', type: [TestCardDto] })
  testCards: TestCardDto[];

  @ApiProperty({
    description: 'Instruction for payment confirmation',
    example:
      'After payment, confirm the payment using your "orderId" by sending a POST request to: apiUrl/premium/confirmation-of-payment/7cd1db427da2662d1acc962ac16a9a07',
  })
  confirmationInstruction: string;
}
