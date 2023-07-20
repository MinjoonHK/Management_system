import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Tabs,
  DatePicker,
  TimePicker,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import TimeLine from "./timeSheetTimeLine";
import { decodedToken } from "../../../data/Interfaces/decodedToken";
const { RangePicker } = DatePicker;
const AddTimeSheet = ({ open, onClose }) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [size, setSize] = useState<SizeType>("small");

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({ Title, RangePicker }) => {
    try {
      const decoded: decodedToken = jwtDecode(localStorage.getItem("jwt"));
      const UserID = decoded.ID;
      const Start = RangePicker[0];
      const End = RangePicker[1];
      const res = await axios.post("/dashboard/timesheet", {
        UserID,
        Title,
        Start,
        End,
      });
      if (res.status === 200) {
        Swal.fire(
          `Great Job!`,
          `You have successfully added new Work Order!`,
          "success"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const onOkHandler = () => {
    window.location.reload();
    onClose();
  };

  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      onOk={onOkHandler}
      closable={false}
      onCancel={onClose}
      width={500}
      bodyStyle={{ height: "100%" }}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={size}
        items={[
          {
            label: <div style={{ color: "black" }}>Current Schedule</div>,
            key: "1",
            children: <div>1</div>,
          },
          {
            label: <div style={{ color: "black" }}>Add Schedule</div>,
            key: "2",
            children: (
              <Card
                title={
                  <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    Add New Schedule
                  </div>
                }
                bordered={false}
                style={{
                  width: "100%",
                  border: "solid rgb(226, 226, 226) 1.5px",
                }}
              >
                <Form
                  layout="vertical"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={componentSize as SizeType}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  fields={[
                    {
                      name: ["RangePicker"],
                      // value: [selectedValue, null],
                    },
                  ]}
                >
                  <Form.Item
                    label="Name"
                    name="Title"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Schdule Name!",
                      },
                    ]}
                  >
                    <Input placeholder="Name of the Schedule" size="large" />
                  </Form.Item>
                  <Form.Item name="RangePicker" label="Select Date">
                    <RangePicker size="large" />
                  </Form.Item>
                  <Form.Item>
                    <div style={{ width: "100%", textAlign: "center" }}>
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
                        Add Schedule
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
        ]}
      />
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
            flexWrap: "wrap",
          }}
        ></div>
      </div>
    </Modal>
  );
};

export default AddTimeSheet;
