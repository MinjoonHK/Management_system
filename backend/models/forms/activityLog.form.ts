import { IsEmail, IsNumber, IsString } from "class-validator";
export class ActivityLogsForm {
  @IsNumber()
  TaskID?: Number;

  @IsNumber()
  projectID?: Number;

  @IsNumber()
  userID?: Number;
}
