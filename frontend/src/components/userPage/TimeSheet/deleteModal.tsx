import { Card, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

export default function DeleteModal({ open, onClose, deleteID }) {
  const handleDelete = () => {
    console.log(deleteID);
    const res = axios.post("/dashboard/deleteCalendar", {
      CalendarID: deleteID,
    });
    if (res) {
      try {
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
          style={{ color: "white" }}
          onClick={handleDelete}
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
          Are you sure about the deleting the selected Calendar?
        </div>
      </Card>
    </Modal>
  );
}
