import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsString()
  @Length(6)
  readonly otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}