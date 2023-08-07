import { IsNumber } from "class-validator";
export class getActivityLogsForm {
  @IsNumber()
  projectID?: Number;
}
