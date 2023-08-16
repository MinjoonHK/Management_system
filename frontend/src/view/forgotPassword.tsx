import { Button, Checkbox, Form, Input, Card } from "antd";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const onFinish = async ({ email, password }) => {
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("jwt", res.data.accessToken);
      navigate("/");
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
          style={{
            width: "500px",
            textAlign: "center",
            border: "2px solid gray",
          }}
        >
          <Form
            name="Login"
            layout="vertical"
            style={{ maxWidth: 600, margin: "15px" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={<div style={{ fontSize: "16px" }}>Email</div>}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input correct email!",
                },
              ]}
            >
              <Input
                size="large"
                type="email"
                placeholder="email"
                className="inputValue"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "rgb(45,68,134)",
                  color: "white",
                }}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/login">
                <Button
                  style={{
                    width: "100%",
                  }}
                >
                  Back to login page
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
