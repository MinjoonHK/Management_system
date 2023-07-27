const pool = require("../db/db");

export interface User {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Password: string;
  PhoneNumber: string;
  Role: string;
  CompanyID: number;
  isActive: string;
}
