import { IsNumber } from "class-validator";

export class getTaskUser {
  @IsNumber()
  TaskID?: Number;
}
