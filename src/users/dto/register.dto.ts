import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter the name' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Please enter the username' })
  @IsString()
  readonly username: string;

  @IsNotEmpty({ message: 'Please enter the phone' })
  @IsNumber()
  readonly phone: number;

  @IsNumber()
  readonly alterphone?: number;

  @IsNotEmpty({ message: 'Please enter the email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @IsNotEmpty({ message: 'Please enter the whatsapp' })
  @IsNumber()
  readonly whatsapp: number;

  @IsNotEmpty({ message: 'Please enter the employer id' })
  @IsString()
  readonly empid: string;

  @IsNotEmpty({ message: 'Please enter the jobrole' })
  @IsString()
  readonly jobrole: string;

  @IsNotEmpty({ message: 'Please enter the jobmode' })
  @IsString()
  readonly jobmode: string;

  @IsString()
  readonly address?: string;

  @IsString()
  readonly address_line?: string;

  @IsString()
  readonly city?: string;

  @IsString()
  readonly state?: string;

  @IsNumber()
  readonly pincode?: number;
}
