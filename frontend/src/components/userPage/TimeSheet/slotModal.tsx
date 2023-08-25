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
import { t } from "i18next";

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
      let Start = RangePicker[0].toDate();
      let End = RangePicker[1].toDate();

      Start.setHours(SelectTime[0].hour());
      Start.setMinutes(SelectTime[0].minute());
      Start.setSeconds(SelectTime[0].second());
      End.setHours(SelectTime[1].hour());
      End.setMinutes(SelectTime[1].minute());
      End.setSeconds(SelectTime[1].second());
      Start = Start.toISOString().replace("T", " ").replace("Z", "");
      End = End.toISOString().replace("T", " ").replace("Z", "");

      const res = await axios.post("/dashboard/timesheet", {
        CalendarID,
        Title,
        Start,
        End,
        Description,
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

  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={true}
      onCancel={onClose}
      width={500}
      bodyStyle={{ height: "100%" }}
      footer={null}
    >
      <Tabs
        defaultActiveKey="AddSchedule"
        type="card"
        size={size}
        items={[
          {
            label: <div style={{ color: "black" }}>{t("AddSchedule")}</div>,
            key: "AddSchedule",
            children: (
              <Card
                title={
                  <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    {t("AddNewSchedule")}
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
                    label={t("Name")}
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
                    label={t("SelectCalendar")}
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
                    label={t("SelectDate")}
                    rules={[
                      {
                        required: true,
                        message: "Please select the range!",
                      },
                    ]}
                  >
                    <RangePicker size="large" />
                  </Form.Item>
                  <Form.Item name="SelectTime" label={t("SelectTime")}>
                    <TimePicker.RangePicker
                      minuteStep={15}
                      format={"HH:mm"}
                      size={"large"}
                    />
                  </Form.Item>
                  <Form.Item name="Description" label={t("Description")}>
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
                        {t("AddSchedule")}
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
