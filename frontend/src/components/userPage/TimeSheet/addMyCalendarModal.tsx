import { Card, Modal, Button, Select, Form, Input } from "antd";

export default function AddMyCalendar({ open, onClose }) {
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
      footer={[<Button key="cancel">Cancel</Button>]}
    >
      <Card
        title={
          <div style={{ fontSize: "20px ", fontWeight: "bold" }}>
            Add Other Calendar
          </div>
        }
      >
        <div>
          <Form>
            <Form.Item name="Email">
              <Input placeholder="Type the Calendar Name" size={"large"} />
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
