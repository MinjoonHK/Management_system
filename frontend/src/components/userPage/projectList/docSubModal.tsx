import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DocumentSubmissionModal = ({ open, onClose, onChange }) => {
  const [userOption, setUserOption] = useState([]);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string[]>([]);

  const filteredOptions = userOption.filter((e) => e.Role === "Member");
  const filteredOptions2 = userOption.filter((e) => e.Role === "Manager");
  const memberList = filteredOptions.map((e) => e.Joined_User_Email);
  const managerList = filteredOptions2.map((e) => e.Joined_User_Email);
  const fetchUserList = async () => {
    const response = await axios.get("/dashboard/joinedUserList", {
      params: { project_ID: selectedProject },
    });
    if (response.data) {
      try {
        let result = response.data.result[0].map((a) => a);
        setUserOption(result);
      } catch (error) {
        console.log("failed to get useroptions", error);
      }
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);
  const { selectedProject } = useParams();
  const onFinish = async ({
    taskName,
    manager,
    member,
    dueDate,
    description,
  }) => {
    try {
      const response = await axios.post("/dashboard/addsubmissiontask", {
        Name: taskName,
        Manager: manager.label,
        Member: member,
        DueDate: dueDate.toISOString(),
        Description: description,
        project_ID: selectedProject,
      });
      console.log(response.data);
      if (response.data) {
        Swal.fire({
          title: "Successful",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });
        onChange();
        onClose();
        console.log("success");
      }
    } catch (error) {
      console.log("Add project task error", error);
    }
  };
  console.log();
  return (
    <div>
      <Modal
        centered
        open={open}
        okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
        closable={false}
        onCancel={onClose}
        width={500}
        onOk={onClose}
        bodyStyle={{ height: "100%" }}
        footer={null}
      >
        <div>
          <Card
            title={<h2 style={{ textAlign: "left" }}>Add Submission Task</h2>}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Task Name"
                name="taskName"
                rules={[
                  {
                    required: true,
                    message: "Please name the task!",
                  },
                ]}
              >
                <Input size="large" placeholder="Input the task name" />
              </Form.Item>

              <Form.Item
                name={"manager"}
                label="Person in Charge"
                rules={[
                  {
                    required: true,
                    message: "Please select person in charge!",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Please select user"
                  value={selectedManager}
                  labelInValue
                  onChange={setSelectedManager}
                  options={managerList.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item name={"member"} label="Required Member List">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Please type email"
                  value={selectedMember}
                  onChange={setSelectedMember}
                  options={memberList.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                />
              </Form.Item>
              <Form.Item
                style={{ textAlign: "left" }}
                label="Due Date"
                name="dueDate"
              >
                <DatePicker size="large" />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <TextArea />
              </Form.Item>
              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  htmlType="submit"
                  size="large"
                  style={{
                    backgroundColor: "rgb(45,68,134)",
                    color: "white",
                    textAlign: "center",
                    width: "50%",
                    fontSize: "18px",
                  }}
                >
                  Create Task
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Modal>
    </div>
  );
};
