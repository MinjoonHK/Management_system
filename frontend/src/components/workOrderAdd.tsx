import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Card,
  DatePicker,
  message,
  Upload,
  Input,
  Space,
  Dropdown,
} from "antd";
import type { MenuProps, UploadFile, UploadProps } from "antd";
import { InboxOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import jwtDecode from "jwt-decode";
import { decodedToken } from "../view/dashboard/dashBoard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RcFile } from "antd/es/upload";
import { items } from "../data/tableColumns/workOrderCategory";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";
type SizeType = Parameters<typeof Form>[0]["size"];

const AddWorkOrder: React.FC = () => {
  const [selectedCategory, setSelectCategory] = useState("Select Category");
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    Email: "",
    Company: "",
    PhoneNumber: "",
    FirstName: "",
    LastName: "",
  });

  const [images, setImages] = useState([]);

  const menuProps = {
    items,
    onClick: ({ key }) => setSelectCategory(key),
  };

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
    Category,
    OrderTitle,
  }) => {
    try {
      const getJwt = localStorage.getItem("decoded_jwt");
      const decoded: decodedToken = JSON.parse(getJwt);
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
        Category,
        OrderTitle,
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
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const upload: UploadProps = {
    name: "file",
    multiple: true,
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
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
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
            <div style={{ fontWeight: "bold", fontSize: "25px" }}>
              Add New Work Order
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
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Company"
              name="Company"
              rules={[
                { required: true, message: "Please input your Company Name!" },
              ]}
            >
              <Input />
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
                {
                  required: true,
                  message: "Please input your Company Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "left" }}>
              <Form.Item
                label="Order Title"
                name="OrderTitle"
                rules={[{ required: true }]}
                style={{
                  display: "inline-block",
                  width: "70%",
                  textAlign: "left",
                }}
              >
                <Input placeholder="Please input order title" />
              </Form.Item>
              <Form.Item
                label="Category"
                name="Category"
                rules={[
                  { required: true, message: "Please Select the Cateogry!" },
                ]}
                style={{
                  display: "inline-block",
                  textAlign: "left",
                  marginLeft: "1%",
                  marginBottom: 0,
                }}
              >
                <Dropdown menu={menuProps}>
                  <Button>
                    <Space>
                      {selectedCategory}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
                {selectedCategory === "Other" && (
                  <Form.Item
                    name="OtherCategory"
                    style={{ display: "inline-block" }}
                  >
                    <Input placeholder="Please Specify" />
                  </Form.Item>
                )}
              </Form.Item>
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

export default AddWorkOrder;
