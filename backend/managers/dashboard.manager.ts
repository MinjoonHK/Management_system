import { endOfDay, format, startOfDay } from "date-fns";
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
      "SELECT FirstName, LastName, Email, Role, PhoneNumber, isActive, created_at, CompanyID FROM user WHERE ID = ? limit 0, 1",
      [ID]
    )) as [User[], any];
    const companyID = users[0].CompanyID;
    const [getUserCompany] = await pool.query(
      "SELECT Name from company WHERE ID = ?",
      [companyID]
    );
    const result = { ...users[0], ...getUserCompany[0] };
    return result;
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

export async function getProjectList(ID: Number) {
  try {
    const [result1] = await pool.query(
      "SELECT ID, ProjectName from project WHERE User_ID = ? AND Deleted_At IS NULL ",
      [ID]
    );

    const [result2] = await pool.query(
      "SELECT project_ID, Joined_User_Email from projectpeople WHERE project_ID IN (?)",
      [result1.map((project: any) => project.ID)]
    );

    const projectList = result1.map((project: any) => {
      const joinedUsers = result2
        .filter((join: any) => join.project_ID === project.ID)
        .map((join: any) => join.Joined_User_Email);
      return { ...project, joinedUsers };
    });

    return projectList;
  } catch (err) {
    console.error(new Date(), "getComapnyList", err);
    return null;
  }
}

export async function addProjectList(
  ProjectName: string,
  Start: String,
  ID: Number,
  TeamMembers: String[]
) {
  try {
    const [result1] = await pool.execute(
      "INSERT INTO project (ProjectName, Start, User_ID) VALUES(?,?,?)",
      [ProjectName, Start, ID]
    );
    const [lastAddedProject] = await pool.execute(
      "SELECT ID FROM project WHERE User_ID =? ORDER BY ID DESC LIMIT 1",
      [ID]
    );
    let affectedRows = 0;
    for (const email of TeamMembers) {
      const [result2, fields] = await pool.execute(
        "INSERT INTO projectpeople (Joined_User_Email,project_ID) VALUES(?,?)",
        [email, lastAddedProject[0].ID]
      );
      affectedRows += result2.affectedRows;
    }
    console.log(affectedRows);
    if (result1 && affectedRows > 0) {
      return (
        new Date(),
        result1,
        "sucessfully added",
        affectedRows,
        "have inserted to projectpeople Table"
      );
    }
  } catch (err) {
    console.error(new Date(), "addTimeSheetManager", err);
    return null;
  }
}

export async function addTimesheetManager(
  Title: string,
  Start: string,
  End: string,
  userID: number,
  CalendarID: number
) {
  try {
    const [rows] = await pool.execute(
      "INSERT INTO timesheet ( Title, Start, End, UserID, CalendarID) VALUES( ?, ?, ?,?,?);",
      [Title, Start, End, userID, CalendarID]
    );
    const [result] = await pool.execute(
      "SELECT CalendarID, Title from timesheet WHERE UserID =? AND CalendarID = ?",
      [userID, CalendarID]
    );
    console.log(result);
    return result;
  } catch (err) {
    console.error(new Date(), "addTimeSheetManager", err);
    return null;
  }
}

export async function getTimeSheet(ID: number) {
  try {
    const resultQuery =
      "SELECT Start,End, Title,CalendarID, Description FROM timesheet WHERE UserID = ?";
    let [result] = await pool.query(resultQuery, [ID]);
    return result;
  } catch (err) {
    console.error(new Date(), "getTimeSheet", err);
    return null;
  }
}

export async function getCalendarList(
  ID: number,
  startRange: Date,
  endRange: Date
) {
  try {
    const resultQuery =
      "SELECT Name, ID, Color FROM calendar WHERE user_ID = ?";
    let [result] = await pool.query(resultQuery, [ID]);
    const resultQuery2 =
      "SELECT ID, Start,End, Title,CalendarID FROM timesheet WHERE CalendarID  IN  (?) AND Start >= ? and End <=?";
    let [result2] = await pool.query(resultQuery2, [
      result.map((d: any) => d.ID),
      format(startOfDay(startRange), "yyyy-MM-dd"),
      format(endOfDay(endRange), "yyyy-MM-dd"),
    ]);

    let finalResult = result.map((r: any) => {
      return {
        ...r,
        schedules: result2.filter((r2: any) => r2.CalendarID === r.ID),
      };
    });
    return finalResult;
  } catch (err) {
    console.error(new Date(), "getCalendarList", err);
    return null;
  }
}

export async function updateCalendarColor(
  ID: number,
  Name: string,
  Color: string
) {
  try {
    const [rows, fields] = await pool.execute(
      "UPDATE calendar SET Color = ? WHERE Name = ? AND user_ID = ?",
      [Color, Name, ID]
    );
    return true;
  } catch (error) {
    return new Date(), "updateCalendarColor Error", error;
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

export async function addCalendarListManager(
  ID: Number,
  Name: string,
  Color: string
) {
  try {
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) AS count FROM calendar WHERE user_ID = ?",
      [ID]
    );

    const count = countRows[0].count;

    if (count >= 5) {
      throw new Error("Maximum number of calendars reached");
    }
    const [result] = await pool.execute(
      "INSERT INTO calendar (user_ID,Name,Color) VALUES(?, ?, ?);",
      [ID, Name, Color]
    );
    return true;
  } catch (err) {
    console.error(new Date(), "addCalendarListManager", err);
    return false;
  }
}

export async function deleteCalenderListManager(
  CalendarID: Number,
  ID: Number
) {
  try {
    const result =
      "UPDATE calendar SET isActive = 'Deactivated', deleted_at = NOW() WHERE isActive = 'Active' AND ID = ?";

    return result;
  } catch (err) {
    console.error(new Date(), "deleteUserProfile", err);
    return 0;
  }
}

export async function deleteProjectList(ProjectID: Number, ID: Number) {
  try {
    const result = pool.execute(
      "UPDATE project SET Deleted_At = NOW() WHERE ID = ? AND User_ID = ?",
      [ProjectID, ID]
    );
    return result;
  } catch (err) {
    console.error(new Date(), "deleteProjectList", err);
    return 0;
  }
}
