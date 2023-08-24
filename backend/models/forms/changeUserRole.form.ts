import { IsNumber, IsString } from "class-validator";
export class userRoleChangeForm {
  @IsNumber()
  selectedProject?: Number;

  @IsString()
  selectedUser?: String;

  @IsString()
  Role?: String;
}
