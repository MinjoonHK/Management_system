import { IsNumber } from "class-validator";
export class updateStatusForm {
  @IsNumber()
  ItemID?: Number;
}
