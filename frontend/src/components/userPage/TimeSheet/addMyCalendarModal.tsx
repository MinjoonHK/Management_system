import {
  Card,
  Modal,
  Button,
  Select,
  Form,
  Input,
  ColorPicker,
  Row,
  Col,
} from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { ColorList } from "../../../data/colorList";

export default function AddMyCalendar({ open, onClose, onChange }) {
  const onFinish = async ({ Name, Color }) => {
    try {
      let color = "#CCCCCC";
      if (typeof Color === typeof "") {
        color = Color;
      } else {
        color = Color.toHexString();
      }
      const res = await axios.post("/dashboard/calendarlist", {
        Name,
        Color: color,
      });
      if (res.status === 200) {
        onChange();
        onClose();
      }
    } catch (err) {
      if (err.response.data === "Maximum Number reached!") {
        Swal.fire(
          "Maximum Number Reached!",
          "Please remove other calendars to continue",
          "warning"
        );
      }
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
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Card
        title={
          <div style={{ fontSize: "20px ", fontWeight: "bold" }}>
            Add Other Calendar
          </div>
        }
      >
        <div>
          <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Row gutter={16}>
              <Col span={22}>
                <Form.Item name="Name">
                  <Input placeholder="Type the Calendar Name" size={"large"} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="Color" style={{ marginTop: "10%" }}>
                  <ColorPicker format="hex" presets={[ColorList]}></ColorPicker>
                </Form.Item>
              </Col>
            </Row>
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
                Add Calendar
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
