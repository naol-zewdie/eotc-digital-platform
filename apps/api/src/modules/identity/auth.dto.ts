import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { message: 'A valid email address is required.' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password!: string;
}

export class RegisterRequestDto {
  @IsEmail({}, { message: 'A valid email address is required.' })
  email!: string;

  @IsNotEmpty({ message: 'Display name is required.' })
  @IsString()
  displayName!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters for security.' })
  password!: string;
}

export class AssignChurchRequestDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  churchId!: string;
}
