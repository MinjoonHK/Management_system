import { Card, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

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
        Swal.fire("Successfully Deleted", "success");
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