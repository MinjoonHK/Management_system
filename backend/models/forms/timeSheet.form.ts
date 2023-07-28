import { IsNumber, IsString } from "class-validator";
export class TimeSheetForm {
  @IsString()
  Start? = String;

  @IsString()
  Title? = String;

  @IsString()
  End? = String;

  @IsNumber()
  CalendarID? = Number;

  @IsString()
  Description? = String;
}
