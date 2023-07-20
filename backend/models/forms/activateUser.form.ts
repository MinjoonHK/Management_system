import { IsNumber } from "class-validator";

export class ReactivateUser {
  @IsNumber({}, { each: true })
  numbers: number[] = [];
}
