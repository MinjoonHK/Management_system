import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class DeleteGanttTaskForm {
  @IsNumber()
  SelectedGantt?: number;

  @IsNumber()
  ProjectID?: number;

  @IsString()
  Type?: number;
}
