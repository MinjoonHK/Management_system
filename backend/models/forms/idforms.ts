import { IsNumber } from "class-validator";

export class idForm {
  @IsNumber()
  TaskID?: Number;
  ID?: Number;
}
