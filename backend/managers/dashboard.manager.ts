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
  userID: number,
  Type: string,
  Dependencies: number | null,
  DayofDuration: number,
  Group: number,
  projectID: number
) {
  try {
    const [rows, fields] = await pool.execute(
      "INSERT INTO ganttchart (Name, StartDate, EndDate, Type, user_id, Dependencies, DurationOfDay, InGroup, Project_ID) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?);",
      [
        name,
        startDate,
        endDate,
        Type,
        userID,
        Dependencies,
        DayofDuration,
        Group,
        projectID,
      ]
    );
    return rows.insertId;
  } catch (err) {
    console.error(new Date(), "addScheduleManager", err);
    return err;
  }
}

export async function deleteUserProfile(ID: number[]) {
  try {
    const query =
      "UPDATE user SET isActive = 'Deactivated', deleted_at = NOW() WHERE isActive = 'Active' AND ID = ?";
    let affectedRows = 0;
    for (const id of ID) {
      const result = await pool.query(query, id);

      affectedRows += result[0].affectedRows;
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
    console.error(new Date(), "getUserList", err);
    return null;
  }
}

export async function getSchedule(ID: number) {
  try {
    let [result] = await pool.query(
      `SELECT ID, StartDate, EndDate, Name, Type,Dependencies, DurationOfDay, InGroup FROM ganttChart 
      WHERE Project_ID = ? AND Deleted_At IS NULL`,
      [ID]
    );
    return result;
  } catch (err) {
    console.error(new Date(), "getSchedule", err);
    return null;
  }
}
export async function getProjectGanttTask(projectID: number) {
  try {
    let [result] = await pool.query(
      "SELECT ID, StartDate, EndDate, Name, Type,Dependencies, DurationOfDay, InGroup FROM ganttChart WHERE Project_ID = ? AND Deleted_At IS NULL",
      [projectID]
    );
    //Filter out the milestone
    let firstLevels = result.filter(
      (d: { Type: string }) => d.Type === "project"
    );
    //tasks that included in the milestone
    firstLevels = firstLevels.map((p: { tasks: never[]; ID: number }) => {
      p.tasks = result.filter((d: { InGroup: number }) => d.InGroup === p.ID);
      return p;
    });

    return firstLevels;
  } catch (err) {
    console.error(new Date(), "getSchedule", err);
    return null;
  }
}
export async function getSiteList() {
  try {
    let [result] = await pool.query("SELECT LocationName FROM site");
    return result;
  } catch (err) {
    console.error(new Date(), "getSiteList", err);
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
    console.error(new Date(), "getWorkOrder", err);
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
    console.error(new Date(), "getPerformanceInfo", err);
    return null;
  }
}

export async function getProjectList(ID: Number) {
  try {
    const [userEmail] = await pool.query(
      `SELECT Email FROM user WHERE ID = ?`,
      [ID]
    );

    const [result1] = await pool.query(
      `SELECT * FROM project WHERE
      (User_ID = ? OR ID IN (SELECT project_ID FROM electrictracker.projectpeople WHERE Joined_User_Email = ? AND Deleted_At IS NULL))
      AND Deleted_At IS NULL`,
      [ID, userEmail[0].Email]
    );

    const [result2] = await pool.query(
      `SELECT projectpeople.Role, project_ID, Joined_User_Email FROM projectpeople
      LEFT join user on projectpeople.Joined_User_Email = user.Email
      WHERE project_ID IN (?)`,
      [result1.map((project: any) => project.ID)]
    );
    if (result1.length > 0) {
      const projectList = result1.map((project: any) => {
        const joinedUsers = result2
          .filter((join: any) => join.project_ID === project.ID)
          .map((join: any) => join.Joined_User_Email);
        return { ...project, joinedUsers };
      });
      return projectList;
    }
  } catch (err) {
    console.error(new Date(), "getProjectList", err);
    return null;
  }
}

export async function addProjectList(
  ProjectName: string,
  Start: String,
  End: String,
  ID: Number,
  TeamMembers: String[],
  Budget: String,
  TeamManagers: String[],
  Guests: String[]
) {
  try {
    const [creatorName] = await pool.execute(
      "SELECT FirstName FROM user WHERE ID =?",
      [ID]
    );
    const [result1] = await pool.execute(
      "INSERT INTO project (ProjectName, Start,END, User_ID,Budget, CreatorName) VALUES(?,?,?,?,?,?)",
      [ProjectName, Start, End, ID, Budget, creatorName[0].FirstName]
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
    for (const email of TeamManagers) {
      const [result3, fields] = await pool.execute(
        "INSERT INTO projectpeople (Joined_User_Email,project_ID,Role) VALUES(?,?,'Manager')",
        [email, lastAddedProject[0].ID]
      );
      affectedRows += result3.affectedRows;
    }
    for (const email of Guests) {
      const [result4, fields] = await pool.execute(
        "INSERT INTO projectpeople (Joined_User_Email,project_ID,Role) VALUES(?,?,'Guest')",
        [email, lastAddedProject[0].ID]
      );
      affectedRows += result4.affectedRows;
    }
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
  CalendarID: number,
  Description: string
) {
  try {
    const [rows] = await pool.execute(
      "INSERT INTO timesheet ( Title, Start, End, UserID, CalendarID,Description) VALUES( ?, ?, ?,?,?,?);",
      [Title, Start, End, userID, CalendarID, Description]
    );
    const [result] = await pool.execute(
      "SELECT CalendarID, Title from timesheet WHERE UserID =? AND CalendarID = ?",
      [userID, CalendarID]
    );
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
      "SELECT Name, ID, Color FROM calendar WHERE user_ID = ? AND Deleted_at IS NULL";
    let [result] = await pool.query(resultQuery, [ID]);
    const resultQuery2 =
      "SELECT ID, Start,End, Title,CalendarID FROM timesheet WHERE CalendarID  IN  (?) AND (END >= ? AND START <= ?) AND Deleted_At IS NULL";
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
      "SELECT COUNT(*) AS count FROM calendar WHERE user_ID = ? AND Deleted_At IS NULL",
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
    const [result] = await pool.execute(
      "UPDATE calendar SET Deleted_At = NOW() WHERE ID = ? AND user_ID = ?",
      [CalendarID, ID]
    );
    const [result2] = await pool.execute(
      "UPDATE timesheet SET Deleted_At = NOW() WHERE CalendarID = ?",
      [CalendarID]
    );
    return true;
  } catch (err) {
    console.error(new Date(), "deleteCalendarList", err);
    return 0;
  }
}

export async function deleteProjectList(ProjectID: Number, ID: Number) {
  try {
    const result = await pool.execute(
      "UPDATE project SET Deleted_At = NOW() WHERE ID = ? AND User_ID = ?",
      [ProjectID, ID]
    );
    return result;
  } catch (err) {
    console.error(new Date(), "deleteProjectList", err);
    return 0;
  }
}

export async function getJoinedUserList(project_ID: number) {
  try {
    const result = await pool.execute(
      "SELECT Joined_User_Email,Role FROM projectpeople WHERE Deleted_At IS NULL AND project_ID =?",
      [project_ID]
    );
    if (result) {
      return result;
    }
  } catch (error) {
    return { message: "internal Error in get joined user List", error: error };
  }
}

export async function addProjectTask(
  Name: string,
  Manager: string,
  Member: string,
  DueDate: string,
  Description: string,
  ID: number,
  project_ID: number
) {
  let affectedRows = 0;
  try {
    const [creatorName] = await pool.execute(
      "SELECT FirstName from user WHERE ID = ?",
      [ID]
    );
    const [result] = await pool.execute(
      "INSERT INTO submissiontask (Name, DueDate, Description,CreatorID,project_ID,CreatorName) VALUES (?,?,?,?,?,?);",
      [Name, DueDate, Description, ID, project_ID, creatorName[0].FirstName]
    );
    affectedRows += result.affectedRows;
    const [LastID] = await pool.execute(
      "SELECT ID FROM submissiontask WHERE Name = ? AND project_ID =? AND DueDate = ?",
      [Name, project_ID, DueDate]
    );
    const [result2] = await pool.execute(
      "INSERT INTO submissiontaskpeople (Email, Role, submissiontask_ID) VALUES (?,'Manager',?)",
      [Manager, LastID[0].ID]
    );
    affectedRows += result2.affectedRows;
    for (let i = 0; i < Member.length; i++) {
      const [result3] = await pool.execute(
        "INSERT INTO submissiontaskpeople (Email, Role, submissiontask_ID) VALUES (?,'Member',?)",
        [Member[i], LastID[0].ID]
      );

      affectedRows += result3.affectedRows;
    }
    if (result && result2 && affectedRows > 0) {
      const updateLogs = await pool.execute(
        "INSERT INTO activitylog (UserID, ProjectID, Activity,TaskID) VALUES (?,?,'Create Update Task',?)",
        [ID, project_ID, LastID[0].ID]
      );
      return affectedRows;
    }
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

export async function getProjectTask(project_ID: number) {
  try {
    const [result] = await pool.execute(
      "SELECT ID,Name,CreatorName, CreateDate, DueDate, Description,Status FROM submissiontask WHERE Deleted_At IS NULL AND project_ID =?",
      [project_ID]
    );
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    return { message: "internal Error in get joined user List", error: error };
  }
}

export async function deleteTask(TaskID: Number, ID: Number) {
  try {
    const result = await pool.execute(
      "UPDATE submissiontask SET Deleted_At = NOW() WHERE ID = ? AND CreatorID = ?",
      [TaskID, ID]
    );
    return result;
  } catch (err) {
    console.error(new Date(), "deleteTask", err);
    return { message: "deleteTaskError", error: err };
  }
}

export async function getTaskPeple(TaskID: Number) {
  try {
    const [result] = await pool.execute(
      "SELECT Email, Role FROM submissiontaskpeople WHERE submissiontask_ID =?",
      [TaskID]
    );
    if (result) {
      return result;
    }
  } catch (error) {
    console.error(new Date(), "getTaskpeople Error", error);
    return { message: "getTaskPeopleError", error: error };
  }
}

export async function getActivityLogs(project_ID: Number) {
  try {
    const [result] = await pool.execute(
      `SELECT * FROM activitylogs
        WHERE ProjectID = ?
        ORDER BY TimeStamp DESC
      `,
      [project_ID]
    );
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("error at getActivityLogs", error);
    return error;
  }
}

export async function deleteGanttTask(
  SelectedGantt: number,
  ProjectID: number,
  Type: string
) {
  try {
    if (Type === "task") {
      const [result] = await pool.execute(
        `UPDATE ganttchart SET Deleted_At = NOW()
          WHERE Project_ID = ? AND ID = ?`,
        [ProjectID, SelectedGantt]
      );
      console.log(result);
      if (result.affectedRows.length > 0) {
        return result;
      } else {
        return new Date(), "Manager Error at delete gantt task!", result;
      }
    } else if (Type === "project") {
      const [result] = await pool.execute(
        `UPDATE ganttchart SET Deleted_At = Now()
        WHERE Project_ID = ?  AND (ID = ? OR InGroup = ?)
        `,
        [ProjectID, SelectedGantt, SelectedGantt]
      );
      if (result.affectedRows.length > 0) {
        return result;
      } else {
        return new Date(), "Fail to delete milestone!", result;
      }
    }
  } catch (error) {
    return error;
  }
}

export async function getProjectPeople(ProjectID: Number) {
  try {
    const [result] = await pool.execute(
      `SELECT Joined_User_Email, projectpeople.Created_At, projectpeople.Role, FirstName, LastName, LastLoginTime  FROM projectpeople
      LEFT JOIN user on projectpeople.Joined_User_Email = user.Email
        WHERE project_ID = ? AND projectpeople.Deleted_At IS NULL
      `,
      [ProjectID]
    );
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("manager error at getting project people", error);
    return error;
  }
}
