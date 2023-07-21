import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Tabs,
  DatePicker,
  Timeline,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { decodedToken } from "../../../data/Interfaces/decodedToken";
const { RangePicker } = DatePicker;
const SlotModal = ({ open, onClose, events, start }) => {
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
      const Start: String = RangePicker[0].toISOString();
      const End: String = RangePicker[1].toISOString();
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
        defaultActiveKey="AddSchedule"
        type="card"
        size={size}
        items={[
          {
            label: <div style={{ color: "black" }}>Current Schedule</div>,
            key: "CurrentSchedule",
            children: (
              // <Timeline mode={"left"}>
              //   {events.map((e) => (
              //     <Timeline.Item>
              //       <span style={{ margin: "5%" }}>
              //         {new Date(e.Start).toLocaleDateString()}
              //       </span>
              //       <span>{e.Title}</span>
              //     </Timeline.Item>
              //   ))}
              // </Timeline>
              <div>Hello</div>
            ),
          },
          {
            label: <div style={{ color: "black" }}>Add Schedule</div>,
            key: "AddSchedule",
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
                      value: [dayjs(start), null],
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

export default SlotModal;
