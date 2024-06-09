import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: 'John', description: 'First name of the customer' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the customer' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: '["123 Main St"]', description: 'Street address' })
  @IsArray()
  @IsString({ each: true })
  street: string[];

  @ApiProperty({ example: 'Anytown', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'CA', description: 'Region or state' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: '12', description: 'Region ID' })
  @IsNumber()
  @IsPositive()
  region_id: number;

  @ApiProperty({ example: '12345', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  country_id: string;

  @ApiProperty({ example: '555-555-5555', description: 'Telephone number' })
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

class CartItemDto {
  @ApiProperty({ example: 'product-sku', description: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 1, description: 'Quantity of the product' })
  @IsNumber()
  @IsPositive()
  qty: number;
}

class PaymentMethodDto {
  @ApiProperty({ example: 'checkmo', description: 'Payment method' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

class ShippingMethodDto {
  @ApiProperty({ example: 'flatrate', description: 'Shipping method code' })
  @IsString()
  @IsNotEmpty()
  method_code: string;

  @ApiProperty({ example: 'flatrate', description: 'Shipping carrier code' })
  @IsString()
  @IsNotEmpty()
  carrier_code: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'USD', description: 'Currency ID' })
  @IsString()
  @IsNotEmpty()
  currency_id: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Customer email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: AddressDto,
    description: 'Billing address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billing_address?: AddressDto;

  @ApiProperty({
    type: AddressDto,
    description: 'Shipping address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shipping_address?: AddressDto;

  @ApiProperty({ type: [CartItemDto], description: 'List of items' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ type: PaymentMethodDto, description: 'Payment method' })
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;

  @ApiProperty({ type: ShippingMethodDto, description: 'Shipping method' })
  @ValidateNested()
  @Type(() => ShippingMethodDto)
  shipping_method: ShippingMethodDto;

  @ApiProperty({
    example: true,
    description: 'Flag to use default address',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  use_default_address?: boolean;
}

export class CreateOrderResponseDto {
  @ApiProperty({ example: '5' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
  }
}
