import { IsNumber, IsString, IsOptional, IsNotEmpty } from "class-validator";
export class AddScheduleForm {
  @IsString()
  name?: string;

  @IsString()
  startDate?: string;

  @IsString()
  endDate?: string;

  @IsString()
  Type?: string;

  @IsOptional()
  @IsNotEmpty()
  Dependencies?: number;

  @IsOptional()
  @IsNotEmpty()
  Group?: number;

  @IsOptional()
  @IsNotEmpty()
  DurationDay?: number;

  @IsNumber()
  userID?: number;

  @IsNumber()
  ProjectID?: number;

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
