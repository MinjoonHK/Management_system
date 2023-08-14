import { IsNumber } from "class-validator";
export class getProjectPeopleList {
  @IsNumber()
  ProjectID?: Number;
}
