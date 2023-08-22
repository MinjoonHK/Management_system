import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const AddScheduleModal = ({
  open,
  onClose,
  projectList,
  fetchSchdule,
  selectedProject,
}) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [dates, setDates] = useState<RangeValue>(null);
  const [selectedType, setSelectedType] = useState("project");
  const [dateValue, setDateValue] = useState<RangeValue>(null);
  const [selectedMileStone, setSelectedMileStone] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
  const [managerList, setManagerList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [form] = Form.useForm();
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({
    name,
    RangePicker,
    Type,
    Dependencies,
    DurationDay,
    Group,
    Manager,
    Member,
    Description,
  }) => {
    try {
      if (!Dependencies) {
        Dependencies = null;
      }
      if (!Group) {
        Group = null;
      }
      const projectID = Number(selectedProject);
      const DayofDuration = Number(DurationDay);
      const startDate = dayjs(RangePicker[0]).format("YYYY-MM-DD");
      const endDate = dayjs(RangePicker[1]).format("YYYY-MM-DD");
      const res = await axios.post("/dashboard/ganttchart/addschedule", {
        name,
        startDate,
        endDate,
        Type,
        Dependencies,
        DayofDuration,
        Group,
        projectID,
        Manager,
        Member,
        Description,
      });
      if (res.data.status === true) {
        Swal.fire("Successfully added new schedule!", "", "success");
        form.resetFields();
        fetchSchdule();
        onClose();
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
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

  useEffect(() => {
    fetchProjectPeople();
  }, []);

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const types = [{ Task: "task" }, { MileStone: "project" }];
  const handleTypeChanger = async (value: string) => {
    setSelectedType(value);
  };

  const handleMileStoneChanger = async (value: number) => {
    setSelectedMileStone(value);
    console.log(selectedMileStone);
  };

  const handleTaskChanger = async (value: number) => {
    setSelectedTask(value);
  };

  const selectedMileStoneStart = projectList.filter((p) => {
    return p.ID === selectedMileStone;
  });
  const selectedMileStoneEnd = projectList.filter((p) => {
    return p.ID === selectedMileStone;
  });
  const format = "DD.MM.YYYY HH:mm";
  const disabledDates = [
    {
      start: selectedMileStoneStart.Start,
      end: selectedMileStoneEnd,
    },
    {
      start: selectedMileStoneStart.Start,
      end: selectedMileStoneEnd,
    },
  ];

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <Modal
      centered
      destroyOnClose={true}
      open={open}
      closable={false}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
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
                {projectList.length > 0
                  ? "Add New Schedule"
                  : "Please Make your first MileStone"}
              </div>
            }
            bordered={false}
            style={{ width: "100%", border: "solid rgb(226, 226, 226) 1.5px" }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ size: componentSize }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                style={{ display: "inline-block", width: "50%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Company Name!",
                  },
                ]}
              >
                <Input placeholder="Name of the Schedule" size="large" />
              </Form.Item>
              <Form.Item
                label="Task Type"
                name="Type"
                style={{
                  display: "inline-block",
                  width: "49%",
                  marginLeft: "8px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Please select the type!",
                  },
                ]}
              >
                <Select
                  size="large"
                  onChange={handleTypeChanger}
                  placeholder="Please select the type"
                  options={
                    projectList.length > 0
                      ? types.map((type) => {
                          const key = Object.keys(type)[0];
                          const value = type[key];
                          return {
                            label: key,
                            value: value,
                          };
                        })
                      : [
                          {
                            label: "MileStone",
                            value: "project",
                          },
                        ]
                  }
                />
              </Form.Item>

              {selectedType === "project" || (
                <div>
                  <Form.Item
                    label="Select Milestone"
                    name="Group"
                    rules={[
                      {
                        required: true,
                        message: "Please select the MileStone!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={handleMileStoneChanger}
                      placeholder="Please Select the Milestone"
                      options={projectList.map((projectList) => ({
                        label: projectList.Name,
                        value: projectList.ID,
                      }))}
                    />
                  </Form.Item>

                  {projectList &&
                    projectList.length &&
                    projectList[0].tasks.length > 0 && (
                      <Form.Item
                        label="This task should be done after"
                        name="Dependencies"
                        rules={[
                          {
                            required: true,
                            message: "Please select the prior task!",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          onChange={handleTaskChanger}
                          placeholder="Please select the prior task"
                          options={projectList
                            .filter((d) => d.ID == selectedMileStone)
                            .map((d) => d.tasks)
                            .flat()
                            .map((projectList) => ({
                              label: projectList.Name,
                              value: projectList.ID,
                            }))}
                        />
                      </Form.Item>
                    )}

                  <Form.Item
                    name={"Manager"}
                    label="Joined Manager list"
                    rules={[
                      {
                        required: true,
                        message: "Please Select the Managers!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Please select managers"
                      value={selectedMember}
                      onChange={setSelectedMember}
                      options={managerList.map((item) => ({
                        value: item.Joined_User_Email,
                        label: item.FirstName + " " + item.LastName,
                      }))}
                      style={{ width: "100%" }}
                      tokenSeparators={[","]}
                    />
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
                    name="Description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Please describe your task!",
                      },
                    ]}
                  >
                    <TextArea size="large" />
                  </Form.Item>
                </div>
              )}

              <Form.Item
                label="Select Date"
                name="RangePicker"
                rules={[
                  { required: true, message: "Please selecte the Date!" },
                ]}
              >
                <RangePicker
                  value={dates || dateValue}
                  disabledDate={(current) => {
                    return disabledDates.some(
                      (dd) =>
                        dayjs(current).isBefore(dayjs(dd["end"], format)) &&
                        dayjs(current).isAfter(dayjs(dd["start"], format))
                    );
                  }}
                  onOpenChange={onOpenChange}
                  onCalendarChange={(val) => {
                    setDates(val);
                  }}
                  onChange={(val) => {
                    setDateValue(val);
                  }}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Button
                    style={{
                      width: "300px",
                      height: "50px",
                      color: "white",
                      backgroundColor: "rgb(45,68,134)",
                      marginTop: "3%",
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
        </div>
      </div>
    </Modal>
  );
};

export default AddScheduleModal;
