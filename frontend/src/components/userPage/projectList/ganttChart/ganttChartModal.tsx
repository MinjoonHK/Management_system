import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;

const AddScheduleModal = ({ open, onClose, projectList, fetchSchdule }) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [selectedType, setSelectedType] = useState("");

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({ name, RangePicker, Type, Dependencies }) => {
    try {
      if (!Dependencies) {
        Dependencies = null;
      }
      const startDate = dayjs(RangePicker[0]).format("YYYY-MM-DD");
      const endDate = dayjs(RangePicker[1]).format("YYYY-MM-DD");
      const res = await axios.post("/dashboard/ganttchart/addschedule", {
        name,
        startDate,
        endDate,
        Type,
        Dependencies,
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

  const onOkHandler = () => {
    window.location.reload();
    onClose();
  };

  const types = [
    { Task: "task" },
    { MileStone: "milestone" },
    { Project: "project" },
  ];
  const handleTypeChanger = async (value: string) => {
    await setSelectedType(value);
  };

  return (
    <Modal
      centered
      open={open}
      onOk={onOkHandler}
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
                Add New Schedule
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
                initialValue={"Task"}
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
                  options={types.map((type) => {
                    const key = Object.keys(type)[0];
                    const value = type[key];
                    return {
                      label: key,
                      value: value,
                    };
                  })}
                />
              </Form.Item>
              {selectedType === "project" || (
                <Form.Item label="Select parent project" name="Dependencies">
                  <Select
                    size="large"
                    onChange={handleTypeChanger}
                    placeholder="Please select the parent project"
                    options={projectList.map((projectList) => ({
                      label: projectList.Name,
                      value: projectList.ID,
                    }))}
                  />
                </Form.Item>
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
