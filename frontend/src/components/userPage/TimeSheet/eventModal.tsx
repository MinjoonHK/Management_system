import { Card, Timeline, Modal } from "antd";

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
    >
      <Card
        title={
          <div>
            {evtTitle.start &&
              new Date(evtTitle.start).toISOString().slice(0, 10)}
            ~{evtTitle.End && new Date(evtTitle.end).toISOString().slice(0, 10)}
          </div>
        }
      >
        {evtTitle.Title}
      </Card>
    </Modal>
  );
}
