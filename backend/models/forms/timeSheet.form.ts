import { IsNumber, IsString } from "class-validator";
export class TimeSheetForm {
  @IsNumber()
  UserID? = Number;

  @IsString()
  Start? = String;

  @IsString()
  Title? = String;
  @IsString()
  End? = String;

  @IsNumber()
  CalendarID? = Number;
}
