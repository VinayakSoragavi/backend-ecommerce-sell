import { IsEmail, IsNotEmpty, IsString, Length} from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  readonly otp: string;
}