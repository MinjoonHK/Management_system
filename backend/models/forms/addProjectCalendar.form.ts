import { IsDate, IsNumber, IsString } from "class-validator";
export class addProjectCalendarSchedule {
  @IsString()
  Name?: String;

  @IsString()
  Start?: String;

  @IsString()
  End?: String;

  @IsNumber()
  ProjectID?: Number;

  @IsString()
  Description?: String;

  @IsString({ each: true })
  Member: string[] = [];
}
