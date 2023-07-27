import { Card, Modal, Button, Form, Input, Select, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";

export default function AddModal({ open, onClose, onChange }) {
  const onFinish = async ({ Name, TeamMembers, StartDate }) => {
    try {
      const res1 = await axios.post("/dashboard/projectList", {
        ProjectName: Name,
        TeamMembers: TeamMembers,
        Start: StartDate.toISOString(),
      });
      if (res1.status === 200) {
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
      closable={false}
      onCancel={onClose}
      width={500}
      onOk={onClose}
      bodyStyle={{ height: "100%" }}
      footer={[
        <Button type="default" key="Cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Card
        title={
          <div style={{ fontSize: "20px ", fontWeight: "bold" }}>
            Create Other Project
          </div>
        }
      >
        <div>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            fields={[
              {
                name: ["StartDate"],
                value: dayjs(),
              },
              {
                name: ["Name"],
                value: "Example Project",
              },
            ]}
          >
            <Form.Item
              name={"Name"}
              label={"Project Name"}
              style={{ fontSize: "15px" }}
              rules={[
                {
                  required: true,
                  message: "Please name your project!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name={"TeamMembers"}
              label={"Invite other members"}
              style={{ fontSize: "15px" }}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Please type email"
                style={{ width: "100%" }}
                // onChange={handleChange}
                tokenSeparators={[","]}
                // options={options}
              />
            </Form.Item>
            <Form.Item
              name={"StartDate"}
              label={"Project Start Date"}
              style={{ fontSize: "15px" }}
              rules={[
                {
                  required: true,
                  message: "Please pick the start date!",
                },
              ]}
            >
              <DatePicker size="large" />
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
                }}
              >
                Create Project
              </Button>
            </Form.Item>
          </Form>
          <span></span>
        </div>
        <div></div>
      </Card>
    </Modal>
  );
}
