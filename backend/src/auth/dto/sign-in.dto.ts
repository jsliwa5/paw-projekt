import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Niepoprawny format adresu email' })
  email: string;

  @IsNotEmpty({ message: 'Hasło nie może być puste' })
  @IsString()
  password: string;
}