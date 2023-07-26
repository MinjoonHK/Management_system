import { Card, Modal, Button, Select, Form } from "antd";

export default function AddProjectCalendar({ open, onClose }) {
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
        <Button key="Cancel" onClick={onClose}>
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
          <Form>
            <Form.Item name="Email">
              <Select
                placeholder="Type Calendar Name"
                showSearch
                size={"large"}
                style={{ width: "100%" }}
              ></Select>
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
          <span></span>
        </div>
        <div></div>
      </Card>
    </Modal>
  );
}
