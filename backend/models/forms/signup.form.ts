import { IsEmail, IsString } from "class-validator";
export class SignupForm {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  company?: string;

  @IsString()
  phoneNumber?: string;
}
