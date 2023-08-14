import express, { Request, Response } from "express";
import userManager from "../managers/user.manager";
import { LoginForm } from "../models/forms/login.form";
import { validate } from "class-validator";
import { SignupForm } from "../models/forms/signup.form";
import { UpdateLoginTime } from "../models/forms/updateLoginTime.form";
const authenticationRouter = express.Router();

//forgetpassword

authenticationRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let form = new LoginForm();
  form.email = email;
  form.password = password;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await userManager.login(email, password);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

authenticationRouter.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, company, email, phoneNumber, password } =
    req.body;
  let form = new SignupForm();
  form.email = email;
  form.password = password;
  form.firstName = firstName;
  form.lastName = lastName;
  form.phoneNumber = phoneNumber;
  form.company = company;
  const errors = await validate(form);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: "validation_error",
      message: errors,
    });
    return;
  }
  let result = await userManager.SignUp(
    firstName,
    lastName,
    company,
    password,
    phoneNumber,
    email
  );
  if (result.message === "email already exists") {
    res.json({ message: "Email already has been registered", result: result });
  } else {
    res.json({ message: "registration Succssful", result: result });
  }
});

export default authenticationRouter;
