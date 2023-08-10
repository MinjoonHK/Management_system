import express, { Request, Response } from "express";
import { AddCompanyForm } from "../models/forms/addCompany.form";
import { DeleteUser } from "../models/forms/deleteUser.form";
import { ReactivateUser } from "../models/forms/activateUser.form";
import { validate } from "class-validator";
import {
  addCompanyManager,
  getUserProfile,
  getCompanyList,
  getUserList,
  getSiteList,
  getPerformanceInfo,
  deleteUserProfile,
  ActivateUser,
  addworkorder,
  getWorkOrder,
  updateworkorder,
  addScheduleManager,
  getSchedule,
  addTimesheetManager,
  getCalendarList,
  getTimeSheet,
  addCalendarListManager,
  deleteCalenderListManager,
  updateCalendarColor,
  addProjectList,
  getProjectList,
  deleteProjectList,
  getJoinedUserList,
  addProjectTask,
  getProjectTask,
  deleteTask,
  getTaskPeple,
  getActivityLogs,
  deleteGanttTask,
} from "../managers/dashboard.manager";
import { workorderform } from "../models/forms/workorder.form";
import { updateWorkOrder } from "../models/forms/updateworkorder.form";
import { AddScheduleForm } from "../models/forms/addSchedule.form";
import { TimeSheetForm } from "../models/forms/timeSheet.form";
import { CalendarListForm } from "../models/forms/calendarlist.form";
import { addProjectForm } from "../models/forms/addProject.form";
import uploadRouter from "./upload";
import { idForm } from "../models/forms/idforms";
import { addsubmissiontaskForm } from "../models/forms/addSubmissiontask.form";
import { getTaskUser } from "../models/forms/getTaskUser.form";
import { getActivityLogsForm } from "../models/forms/getActivityLog.form";

const dashboardRouter = express.Router();

dashboardRouter.use("/upload", uploadRouter);

