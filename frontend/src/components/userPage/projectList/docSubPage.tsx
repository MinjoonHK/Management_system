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
import { t } from "i18next";

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

  const userMode = localStorage.getItem("Mode");
  return (
    <div>
      {taskList.length > 0 ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <h2>{t("SubmissionTasks")}</h2>
            </span>
            {userMode === "Guest" || (
              <span>
                <Button
                  onClick={() => {
                    setOpenAddDocumentSubmissionModal(true);
                  }}
                  style={{ marginTop: "15%" }}
                  shape="round"
                >
                  <PlusOutlined />
                  <span style={{ fontSize: "15px" }}>{t("AddTask")}</span>
                </Button>
              </span>
            )}
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
                <Descriptions.Item label={t("Manager")}>
                  {e.CreatorName}
                </Descriptions.Item>
                <Descriptions.Item label={t("Status")}>
                  {e.Status}
                </Descriptions.Item>
                <Descriptions.Item label={t("StartDate")}>
                  {e.CreateDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item label={t("DueDate")}>
                  {e.DueDate.substring(0, 10)}
                </Descriptions.Item>
                {userMode === "Manager" && (
                  <Descriptions.Item
                    style={{ textAlign: "center" }}
                    label={t("DropTask")}
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
                )}
              </Descriptions>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          title={
            <div style={{ textAlign: "left" }}>
              <div style={{ padding: 0 }}>
                <h2>{t("Welcome")}</h2>
              </div>
              <div>{t("DocSubPage")}</div>
            </div>
          }
        >
          {userMode === "Guest" ? (
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              {t("YouAreInvitedAsGuestAndNoTasksOngoingNow")}
              You are invited as Guest and no tasks ongoing now
            </div>
          ) : (
            <Button
              shape="round"
              onClick={() => setOpenAddDocumentSubmissionModal(true)}
            >
              <PlusOutlined />
              <span style={{ fontSize: "15px" }}>{t("DocSubAddButton")}</span>
            </Button>
          )}
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
