import { IsNumber, IsString } from "class-validator";

export class DeletePrjUser {
  @IsNumber()
  ProjectID?: number;

  @IsString()
  UserEmail?: string;
}