dashboardRouter.get("/companylist", async (req, res) => {
  try {
    const result = await getCompanyList();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/sitelist", async (req, res) => {
  try {
    const result = await getSiteList();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/performance", async (req, res) => {
  const Location = req.query.Location as string;
  try {
    const result = await getPerformanceInfo(Location);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/projectList", async (req, res) => {
  const ID = req.userId;
  try {
    const result = await getProjectList(ID!);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/userlist", async (req, res) => {
  try {
    const result = await getUserList();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** Need to be modified */
dashboardRouter.post("/deactivateuser", async (req, res) => {
  const ID = req.body.params.DeactivateUserList;
  let form = new DeleteUser();
  form.numbers = ID;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await deleteUserProfile(ID);
  if (result) {
    res.status(200).send("Successfully deleted user");
  } else {
    res.status(400).json("Failed to delete user");
  }
});

dashboardRouter.post("/projectList", async (req, res) => {
  const { ProjectName, Start, End, TeamMembers, Budget, TeamManagers, Guests } =
    req.body;
  const ID = req.userId;
  let form = new addProjectForm();
  form.ProjectName = ProjectName;
  form.Start = Start;
  form.End = End;
  form.TeamMembers = TeamMembers;
  form.Budget = Budget;
  form.TeamManagers = TeamManagers;
  form.Guests = Guests;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await addProjectList(
    ProjectName,
    Start,
    End,
    ID!,
    TeamMembers,
    Budget,
    TeamManagers,
    Guests
  );
  if (result) {
    res.json({ message: "successfully added", result: result });
  } else {
    res
      .status(400)
      .json({ message: "failed to add the project", result: result });
  }
});

dashboardRouter.post("/finishorder", async (req, res) => {
  const ID = req.body.params.FinishOrderList;
  let form = new updateWorkOrder();
  form.numbers = ID;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await updateworkorder(ID);
  if (result) {
    res.status(200).send("Successfully updated Working Status");
  } else {
    res.status(400).json("Failed to Update Working Status");
  }
});

dashboardRouter.post("/activateuser", async (req, res) => {
  const ID = req.body.params.ActivateUserList;
  let form = new ReactivateUser();
  form.numbers = ID;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await ActivateUser(ID);
  if (result) {
    res.status(200).send("Successfully deleted user");
  } else {
    res.status(400).json("Failed to delete user");
  }
});

dashboardRouter.get("/workorder", async (req, res) => {
  try {
    const result = await getWorkOrder();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.post(
  "/workorder/addworkorder",
  async (req: Request, res: Response) => {
    const { ID, DatePicker, ordersummary, Email, Company, Name, Contact } =
      req.body;
    let form = new workorderform();
    form.ID = ID;
    form.DatePicker = DatePicker;
    form.ordersummary = ordersummary;
    form.Email = Email;
    form.Company = Company;
    form.Name = Name;
    form.Contact = Contact;
    const errors = await validate(form);
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        error: "validation_error",
        message: errors,
      });
      return;
    }
    let result = await addworkorder(
      ID,
      DatePicker,
      ordersummary,
      Email,
      Company,
      Name,
      Contact
    );
    if (result) {
      res.status(200).send("Successfully deleted user");
    } else {
      res.status(400).json("Failed to delete user");
    }
  }
);

dashboardRouter.post(
  "/companylist/addcompany",
  async (req: Request, res: Response) => {
    const { company, owner, phoneNumber, address } = req.body;
    let form = new AddCompanyForm();
    form.company = company;
    form.phoneNumber = phoneNumber;
    form.owner = owner;
    form.address = address;
    const errors = await validate(form);
    if (errors.length > 0) {
      //if there is error
      res.status(400).json({
        success: false,
        error: "validation_error",
        message: errors,
      });
      return;
    }
    let result = await addCompanyManager(company, owner, phoneNumber, address);

    if (result) {
      res.status(200).send("registration successful");
    } else {
      res.status(400).json("registration failed");
    }
  }
);

dashboardRouter.post(
  "/ganttchart/addschedule",
  async (req: Request, res: Response) => {
    const { name, startDate, endDate, Type, Dependencies } = req.body;
    console.log(req.body);
    const userID = req.userId;
    let form = new AddScheduleForm();
    form.name = name;
    form.startDate = startDate;
    form.Dependencies = Dependencies;
    form.endDate = endDate;
    form.Type = Type;
    form.userID = userID;
    const errors = await validate(form);
    if (errors.length > 0) {
      res.status(400).json({
        status: false,
        error: "validation_error",
        message: errors,
      });
      return;
    }
    let result = await addScheduleManager(
      name,
      startDate,
      endDate,
      userID!,
      Type,
      Dependencies
    );
    if (result) {
      res.json({
        message: "successfully added the schedule",
        status: true,
        result: result,
      });
    } else {
      res.json({
        message: "Failed to add schedule",
        status: false,
        error: result,
      });
    }
  }
);

dashboardRouter.post("/timesheet", async (req: Request, res: Response) => {
  const { Title, Start, End, CalendarID, Description } = req.body;
  const userID = req.userId;
  let form = new TimeSheetForm();
  form.Title = Title;
  form.Start = Start;
  form.End = End;
  form.CalendarID = CalendarID;
  form.Description = Description;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await addTimesheetManager(
    Title,
    Start,
    End,
    userID!,
    CalendarID,
    Description
  );
  if (result) {
    res.json(result);
  } else {
    res.status(400).json("registration failed");
  }
});

dashboardRouter.get("/userinformation", async (req, res) => {
  const ID = req.userId;
  try {
    const result = await getUserProfile(ID!);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/schedule", async (req, res) => {
  const ID = req.userId;
  try {
    const result = await getSchedule(ID!);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.get("/timesheet", async (req, res) => {
  const ID = req.userId;
  try {
    const result = await getTimeSheet(ID!);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dashboardRouter.post("/calendarlist", async (req: Request, res: Response) => {
  const { Name, Color } = req.body;
  const ID = req.userId;
  let form = new CalendarListForm();
  form.Name = Name;
  form.Color = Color;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await addCalendarListManager(ID!, Name, Color);
  if (result) {
    res.json({ status: true });
  } else {
    res.status(400).json("Maximum Number reached!");
  }
});

dashboardRouter.post("/updatecalendar", async (req: Request, res: Response) => {
  const { Name, Color } = req.body;
  const ID = req.userId;
  let form = new CalendarListForm();
  form.Name = Name;
  form.Color = Color;
  const errors = await validate(form);
  if (errors.length > 0) {
    //if there is error
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await updateCalendarColor(ID!, Name, Color);
  if (result) {
    res.status(200).json("Successfully updated the color");
  } else {
    res.status(400).json("Failed to update the color");
  }
});

dashboardRouter.post("/deleteCalendar", async (req: Request, res: Response) => {
  const { CalendarID } = req.body;
  const ID = req.userId;
  let result = await deleteCalenderListManager(CalendarID, ID!);
  if (result) {
    res.json({ status: true, result: result });
  } else {
    res.status(400).json("Internal Error Occurred!");
  }
});

// need to fix
dashboardRouter.post(
  "/deleteProjectList",
  async (req: Request, res: Response) => {
    const { ProjectID } = req.body;
    const ID = req.userId;
    let result = await deleteProjectList(ProjectID, ID!);
    if (result) {
      res.json({ status: true });
    } else {
      res.status(400).json({
        message: "Error occured at deleting ProjectList",
        result: result,
      });
    }
  }
);

dashboardRouter.get("/calendarlist", async (req, res) => {
  const startDate = req.query.start as string;
  const endDate = req.query.end as string;
  const ID = req.userId;
  if (ID)
    try {
      const result = await getCalendarList(
        ID,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

dashboardRouter.get("/joinedUserList", async (req, res) => {
  const project_ID = Number(req.query.project_ID);

  if (project_ID) {
    try {
      const result = await getJoinedUserList(project_ID);

      if (result) {
        try {
          res.json({
            message: "successfully loaded joined user list opitons",
            result: result,
          });
        } catch (error) {
          res.json({
            message: "error occured in get joined user List",
            error: error,
          });
        }
      }
    } catch (error) {
      res.json({ message: "get joined user list error", error: error });
    }
  }
});

dashboardRouter.post("/addsubmissiontask", async (req, res) => {
  const { Name, Manager, Member, DueDate, Description, project_ID } = req.body;
  const ID = req.userId;
  let form = new addsubmissiontaskForm();
  form.Name = Name;
  form.Manager = Manager;
  form.Member = Member;
  form.DueDate = DueDate;
  form.Description = Description;
  form.project_ID = project_ID;
  let result = await addProjectTask(
    Name,
    Manager,
    Member,
    DueDate,
    Description,
    ID!,
    project_ID
  );
  if (result) {
    try {
      res.json({ status: "success", result: result });
    } catch (error) {
      res.json({ message: "error occured at addsubmissiontask", error: error });
    }
  }
});

dashboardRouter.get("/submissiontask", async (req, res) => {
  const project_ID = Number(req.query.project_ID);
  let result = await getProjectTask(project_ID);
  if (result) {
    try {
      res.json({ status: "OK", result: result });
    } catch (error) {
      res.json({ message: "error at get submission task list", error });
    }
  }
});

dashboardRouter.post("/deleteTaskList", async (req: Request, res: Response) => {
  const TaskID = Number(req.body.TaskID);
  const ID = req.userId;
  let form = new idForm();
  form.TaskID = TaskID;
  form.ID = ID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await deleteTask(TaskID, ID!);
  if (result) {
    res.json({ status: true });
  } else {
    res.status(400).json({
      message: "Error occured at deleting ProjectList",
      result: result,
    });
  }
});

dashboardRouter.get("/getTaskPeople", async (req, res) => {
  const TaskID = Number(req.query.TaskID);
  let form = new getTaskUser();
  form.TaskID = TaskID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  const response = await getTaskPeple(TaskID);
  if (response) {
    res.json({
      message: "successfully loaded TaskPeople",
      status: "success",
      result: response,
    });
  } else {
    res.send("Manager Error occurred at getTaskPeople");
  }
});

dashboardRouter.get("/activityLogs", async (req, res) => {
  const project_ID = Number(req.query.project_ID);
  let form = new getActivityLogsForm();
  form.projectID = project_ID;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  const response = await getActivityLogs(project_ID);
  if (response) {
    res.json({
      message: "successfully loaded activity logs",
      status: true,
      result: response,
    });
  } else {
    res.json({ message: "failed to load activity logs", error: response });
  }
});

// dashboardRouter.get("/getProjectSchedule", async (req, res) => {
//   const response = await getProjectSchedule();
// });

dashboardRouter.post("/deleteGantt", async (req, res) => {
  console.log(req.body);
  const { SelectedGantt } = req.body;
  const userID = req.userId;
  console.log(req.query);
  const response = await deleteGanttTask(SelectedGantt, userID!);
  if (response) {
    res.json({
      message: "successfully deleted ganttChartTask!",
      status: true,
      result: response,
    });
  } else {
    res.json({ message: "failed to delete ganttChartTask!", error: response });
  }
});

export default dashboardRouter;
