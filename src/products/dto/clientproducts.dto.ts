import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsEmail,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsBoolean()
  like: boolean;

  @IsNotEmpty()
  @IsBoolean()
  dislike: boolean;
}

export class ClientProductDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDate()
  deliveryDate: Date;

  @IsNotEmpty()
  @IsString()
  productFeature: string;

  @IsNotEmpty()
  @IsObject()
  productPoints: Record<string, string>; // Adjusted to use Record<string, string>

  @IsNotEmpty()
  @IsObject()
  productNote: Record<string, string>; // Adjusted to use Record<string, string>

  @IsNotEmpty()
  @IsObject()
  offers: Record<string, string>; // Adjusted to use Record<string, string>

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];
}
