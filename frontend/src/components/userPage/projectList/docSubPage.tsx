import { Button, Card, Descriptions } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentSubmissionModal } from "./docSubModal";
import DocSubDelModal from "./docSubDelModal";
import DocumentUploadModal from "./docSubUpload";

export const DocumentSubmissionPage = ({ selectedProject }) => {
  const [taskList, setTaskList] = useState([]);
  const [openAddDocumentSubmissionModal, setOpenAddDocumentSubmissionModal] =
    useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDocumentSubmissionModal, setOpenDocumentSubmissionModal] =
    useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard/submissiontask", {
        params: { project_ID: selectedProject },
      });

      setTaskList(res.data.result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {taskList.length > 0 ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <h2>Submission Tasks</h2>
            </span>
            <span>
              <Button
                onClick={() => {
                  setOpenAddDocumentSubmissionModal(true);
                }}
                style={{ marginTop: "15%" }}
                shape="round"
              >
                <PlusOutlined />
                <span style={{ fontSize: "15px" }}>Add Task</span>
              </Button>
            </span>
          </div>
          {taskList.map((e) => (
            <Card
              style={{ marginBottom: "1%", height: "100%" }}
              bodyStyle={{ padding: "0 24px" }}
              key={"docsubmissiontask" + e.ID}
              title={
                <h3
                  style={{
                    textAlign: "left",
                    color: "RGB(5, 99, 193)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedTask(e);
                    setOpenDocumentSubmissionModal(true);
                  }}
                >
                  {e.Name}
                </h3>
              }
            >
              <Descriptions layout="vertical" bordered={false} column={5}>
                <Descriptions.Item label="Manager">
                  {e.CreatorName}
                </Descriptions.Item>
                <Descriptions.Item label="Status">{e.Status}</Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {e.CreateDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item label="Due Date">
                  {e.DueDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item
                  style={{ textAlign: "center" }}
                  label="Drop Task"
                >
                  <Button>
                    <DeleteOutlined
                      onClick={() => {
                        setSelectedTask(e);
                        setOpenDelModal(true);
                      }}
                    />
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          title={
            <div style={{ textAlign: "left" }}>
              <div style={{ padding: 0 }}>
                <h2>Welcome!</h2>
              </div>
              <div>To Document submission page</div>
            </div>
          }
        >
          <Button
            shape="round"
            onClick={() => setOpenAddDocumentSubmissionModal(true)}
          >
            <PlusOutlined />
            <span style={{ fontSize: "15px" }}>Add your first Task</span>
          </Button>
        </Card>
      )}
      <DocumentSubmissionModal
        open={openAddDocumentSubmissionModal}
        onClose={() => {
          setOpenAddDocumentSubmissionModal(false);
        }}
        onChange={() => {
          fetchData();
        }}
      />
      <DocSubDelModal
        open={openDelModal}
        onClose={() => {
          setOpenDelModal(false);
        }}
        selectedTask={selectedTask}
        onChange={() => {
          fetchData();
        }}
      />
      <DocumentUploadModal
        open={openDocumentSubmissionModal}
        onClose={() => {
          setSelectedTask(null);
          setOpenDocumentSubmissionModal(false);
        }}
        onChange={() => {
          fetchData();
        }}
        selectedProject={selectedProject}
        selectedTask={selectedTask}
      />
    </div>
  );
};
