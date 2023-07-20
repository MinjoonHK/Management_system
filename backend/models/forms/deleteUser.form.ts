import { IsNumber } from "class-validator";

export class DeleteUser {
  @IsNumber({}, { each: true })
  numbers: number[] = [];
}
