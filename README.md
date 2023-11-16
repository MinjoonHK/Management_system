# Management_system
2023.08 여름 인턴십 내부용 매니지먼트 시스템

## 💻 프로젝트 소개
여름 인턴십 기간 동안 수행한 내부용 매니지먼트 시스템의 개인 기록용 리포지토리 입니다.

## ⏲️ 개발 기간
2023.06 - 2023.08

### ⚙️ 개발 환경
<ul>
  <li>React.js, Node.js, TypeScript, Express.js</li>
  <li>node.js 18.11.0</li>
  <li>IDE : VScode, MySQL Workbench</li>
  <li>Database : MySQL</li>
</ul>

### ✔️ERD
<details>
<summary>이미지</summary>

![ERD](https://github.com/MinjoonHK/Management_system/assets/108560916/951ecf1d-37ce-489d-9fe7-cba417f3f132)
</details>

## 📌주요 기능
### -로그인
#### 💻Code

<details>
<summary>checkIsLoggedIn.ts - 유저가 로그인했는지 체크해주는 미들웨어</summary>

```
export function validationIsLogggedIn(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        config.get("jwt.passphase")!
      ) as DecodedToken;
      req.userId = decoded.ID;
      return next();
    } catch (err) {
      console.error(err);
    }
  }
  return next("UNAUTHORIZED ACTION");
}
```
</details>
<details>
<summary>login.tsx - 유저 로그인 페이지 UI</summary>

```
import { Button, Checkbox, Form, Input, Card, Row, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import { decodedToken } from "./dashboard/dashBoard";

interface LoginForm {
  email: any;
  password: any;
}
function Login() {
  console.log("login page");
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();
  const onFinish = async ({ email, password, remember }) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("jwt", res.data.data);
      if (remember) {
        setCookie("rememberEmail", email, { path: "/" });
      } else {
        removeCookie("rememberEmail");
      }
      if (localStorage.getItem("jwt")) {
        const decodedToken: decodedToken = jwt_decode(
          localStorage.getItem("jwt")
        );
        localStorage.setItem("decoded_jwt", JSON.stringify(decodedToken));
        const role: string = decodedToken.Role;
        {
          role === "User" && navigate("/Project");
        }
        {
          role === "Admin" && navigate("/Project");
        }
      }
    } catch (err) {
      if (err.response.status === 400) {
        alert("please enter the correct ID and Password");
      } else {
        alert("Erorr");
      }
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const [email, setEmail] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies(["rememberEmail"]);

  useEffect(() => {
    if (cookies.rememberEmail !== undefined) {
      setEmail(cookies.rememberEmail);
      setTimeout(() => form.resetFields(), 300);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url("https://blusignalsystems.com/wp-content/uploads/2016/12/Savin-NY-Website-Background-Web1.jpg")`,
        backgroundSize: "auto",
        backgroundRepeat: "repeat-x",
        backgroundPositionY: "bottom",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexWrap: "wrap",
        }}
      >
        <Card
          title={
            <div style={{ fontSize: "35px", margin: "5%" }}>
              Management System
            </div>
          }
          style={{
            width: "500px",
            textAlign: "center",
            border: "2px solid gray",
          }}
        >
          <Form
            form={form}
            name="Login"
            layout="vertical"
            style={{ maxWidth: 600, margin: "15px" }}
            initialValues={{ email: email, remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={<div style={{ fontSize: "16px" }}>Email</div>}
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                size="large"
                type="email"
                placeholder="email"
                autoComplete={"email"}
                className="inputValue"
              />
            </Form.Item>

            <Form.Item
              label={<div style={{ fontSize: "16px" }}>Password</div>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                type="password"
                size="large"
                placeholder="password"
                className="inputValue"
              />
            </Form.Item>
            <Row>
              <Col span={12} style={{ textAlign: "left" }}>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Link
                  to="/forgotpassword"
                  style={{ color: "black", lineHeight: "32px" }}
                >
                  Find ID / PW
                </Link>
              </Col>
            </Row>

            <Form.Item>
              <Button
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Login
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/SignUp">
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "rgb(45,68,134)",
                    color: "white",
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Login;

```
</details>
<details>
<summary>이미지</summary>


</details>

### -회원가입
#### 💻Code


### -유저관리
#### 💻Code

### -파일교환
#### 💻Code

### -갠트차트
#### 💻Code

### -달력
#### 💻Code

### -언어지원
#### 💻Code





