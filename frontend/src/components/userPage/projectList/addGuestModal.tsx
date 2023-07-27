import { Card, Modal, Button, Input } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddGuestModal({ open, onClose, selectedProject }) {
  const handleShare = async () => {
    const res = await axios.post("/dashboard/deleteProjectList", {
      ProjectID: selectedProject.ID,
    });
    if (res) {
      try {
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
          key="Share"
          onClick={handleShare}
          style={{ color: "white", backgroundColor: "rgb(45,68,134)" }}
        >
          Share
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
            Add Guest By Email
          </div>
        }
      >
        <Input placeholder="Please input email address" size="large" />
      </Card>
    </Modal>
  );
}
