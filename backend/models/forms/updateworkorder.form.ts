import { IsNumber } from "class-validator";

export class updateWorkOrder {
  @IsNumber({}, { each: true })
  numbers: number[] = [];
}
