import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  item_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 'product-sku' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  qty_ordered: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'Practical Wooden Table' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsPositive()
  row_total: number;
}

class AddressDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: ['123 Main St'] })
  @IsArray()
  @IsString({ each: true })
  street: string[];

  @ApiProperty({ example: 'Anytown' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'CA' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsPositive()
  region_id: number;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  country_id: string;

  @ApiProperty({ example: '555-555-5555' })
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

class PaymentDto {
  @ApiProperty({ example: 'checkmo' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ example: 1005 })
  @IsNumber()
  @IsPositive()
  amount_ordered: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  additional_information: string[];
}

export class GetOrderResponseDto {
  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  base_currency_code: number;

  @ApiProperty({ example: 1005 })
  @IsNumber()
  @IsPositive()
  base_grand_total: number;

  @ApiProperty({ example: 'testuser@example.com' })
  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  billing_address: AddressDto;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shipping_address: AddressDto;

  @ApiProperty({ type: PaymentDto })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ApiProperty({ example: '2024-05-24 20:21:50' })
  @IsDateString()
  created_at: string;

  @ApiProperty({ example: 'new' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'pending' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: '000000001' })
  @IsString()
  @IsNotEmpty()
  increment_id: string;

  constructor(partial: Partial<GetOrderResponseDto>) {
    Object.assign(this, partial);
  }
}
