import { IsDate, IsNumber, IsString } from "class-validator";
export class addProjectForm {
  @IsString()
  ProjectName?: String;

  @IsString()
  Start?: String;

  @IsString({ each: true })
  TeamMembers: string[] = [];
}
