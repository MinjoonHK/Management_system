import { IsEmail, IsString } from "class-validator";
export class LoginForm {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}
