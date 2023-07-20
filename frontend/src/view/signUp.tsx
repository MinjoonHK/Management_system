import { Button, Form, Input, Select, Card } from "antd";
import { useState } from "react";
import axios from "axios";
import { Link, Route, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const { Option } = Select;

function SignUp() {
  const navigate = useNavigate();
  const onFinish = async ({
    firstName,
    lastName,
    company,
    email,
    phoneNumber,
    password,
  }) => {
    try {
      const res = await axios.post("/auth/signup", {
        firstName,
        lastName,
        company,
        email,
        phoneNumber,
        password,
      });
      if (res.status === 200) {
        Swal.fire(
          `Welcome ${firstName}`,
          "You have successfully Signed Up!",
          "success"
        );
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const [firtName, setFirtName] = useState("");
  const [LastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

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
          title={<div style={{ fontSize: "35px", margin: "5%" }}>Sign Up</div>}
          style={{
            width: "500px",
            textAlign: "center",
            border: "2px solid gray",
          }}
        >
          <Form
            name="SignUp"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your First Name!" },
              ]}
            >
              <Input
                placeholder="John"
                className="inputValue"
                onChange={(e) => setFirtName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your Last Name!" },
              ]}
            >
              <Input
                placeholder="Chen"
                className="inputValue"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Company" name="company">
              <Input
                placeholder="ABC Company"
                className="inputValue"
                onChange={(e) => setCompany(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input valid Email address!",
                  type: "email",
                },
              ]}
            >
              <Input
                placeholder="example@gmail.com"
                className="inputValue"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                placeholder="+852 1234 1234"
                className="inputValue"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              hasFeedback
            >
              <Input.Password
                type="password"
                placeholder="password"
                className="inputValue"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Password does not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div style={{ marginBottom: "2%" }}>
              <Button
                style={{
                  marginLeft: "13%",
                  marginRight: "3%",
                  backgroundColor: "rgb(45,68,134)",
                  color: "white",
                }}
                htmlType="submit"
              >
                Submit
              </Button>
              <Link to="/login">
                <Button>Back to Login</Button>
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;
