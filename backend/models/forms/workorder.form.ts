import { IsNumber, IsString } from "class-validator";
export class workorderform {
  @IsString()
  ordersummary?: string;

  @IsNumber()
  ID?: number;

  @IsString()
  DatePicker?: string;

  @IsString()
  Email?: string;

  @IsString()
  Name?: string;

  @IsString()
  Company?: string;

  @IsString()
  Contact?: string;
}
