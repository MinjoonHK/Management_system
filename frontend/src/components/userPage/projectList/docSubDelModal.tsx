import { Card, Modal, Button } from "antd";
import axios from "axios";
import { t } from "i18next";

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
          {t("Cancel")}
        </Button>,
        <Button
          type="primary"
          danger
          key="Delete"
          onClick={handleDelete}
          style={{ color: "white" }}
        >
          {t("Delete")}
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
            {t("Confirmation")}
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
