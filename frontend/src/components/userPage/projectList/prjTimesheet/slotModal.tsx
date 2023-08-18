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

export const TeamSlotModal = ({ open, onClose, selectedProject, onChange }) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [size, setSize] = useState<SizeType>("small");
  const [managerList, setManagerList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjectPeople();
  }, []);
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({
    Name,
    RangePicker,
    SelectTime,
    Description,
    Member,
  }) => {
    try {
      const ProjectID = Number(selectedProject);
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

      const res = await axios.post("/dashboard/addProjectCalendarSchedule", {
        Name,
        Start,
        End,
        ProjectID,
        Description,
        Member,
      });
      if (res.data.status === true) {
        form.resetFields();
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

  const fetchProjectPeople = async () => {
    if (selectedProject) {
      const response = await axios.get("dashboard/getProjectPeople", {
        params: { ProjectID: selectedProject },
      });
      if (response.data.status === true) {
        setMemberList(response.data.result);
        const managerFilter = response.data.result.filter((users) => {
          return users.Role === "Manager";
        });
        if (managerFilter) {
          setManagerList(managerFilter);
        }
      }
    }
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
                  form={form}
                  layout="vertical"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={componentSize as SizeType}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  fields={[
                    {
                      name: ["SelectTime"],
                      value: [dayjs("12:00", "HH:mm"), null],
                    },
                  ]}
                >
                  <Form.Item
                    label="Name"
                    name="Name"
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
                  <Form.Item
                    name={"Member"}
                    label="Joined Member List"
                    rules={[
                      {
                        required: true,
                        message: "Please Select the members!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Please select members"
                      value={selectedMember}
                      onChange={setSelectedMember}
                      options={memberList.map((item) => ({
                        value: item.Joined_User_Email,
                        label: item.FirstName + " " + item.LastName,
                      }))}
                      style={{ width: "100%" }}
                      tokenSeparators={[","]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="SelectTime"
                    label="Select Time"
                    rules={[
                      {
                        required: true,
                        message: "Please Select the time!",
                      },
                    ]}
                  >
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
