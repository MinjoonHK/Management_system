import { Card, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

export default function GanttTaskDelete({
  open,
  onClose,
  selectedTask,
  selectedProject,
  onChange,
}) {
  const ProjectID = Number(selectedProject);
  const handleDelete = async () => {
    const response = await axios.post("/dashboard/deleteGantt", {
      SelectedGantt: selectedTask.ID,
      ProjectID: ProjectID,
      Type: selectedTask.Type,
    });
    if (response.data.status === true) {
      Swal.fire({
        title: "Deletion Successful",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });
      onChange();
      onClose();
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
