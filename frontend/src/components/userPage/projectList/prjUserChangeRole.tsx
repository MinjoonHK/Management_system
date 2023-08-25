import { Card, Modal, Button, Input, Form, Select } from "antd";
import axios from "axios";
import { t } from "i18next";
import Swal from "sweetalert2";

const { Option } = Select;

export default function AddGuestModal({
  open,
  onClose,
  selectedProject,
  selectedMember,
  onChange,
}) {
  selectedProject = Number(selectedProject);
  const selectedUser = selectedMember.Joined_User_Email;
  const onFinish = async ({ Role }) => {
    const response = await axios.post("/dashboard/changeUserRole", {
      selectedUser,
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
          {t("Change")}
        </Button>,
      ]}
    >
      {selectedMember && (
        <Card
          title={
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {`${selectedMember.FirstName} ${selectedMember.LastName}'s Role`}
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
              style={{ width: "100%" }}
              name="Role"
              rules={[{ required: true, message: "Please Select the Role!" }]}
            >
              <Select size="large" placeholder="Please Change the user Role">
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
      )}
    </Modal>
  );
}
