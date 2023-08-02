import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DocumentSubmissionModal = ({ open, onClose, onChange }) => {
  const [userOption, setUserOption] = useState([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = userOption.filter((o) => !selectedItems.includes(o));
  const fetchData = async () => {
    const response = await axios.get("/dashboard/joinedUserList", {
      params: { project_ID: selectedProject },
    });

    if (response.data) {
      try {
        let result = response.data.result[0].map((a) => a.Joined_User_Email);
        setUserOption(result);
      } catch (error) {
        console.log("failed to get useroptions", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const { selectedProject } = useParams();
  const onFinish = async ({ taskName, manager, dueDate, description }) => {
    try {
      const response = await axios.post("/dashboard/addsubmissiontask", {
        Name: taskName,
        Manager: manager,
        DueDate: dueDate.toISOString(),
        Description: description,
        project_ID: selectedProject,
      });
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
              <Form.Item label="Task Name" name="taskName">
                <Input size="large" placeholder="Input the task name" />
              </Form.Item>
              <Form.Item label="Person in Charge" name="manager">
                <Input
                  size="large"
                  placeholder="Type name of the person in charge"
                />
              </Form.Item>
              <Form.Item label="Required Member List">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Please type email"
                  value={selectedItems}
                  onChange={setSelectedItems}
                  options={filteredOptions.map((item) => ({
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
