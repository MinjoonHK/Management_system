import { IsEmail, IsString } from "class-validator";
export class AddCompanyForm {
  @IsString()
  address?: string;

  @IsString()
  owner?: string;

  @IsString()
  company?: string;

  @IsString()
  phoneNumber?: string;
}
