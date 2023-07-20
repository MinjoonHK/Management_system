import { pool } from "../db/db";
import { User } from "../models/usermodel";

export async function addCompanyManager(
  company: string,
  owner: string,
  phoneNumber: string,
  address: string
) {
  try {
    const [rows, fields] = await pool.execute(
      "INSERT INTO company ( Name, Owner, Contact, Address) VALUES(?, ?, ?, ?);",
      [company, owner, phoneNumber, address]
    );
    return rows.insertId;
  } catch (err) {
    console.error(new Date(), "addCompanyManager", err);
    return null;
  }
}

export async function addScheduleManager(
  name: string,
  startDate: Date,
  endDate: Date,
  userID: number
) {
  try {
    const [rows, fields] = await pool.execute(
      "INSERT INTO ganttchart ( Name, StartDate, EndDate, user_id) VALUES( ?, ?, ?,?);",
      [name, startDate, endDate, userID]
    );
    return rows.insertId;
  } catch (err) {
    console.error(new Date(), "addScheduleManager", err);
    return null;
  }
}

export async function deleteUserProfile(ID: number[]) {
  try {
    const query =
      "UPDATE user SET isActive = 'Deactivated', deleted_at = NOW() WHERE isActive = 'Active' AND ID = ?";
    let affectedRows = 0;
    for (const id of ID) {
      const result = await pool.query(query, id);
      console.log(result);
      affectedRows += result[0].affectedRows;
      console.log(result);
    }
    console.log(affectedRows, "users have successfully deleted");
    return affectedRows;
  } catch (err) {
    console.error(new Date(), "deleteUserProfile", err);
    return 0;
  }
}

export async function ActivateUser(ID: number[]) {
  try {
    const query =
      "UPDATE user SET isActive = 'Active', deleted_at = null WHERE isActive = 'Deactivated' AND ID = ?";
    let affectedRows = 0;
    for (const id of ID) {
      const result = await pool.query(query, id);
      affectedRows += result[0].affectedRows;
    }
    console.log(affectedRows, "users have successfully Activated");
    return affectedRows;
  } catch (err) {
    console.error(new Date(), "deleteUserProfile", err);
    return 0;
  }
}

export async function updateworkorder(ID: number[]) {
  try {
    const query =
      "UPDATE workorder SET Status = 'Completed', EndDate = NOW() WHERE Status = 'Progressing' AND ID = ?";
    let affectedRows = 0;
    for (const id of ID) {
      const result = await pool.query(query, id);
      affectedRows += result[0].affectedRows;
    }
    console.log(affectedRows, "Order Status have Successfully Updated");
    return affectedRows;
  } catch (err) {
    console.error(new Date(), "updateworkorder", err);
    return 0;
  }
}

export async function getUserProfile(ID: number) {
  try {
    let [users, _] = (await pool.query(
      "SELECT FirstName, LastName, Email, Role, PhoneNumber, isActive, created_at, Company FROM user WHERE ID = ? limit 0, 1",
      [ID]
    )) as [User[], any];
    if (users.length) return users[0];
    else return null;
  } catch (err) {
    console.error(new Date(), "getUserProfile", err);
    return null;
  }
}

export async function getCompanyList() {
  try {
    let [companies] = await pool.query(
      "SELECT ID, Contact, Owner, Address,Created_at, Name FROM company"
    );
    return companies;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function getUserList() {
  try {
    let [result] = await pool.query(
      "SELECT ID, FirstName, PhoneNumber, isActive, Email, Created_at, Role, Company FROM user"
    );
    return result;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function getSchedule(ID: number) {
  try {
    let [result] = await pool.query(
      "SELECT ID, StartDate, EndDate, Name, Progress, Type FROM ganttChart WHERE user_id = ?",
      [ID]
    );
    return result;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function getSiteList() {
  try {
    let [result] = await pool.query("SELECT LocationName FROM site");
    return result;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function getWorkOrder() {
  try {
    let [result] = await pool.query(
      "SELECT ID, Contact, Status, Orderer, Email, Company, OrderSummary, StartDate, EndDate FROM workorder"
    );
    return result;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function getPerformanceInfo(Location: string) {
  try {
    const siteQuery = "SELECT ID from site WHERE LocationName = ?";
    const [site] = await pool.query(siteQuery, [Location]);
    const siteID = site[0].ID;
    const resultQuery =
      "SELECT Serial_Number, Status FROM devices WHERE site_ID = ?";
    let [result] = await pool.query(resultQuery, [siteID]);
    return result;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function addTimesheetManager(
  Title: string,
  Start: string,
  End: string,
  userID: number
) {
  try {
    const [rows, fields] = await pool.execute(
      "INSERT INTO timesheet ( Title, Start, End, user_ID) VALUES( ?, ?, ?,?);",
      [Title, Start, End, userID]
    );
    return rows.insertId;
  } catch (err) {
    console.error(new Date(), "addTimeSheetManager", err);
    return null;
  }
}

export async function getTimeSheet(ID: number) {
  try {
    const resultQuery =
      "SELECT Start,End, Title  FROM timesheet WHERE user_ID = ?";
    let [result] = await pool.query(resultQuery, [ID]);
    return result;
  } catch (err) {
    console.error(new Date(), "getTimeSheet", err);
    return null;
  }
}

export async function addworkorder(
  ID: number,
  DatePicker: string,
  ordersummary: string,
  Email: string,
  Company: string,
  Name: string,
  Contact: string
) {
  try {
    const [rows, fields] = await pool.execute(
      "INSERT INTO workorder (Orderer, Email, Company,Contact, OrderSummary, StartDate, user_ID) VALUES(?, ?, ?, ?, ?, ?, ?);",
      [Name, Email, Company, Contact, ordersummary, DatePicker, ID]
    );
    return rows.insertId;
  } catch (err) {
    console.error(new Date(), "addWorkOrder", err);
    return null;
  }
}
