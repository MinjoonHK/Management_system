import { randomBytes, timingSafeEqual, scryptSync } from "crypto";
import { User } from "../models/usermodel";
import jwt from "jsonwebtoken";
import { pool } from "../db/db";
import config from "config";
const TAG = "UserManager";
class UserManager {
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      let [users, _] = (await pool.query(
        "SELECT * FROM user WHERE Email = ? limit 0, 1",
        [email]
      )) as [User[], any];
      if (users.length) return users[0];
      else return null;
    } catch (err) {
      console.error(new Date(), TAG, "findUserByEmail", err);
      return null;
    }
  }
  async login(username: string, password: string) {
    const user = await this.findUserByEmail(username);
    if (user) {
      if (user.isActive === "Deactivated") {
        return { success: false, error: "user_is_deactivated" };
      }
      let passwordpass = await this.comparePassword(user.Password, password);
      if (passwordpass) {
        await pool.query("UPDATE user SET LastLoginTime = NOW() WHERE ID =?", [
          user.ID,
        ]);
        return { success: true, data: this.generateAccessToken(user) };
      } else {
        return { success: false, error: "invalid_password" };
      }
    } else {
      return { success: false, error: "user_not_found" };
    }
  }
  async SignUp(
    FirstName: string,
    LastName: string,
    Company: string,
    Password: string,
    PhoneNumber: string,
    Email: string
  ) {
    try {
      const hashedPassword = await this.hashPassword(Password);
      const [emailChecker] = await pool.execute(
        "SELECT ID FROM user WHERE Email = ?",
        [Email]
      );
      if (emailChecker.length > 0) {
        return { message: "email already exists", emailChecker };
      }
      const [companyID] = await pool.execute(
        "SELECT ID FROM company WHERE Name = ?",
        [Company]
      );
      const [rows, fields] = await pool.execute(
        "INSERT INTO user (FirstName, LastName, CompanyID, Password, PhoneNumber, Email) VALUES(?, ?, ?, ?, ?, ?);",
        [FirstName, LastName, !companyID.ID, hashedPassword, PhoneNumber, Email]
      );
      return rows.insertId;
    } catch (err) {
      console.error(new Date(), "SignUpManager", err);
      return null;
    }
  }

  async hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptSync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
  generateAccessToken = (user: User): string => {
    return jwt.sign(
      {
        Email: user.Email,
        ID: user.ID,
        Name: user.FirstName,
        Role: user.Role,
      },
      config.get("jwt.passphase")!,
      { expiresIn: "5h" }
    );
  };

  async comparePassword(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    // split() returns array
    const [hashedPassword, salt] = storedPassword.split(".");
    // we need to pass buffer values to timingSafeEqual
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    // we hash the new sign-in password
    const suppliedPasswordBuf = (await scryptSync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    // compare the new supplied password with the stored hashed password
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }
}
const userManager = new UserManager();
export default userManager;
