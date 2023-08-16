import { Card, Modal, Button, Input, Form, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const { Option } = Select;

export default function AddGuestModal({
  open,
  onClose,
  selectedProject,
  memberList,
  onChange,
}) {
  const [selectedMember, setSelectedMember] = useState("");
  selectedProject = Number(selectedProject);
  const onFinish = async ({ User, Role }) => {
    const response = await axios.post("/dashboard/changeUserRole", {
      User: User.value,
      Role: Role,
      selectedProject: selectedProject,
    });
    if (response.data.status === false) {
    } else if (response.data.status === true) {
      Swal.fire({
        icon: "success",
        title: "User Role has been Updated Successfully!",
        timer: 2000,
      });
      onChange();
      onClose();
    }
  };
  const [f] = Form.useForm();
  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={false}
      onCancel={onClose}
      width={500}
      bodyStyle={{ height: "100%" }}
      footer={[
        <Button type="default" key="Cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          type="primary"
          htmlType="submit"
          key="submit"
          style={{ backgroundColor: "rgb(45,68,134)" }}
          onClick={() => {
            f.submit();
          }}
        >
          Change
        </Button>,
      ]}
    >
      <Card
        title={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Change User Role
          </div>
        }
      >
        <Form
          form={f}
          onFinish={(props) => {
            onFinish(props);
          }}
          layout="inline"
        >
          <Form.Item
            style={{ width: "60%" }}
            name="User"
            rules={[{ required: true, message: "Please select the user!" }]}
          >
            <Select
              size="large"
              placeholder="Please select user"
              value={selectedMember}
              labelInValue
              onChange={setSelectedMember}
              options={memberList.map((item) => ({
                value: item.Joined_User_Email,
                label: item.FirstName + " " + item.LastName,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="Role"
            style={{ width: "30%" }}
            rules={[{ required: true, message: "Please Select the Role!" }]}
          >
            <Select size="large" placeholder="Role">
              <Option key="manager" value="Manager">
                Manager
              </Option>
              <Option key="member" value="Member">
                Member
              </Option>
              <Option key="guest" value="Guest">
                Guest
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
