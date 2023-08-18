import { IsNumber } from "class-validator";
export class getProjectCalendarPeople {
  @IsNumber()
  projectID?: Number;

  @IsNumber()
  selectedTask?: Number;
}
