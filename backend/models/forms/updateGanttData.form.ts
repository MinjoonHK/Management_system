import { IsNumber, IsString, IsOptional, IsNotEmpty } from "class-validator";
export class updateGanttData {
  @IsString()
  name?: string;

  @IsNumber()
  Group?: number;

  @IsNumber()
  ProjectID?: number;

  @IsNumber()
  GanttID?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  Member: string[] = [];

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  Manager: string[] = [];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  Description?: string;
}
