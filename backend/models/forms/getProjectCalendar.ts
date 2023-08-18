import { IsNumber } from "class-validator";
export class getProjectCalendar {
  @IsNumber()
  projectID?: Number;
}
