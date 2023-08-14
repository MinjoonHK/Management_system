import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;

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

  const [modalProjectList, setModalProjectList] = useState([]);
  const [selectedType, setSelectedType] = useState("project");
  const [selectedMileStone, setSelectedMileStone] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
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
      });
      if (res.data.status === true) {
        Swal.fire("Successfully added new schedule!", "", "success");
        fetchSchdule();
        onClose();
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const types = [{ Task: "task" }, { MileStone: "project" }];
  const handleTypeChanger = async (value: string) => {
    await setSelectedType(value);
  };

  const handleMileStoneChanger = async (value: number) => {
    await setSelectedMileStone(value);
  };

  const handleTaskChanger = async (value: number) => {
    await setSelectedTask(value);
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

                  <Form.Item
                    label="Input Duration "
                    name="DurationDay"
                    rules={[
                      { required: true, message: "Please selecte the Date!" },
                    ]}
                  >
                    <Input size="large" />
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
