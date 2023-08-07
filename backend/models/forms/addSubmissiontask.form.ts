import { IsDate, IsNumber, IsString } from "class-validator";
export class addsubmissiontaskForm {
  @IsString()
  Name?: String;

  @IsString()
  Manager?: String;

  @IsString()
  DueDate?: String;

  @IsString({ each: true })
  Member: string[] = [];

  @IsString()
  Description?: String;

  @IsString()
  project_ID?: String;
}
