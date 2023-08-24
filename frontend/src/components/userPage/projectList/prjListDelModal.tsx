import { Card, Modal, Button } from "antd";
import axios from "axios";
import { t } from "i18next";

export default function DeleteModal({
  open,
  onClose,
  selectedProject,
  onChange,
}) {
  const handleDelete = async () => {
    const res = await axios.post("/dashboard/deleteProjectList", {
      ProjectID: selectedProject.ID,
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
          {selectedProject && (
            <div>
              {`Are you sure about deleting ${selectedProject.ProjectName}?`}
            </div>
          )}
        </div>
      </Card>
    </Modal>
  );
}
