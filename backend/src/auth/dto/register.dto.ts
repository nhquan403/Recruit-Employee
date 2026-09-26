import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { IsEmail } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password!: string;

  @IsIn(['CANDIDATE', 'EMPLOYER'], {
    message: 'role phải là CANDIDATE hoặc EMPLOYER',
  })
  role!: 'CANDIDATE' | 'EMPLOYER';

  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
