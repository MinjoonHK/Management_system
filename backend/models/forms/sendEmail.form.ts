import { IsEmail, IsNumber, IsString } from "class-validator";
export class sendEmailForm {
  @IsEmail()
  InviteEmail?: string;

  @IsString()
  Role?: string;

  @IsString()
  token?: string;

  @IsNumber()
  selectedProject?: number;
}
