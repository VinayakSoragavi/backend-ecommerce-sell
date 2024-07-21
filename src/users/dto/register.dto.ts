import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  readonly phone: number;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @IsNotEmpty()
  @IsString()
  readonly designation: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly course: string[];

  @IsOptional()
  @IsString()
  readonly imgUrl?: string;
}
