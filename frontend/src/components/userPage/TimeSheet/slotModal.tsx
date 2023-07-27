import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Tabs,
  DatePicker,
  Select,
  TimePicker,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { RangePicker } = DatePicker;
const SlotModal = ({ open, onClose, calendarList, start, onChange }) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [size, setSize] = useState<SizeType>("small");

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({
    Title,
    RangePicker,
    SelectCalendar,
    SelectTime,
    Description,
  }) => {
    try {
      const CalendarID = SelectCalendar;
      const Start: String = new Date(RangePicker[0]).toLocaleDateString(
        "en-US",
        {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );
      const End: String =
        new Date(RangePicker[1]).toISOString() +
        SelectTime[0].toISOString().slice(11, 16);
      console.log(Start);
      const res = await axios.post("/dashboard/timesheet", {
        CalendarID,
        Title,
        Start,
        End,
      });
      if (res.status === 200) {
        onChange();
        onClose();
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
                    {
                      name: ["SelectTime"],
                      value: [dayjs("12:00", "HH:mm"), null],
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
                  <Form.Item
                    name="SelectCalendar"
                    label="Select Calendar"
                    rules={[
                      {
                        required: true,
                        message: "Please pick the calendar!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Calendar"
                      size={"large"}
                      options={calendarList}
                    />
                  </Form.Item>
                  <Form.Item
                    name="RangePicker"
                    label="Select Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the range!",
                      },
                    ]}
                  >
                    <RangePicker size="large" />
                  </Form.Item>
                  <Form.Item name="SelectTime" label="Select Time">
                    <TimePicker.RangePicker
                      minuteStep={15}
                      format={"HH:mm"}
                      size={"large"}
                    />
                  </Form.Item>
                  <Form.Item name="Description" label="Description">
                    <TextArea size="large" />
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
