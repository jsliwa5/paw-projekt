import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Niepoprawny format adresu email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Hasło musi mieć minimum 6 znaków' })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}