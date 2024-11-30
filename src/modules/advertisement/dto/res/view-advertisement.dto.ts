import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ViewAdvertisementDto {
  @ApiProperty({ example: '1', description: 'View ID' })
  id: string;

  @ApiProperty({
    example: 'd9bfbf99-fbbe-4e9d-a0b1-48dbe65d3278',
    description: 'Advertisement ID',
  })
  advertisement_id: string;

  @ApiProperty({ example: '2023-11-07', description: 'Date of the view' })
  viewDate: Date;

  @ApiProperty({ example: 123, description: 'User ID of the viewer' })
  viewerUserId: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the viewer is the owner/admin',
  })
  @IsBoolean()
  isAdmin?: boolean;
}
