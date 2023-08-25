import { Card, Modal, Button, Input, Form, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { t } from "i18next";

const { Option } = Select;

export default function AddUserModal({
  open,
  onChange,
  onClose,
  selectedProject,
}) {
  const token = localStorage.getItem("jwt");
  selectedProject = Number(selectedProject);
  const onFinish = async ({ InviteEmail, Role }) => {
    const response = await axios.post("/sendEmail", {
      InviteEmail: InviteEmail,
      Role: Role,
      selectedProject: selectedProject,
      token: token,
    });
    if (response.data.status === false) {
      Swal.fire({
        icon: "warning",
        title: "User is already in the project!",
        timer: 2000,
      });
    } else if (response.data.status === true) {
      Swal.fire({
        icon: "success",
        title: `Successfully sent invitation to ${InviteEmail}`,
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
          {t("Cancel")}
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
          {t("Invite")}
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
            {t("AddMemberByEmail")}
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
            name="InviteEmail"
            rules={[
              { required: true, message: "Please input the Email!" },
              { type: "email", message: "This is not a valid Eamil address!!" },
            ]}
          >
            <Input placeholder="Please input email address" size="large" />
          </Form.Item>

          <Form.Item
            name="Role"
            style={{ width: "30%" }}
            rules={[{ required: true, message: "Please Select the Role!" }]}
          >
            <Select size="large" placeholder="Role">
              <Option key="manager" value="Manager">
                {t("Manager")}
              </Option>
              <Option key="member" value="Member">
                {t("Member")}
              </Option>
              <Option key="guest" value="Guest">
                {t("Guest")}
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
