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
          Close
        </Button>,
      ]}
    >
      <Card
        title={
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{evtTitle.title && evtTitle.title}</span>
          </div>
        }
      >
        <div style={{ fontSize: "15px" }}>
          {evtTitle.start &&
            new Date(evtTitle.start).toISOString().slice(0, 10)}
          ~{evtTitle.end && new Date(evtTitle.end).toISOString().slice(0, 10)}
        </div>
        <div>{evtTitle.description}</div>
      </Card>
    </Modal>
  );
}
