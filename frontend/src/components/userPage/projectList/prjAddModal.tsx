import { Card, Modal, Button, Form, Input, Select, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { decodedToken } from "../../../data/Interfaces/decodedToken";
import { t } from "i18next";

export default function AddModal({ open, onClose, onChange }) {
  const getJwt = localStorage.getItem("decoded_jwt");
  const DecodeToken: decodedToken = JSON.parse(getJwt);
  const LoggedUserEmail = DecodeToken.Email;
  const onFinish = async ({
    Name,
    TeamMembers,
    DateRange,
    Budget,
    TeamManagers,
    Guests,
  }) => {
    try {
      const res1 = await axios.post("/dashboard/projectList", {
        ProjectName: Name,
        TeamMembers: TeamMembers,
        Start: DateRange[0].toISOString(),
        End: DateRange[1].toISOString(),
        Budget: Budget,
        TeamManagers: TeamManagers,
        Guests: Guests,
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

  const { RangePicker } = DatePicker;
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
      footer={null}
    >
      <Card
        title={
          <div style={{ fontSize: "20px ", fontWeight: "bold" }}>
            {t("CreateOtherProject")}
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
                name: ["DateRange"],
                value: [dayjs(), null],
              },
              {
                name: ["Name"],
                value: "Example Project",
              },
              {
                name: ["TeamManagers"],
                value: [LoggedUserEmail],
              },
            ]}
          >
            <Form.Item
              name={"Name"}
              label={t("ProjectName")}
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
              name={"TeamManagers"}
              label={t("InvitePersonAsManager")}
              style={{ fontSize: "15px" }}
              rules={[
                {
                  required: true,
                  message: "Please invite mangers!",
                },
              ]}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Please type email"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              />
            </Form.Item>
            <Form.Item
              name={"TeamMembers"}
              label={t("InvitePersonAsMember")}
              style={{ fontSize: "15px" }}
              rules={[
                {
                  required: true,
                  message: "Please invite members!",
                },
              ]}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Please type email"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              />
            </Form.Item>
            <Form.Item
              name={"Guests"}
              label={t("InvitePersonAsGuest")}
              style={{ fontSize: "15px" }}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Please type email"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              />
            </Form.Item>
            <Form.Item
              name={"DateRange"}
              label={t("ProjectStartDate")}
              style={{ fontSize: "15px" }}
              rules={[
                {
                  required: true,
                  message: "Please pick the start date!",
                },
              ]}
            >
              <RangePicker size="large" />
            </Form.Item>
            <Form.Item
              name={"Budget"}
              label={t("Description")}
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
                {t("CreateProject")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Modal>
  );
}
