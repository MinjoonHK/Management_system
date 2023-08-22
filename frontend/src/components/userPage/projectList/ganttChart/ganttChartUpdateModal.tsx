import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UpdateModal = ({
  open,
  onClose,
  projectList,
  fetchSchdule,
  selectedProject,
  selectedGantt,
}) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  console.log(selectedGantt);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [selectedMileStone, setSelectedMileStone] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
  const [existingGanttData, setExistingGanttData] = useState(null);
  const [existingData, setExistingData] = useState([]);
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

  const fetchExistingGanttData = async () => {
    const response = await axios.get("/dashboard/getExistingGanttData", {
      params: { ganttTaskID: selectedGantt.ID },
    });
    if (response.data.status === true) {
      setExistingData(response.data.result);
    } else {
      console.log("failed to get existing data");
    }
  };

  const fetchGanttData = async () => {
    const response = await axios.get("/dashboard/getGanttData", {
      params: { ganttTaskID: selectedGantt.ID },
    });
    console.log(response.data.result);
    if (response.data.status === true) {
      setExistingGanttData(response.data.result);
    } else {
      console.log("failed to get existing data");
    }
  };

  useEffect(() => {
    fetchExistingGanttData();
    fetchGanttData();
  }, [selectedGantt]);
  useEffect(() => {
    if (open === true) {
      fetchExistingGanttData();
      fetchGanttData();
    }
  }, [open]);

  useEffect(() => {
    const Members = existingData.filter((people) => {
      return people.Role === "Member";
    });
    form.setFieldValue(
      "Member",
      Members.map((items, index) => {
        let option = {
          label: `${items.FirstName} ${items.LastName}`,
          key: items.ID,
        };
        return option;
      })
    );
    const Managers = existingData.filter((people) => {
      return people.Role === "Manager";
    });

    form.setFieldValue(
      "Manager",
      Managers.map((items, index) => {
        let option = {
          label: `${items.FirstName} ${items.LastName}`,
          key: items.ID,
        };
        return option;
      })
    );
    console.log(existingGanttData);
    if (existingGanttData) {
      form.setFieldValue("Description", existingGanttData[0].Description);
    }
  }, [existingData, existingGanttData]);

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
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
                {selectedGantt && <div>{selectedGantt.Name}</div>}
              </div>
            }
            bordered={false}
            style={{ width: "100%", border: "solid rgb(226, 226, 226) 1.5px" }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                size: componentSize,
                Group: "Milestone1",
              }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              fields={[
                {
                  name: ["name"],
                  value: selectedGantt.Name,
                },
                {
                  name: ["Description"],
                  value: existingGanttData.Description,
                },
              ]}
            >
              <Form.Item
                label="Name"
                name="name"
                style={{ display: "inline-block", width: "50%" }}
              >
                <Input placeholder="Name of the Schedule" size="large" />
              </Form.Item>

              <div>
                <Form.Item label="Select Milestone" name="Group">
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

                <Form.Item name="Manager" label="Joined Manager list">
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
                <Form.Item name="Member" label="Joined Member List">
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
                <Form.Item name="Description" label="Description">
                  <TextArea size="large" />
                </Form.Item>
              </div>
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
                    Update
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

export default UpdateModal;
