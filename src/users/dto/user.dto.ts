import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter the name' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Please enter the email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;
}