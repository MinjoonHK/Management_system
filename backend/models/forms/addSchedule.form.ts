import { IsDate, IsNumber, IsString } from "class-validator";
export class AddScheduleForm {
  @IsString()
  name?: string;

  @IsString()
  startDate?: string;

  @IsString()
  endDate?: string;

  @IsNumber()
  userID?: number;
}
