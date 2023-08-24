import { IsNumber } from "class-validator";
export class getGanttPeopleForm {
  @IsNumber()
  GanttID?: Number;
}
