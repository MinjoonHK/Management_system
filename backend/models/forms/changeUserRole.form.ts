import { IsNumber, IsString } from "class-validator";
export class userRoleChangeForm {
  @IsNumber()
  selectedProject?: Number;

  @IsString()
  User?: String;

  @IsString()
  Role?: String;
}
