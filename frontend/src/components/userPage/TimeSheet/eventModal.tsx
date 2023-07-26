import { Card, Timeline, Modal, Button } from "antd";

export default function EventModal({ open, onClose, evtTitle }) {
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
        <Button type="primary" danger key="Delete" style={{ color: "white" }}>
          Delete
        </Button>,
      ]}
    >
      <Card
        title={
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {evtTitle.start &&
              new Date(evtTitle.start).toISOString().slice(0, 10)}
            ~{evtTitle.end && new Date(evtTitle.end).toISOString().slice(0, 10)}
          </div>
        }
      >
        <div style={{ fontSize: "15px" }}>{evtTitle.title}</div>
      </Card>
    </Modal>
  );
}
