import { Card, Modal, Button, Form, Input, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

export default function ShareModal({ open, onClose }) {
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
            Share by email
          </div>
        }
      >
        <Form
          //   onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item name="PeopleList">
            <Select size="large" placeholder="Type Email address" />
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
              Share
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
