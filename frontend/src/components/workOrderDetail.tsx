import React, { useEffect, useState } from "react";
import { Button, Form, Card, DatePicker, message, Upload, Input } from "antd";
import type { MenuProps, UploadProps } from "antd";
import { InboxOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
// import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import jwtDecode from "jwt-decode";
import { decodedToken } from "../view/dashboard/dashBoard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";
type SizeType = Parameters<typeof Form>[0]["size"];

const items = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const WorkOrderDetail: React.FC = () => {
  const [selectCategory, setSelectCategory] = useState("Select Category");
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    Email: "",
    Company: "",
    PhoneNumber: "",
    FirstName: "",
    LastName: "",
  });
  const [images, setImages] = useState([]);

  const getUserInfo = async (token: any) => {
    try {
      const response = await axios.get("/dashboard/userinformation", {
        params: { Token: token },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    getUserInfo(token);
  }, []);

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({
    ordersummary,
    DatePicker,
    Email,
    Contact,
    Company,
    Name,
    UploadImage,
  }) => {
    try {
      const decoded: decodedToken = jwtDecode(localStorage.getItem("jwt"));
      const ID: number = decoded.ID;
      const res = await axios.post("/dashboard/workorder/addworkorder", {
        ordersummary,
        DatePicker,
        ID,
        Email,
        Company,
        Name,
        Contact,
        UploadImage,
      });
      if (res.status === 200) {
        // Swal.fire(
        //   `Great Job!`,
        //   `You have successfully added new Work Order!`,
        //   "success"
        // );
        navigate("/workorder");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const upload: UploadProps = {
    name: "file",
    multiple: false,
    action: "",
    beforeUpload: (file, fileList) => {
      console.log("before", file, fileList);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("reader", reader.result);
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);

      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          flexWrap: "wrap",
        }}
      >
        <Card
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              <span>This is Work Order Detail</span>
              <span>
                <Button
                  onClick={() => {
                    let myWindow = window.open("", "", "width=600,height=800");
                    myWindow.document.write(
                      `<table>
                        <tbody>
                          <tr>
                            <th>Company</th>
                            <td>${userInfo.Company}</td>
                          </tr>
                          <tr>
                            <th>Orderer Name</th>
                            <td>${userInfo.FirstName} ${userInfo.LastName}</td>
                          </tr>
                        </tbody>
                      </table>`
                    );
                    myWindow.document.close();
                    myWindow.focus();
                    myWindow.print();
                    myWindow.close();
                  }}
                  style={{ backgroundColor: "rgb(45,68,134)", color: "white" }}
                >
                  Print Report in PDF
                </Button>
              </span>
            </div>
          }
          bordered={false}
          style={{ width: "100%", border: "solid rgb(226, 226, 226) 1.5px" }}
        >
          <Form
            layout="vertical"
            initialValues={{ size: componentSize }}
            fields={[
              {
                name: ["DatePicker"],
                value: dayjs(),
              },
              {
                name: ["Email"],
                value: userInfo.Email,
              },
              {
                name: ["Company"],
                value: userInfo.Company,
              },
              {
                name: ["Contact"],
                value: userInfo.PhoneNumber,
              },
              {
                name: ["Name"],
                value: userInfo.FirstName + " " + userInfo.LastName,
              },
            ]}
            onValuesChange={onFormLayoutChange}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Orderer Name"
              name="Name"
              rules={[
                { required: true, message: "Please input your Company Name!" },
              ]}
            ></Form.Item>
            <Form.Item
              label="Company"
              name="Company"
              rules={[
                { required: true, message: "Please input your Company Name!" },
              ]}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="Email"
              rules={[
                { required: true, message: "Please input your Company Name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contact"
              name="Contact"
              rules={[
                { required: true, message: "Please input your Company Name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Order Summary"
              name="ordersummary"
              style={{ textAlign: "left" }}
              rules={[
                { required: true, message: "Please input your order summary!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Upload Photo">
              <Form.Item
                name="UploadImage"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger {...upload}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="Start Date"
              name="DatePicker"
              style={{ textAlign: "left" }}
              rules={[
                { required: true, message: "Please pick the Starting Date!" },
              ]}
            >
              <DatePicker format={dateFormat} size="large" />
            </Form.Item>

            <Form.Item>
              <div style={{ width: "100%", justifyContent: "center" }}>
                <Button
                  style={{
                    width: "300px",
                    height: "50px",
                    color: "white",
                    backgroundColor: "rgb(45,68,134)",
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
          {images.map((img, idx) => {
            return <img src={img} key={"img" + idx} />;
          })}
        </Card>
      </div>
    </div>
  );
};

export default WorkOrderDetail;
