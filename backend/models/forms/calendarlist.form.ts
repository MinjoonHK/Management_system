import { IsNumber, IsString } from "class-validator";
export class CalendarListForm {
  @IsString()
  Name?: string;

  @IsString()
  Color?: string;
}
