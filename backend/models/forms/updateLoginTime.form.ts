import { IsDate, IsNumber, IsString } from "class-validator";
export class UpdateLoginTime {
  @IsNumber()
  ID?: number;

  @IsString()
  LastLoginTime?: number;
}
