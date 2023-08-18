import { IsNumber, IsString } from "class-validator";
export class updateGanttDateForm {
  @IsNumber()
  TaskID?: number;

  @IsString()
  NewStart?: string;

  @IsString()
  NewEnd?: string;
}
