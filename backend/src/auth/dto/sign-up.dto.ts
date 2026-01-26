import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class SignUpDto {
  @IsEmail({}, { message: 'Niepoprawny format adresu email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Hasło musi mieć minimum 6 znaków' })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Rola musi być jedną z wartości: USER lub MANAGER'
  })
  role: Role;
}