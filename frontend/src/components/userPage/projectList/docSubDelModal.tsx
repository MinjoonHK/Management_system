import { Card, Modal, Button } from "antd";
import axios from "axios";

export default function DocSubDelModal({
  open,
  onClose,
  selectedTask,
  onChange,
}) {
  const handleDelete = async () => {
    const res = await axios.post("/dashboard/deleteTaskList", {
      TaskID: selectedTask.ID,
    });
    if (res) {
      try {
        onChange();
        onClose();
      } catch (error) {
        console.log("Failed to delete", error);
      }
    }
  };
  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={false}
      onCancel={onClose}
      width={500}
      keyboard={true}
      bodyStyle={{ height: "100%" }}
      footer={[
        <Button type="default" key="Cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          type="primary"
          danger
          key="Delete"
          onClick={handleDelete}
          style={{ color: "white" }}
        >
          Delete
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
            Confirmation
          </div>
        }
      >
        <div style={{ fontSize: "15px" }}>
          {selectedTask && (
            <div>{`Are you sure about deleting ${selectedTask.Name}?`}</div>
          )}
        </div>
      </Card>
    </Modal>
  );
}
