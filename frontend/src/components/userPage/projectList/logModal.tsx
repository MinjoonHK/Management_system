import { Card, Modal } from "antd";

export default function LogModal({ open, onClose, selectedProject }) {
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
            Team members
          </div>
        }
      >
        {selectedProject && (
          <div>
            {selectedProject.joinedUsers.map((e: any, index: number) => {
              return <div key={`Users` + index}>{e}</div>;
            })}
          </div>
        )}
      </Card>
    </Modal>
  );
}
