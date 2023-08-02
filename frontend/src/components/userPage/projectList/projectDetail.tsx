import {
  Button,
  Calendar,
  Card,
  Descriptions,
  Divider,
  Modal,
  Table,
  Tabs,
} from "antd";
import GanttChart from "./ganttChart/userGanttChart";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DocumentSubmission from "./documentSubmission/documentSubmissionModal";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ColumnsType } from "antd/es/table";
import LogModal from "./logModal";
import { t } from "i18next";
import { DocumentSubmissionPage } from "./documentSubmission";

export const ProjectDetail = () => {
  const [openDocumentSubmissionModal, setOpenDocumentSubmissionModal] =
    useState(false);
  const [data, setData] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const [openLogModal, setOpenLogModal] = useState(true);
  const { selectedProject } = useParams();

  const FileColumns: ColumnsType = [
    {
      title: "File Name",
      dataIndex: "Name",
      align: "center",
    },
    {
      title: "Uploader",
      dataIndex: "FirstName",
      align: "center",
    },
    {
      title: "Uploaded Date",
      dataIndex: "UploadDate",
      align: "center",
    },
    {
      title: "File Size",
      dataIndex: "Size",
      align: "center",
    },
    {
      title: "Download",
      dataIndex: "Download",
      align: "center",
    },
    {
      title: "Download Logs",
      dataIndex: "DownloadLogs",
      align: "center",
      render: (text) => (
        <Button
          onClick={() => {
            setOpenLogModal(true);
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard/upload/fileList", {
        params: { ProjectID: selectedProject },
      });
      const newData = res.data.result.map((item: any) => ({
        ...item,
        key: item.ID,
        UploadDate: dayjs(item.UploadDate).format("YYYY-MMM-DD"),
        Size: (item.Size / 1000).toString() + " " + "KB",
        Download: (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              download={true}
              href={`${
                axios.defaults.baseURL
              }/download?token=${encodeURIComponent(
                localStorage.getItem("jwt")
              )}&fileId=${item.ID}`}
              className="btn"
              style={{ color: "rgb(45,68,134)", textDecoration: "underline" }}
            >
              download
            </a>
          </div>
        ),
      }));
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentProject(selectedProject);
  }, []);
  return (
    <div>
      <Tabs
        type="card"
        items={[
          {
            label: <div style={{ color: "black" }}>Working Schedule</div>,
            key: "WorkingSchdule",
            children: <Calendar />,
          },
          {
            label: <div style={{ color: "black" }}>Gantt Chart</div>,
            key: "GanttChart",
            children: <GanttChart />,
          },
          {
            label: <div style={{ color: "black" }}>Document Submission</div>,
            key: "Document Submission",
            children: (
              <DocumentSubmissionPage selectedProject={selectedProject} />
            ),
          },
          {
            label: <div style={{ color: "black" }}>Document Pool</div>,
            key: "Document Pool",
            children: (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1.5%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      marginLeft: "1%",
                    }}
                  >
                    Uploaded Files
                  </span>
                  <span>
                    <Button
                      shape={"round"}
                      onClick={() => {
                        setOpenDocumentSubmissionModal(true);
                      }}
                    >
                      Upload Files
                      <UploadOutlined />
                    </Button>
                  </span>
                </div>
                <Table dataSource={data} columns={FileColumns} />
              </div>
            ),
          },
        ]}
      />
      <DocumentSubmission
        open={openDocumentSubmissionModal}
        onClose={() => {
          setOpenDocumentSubmissionModal(false);
        }}
        onChange={() => {
          fetchData();
        }}
        selectedProject={currentProject}
      />
      {/* <LogModal
        open={openLogModal}
        onClose={() => {
          setOpenLogModal(false);
        }}
        selectedProject={selectedProject}
      /> */}
    </div>
  );
};
