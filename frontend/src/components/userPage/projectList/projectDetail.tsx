import { Button, Calendar, List, Table, Tabs } from "antd";
import GanttChart from "./ganttChart/userGanttChart";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { t } from "i18next";
import { DocumentSubmissionPage } from "./docSubPage";
import { DocumentPool } from "./prjDocPool";
import { FileColumns } from "./docPoolFileColumns";
import { ActivityLog } from "./prjActivityLog";
import { ProjectTimeSheet } from "./prjTimesheet/prjTimeSheet";
import { UserListPage } from "./prjUserListPage";

export const ProjectDetail = () => {
  const [data, setData] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const { selectedProject } = useParams();

  console.log(selectedProject);
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
              )}&fileId=${item.ID}&projectID=${selectedProject}`}
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
            label: <div style={{ color: "black" }}>{t("WorkingSchedule")}</div>,
            key: "WorkingSchdule",
            children: <ProjectTimeSheet />,
          },
          {
            label: <div style={{ color: "black" }}>{t("GanttChart")}</div>,
            key: "GanttChart",
            children: <GanttChart selectedProject={selectedProject} />,
          },
          {
            label: (
              <div style={{ color: "black" }}>{t("DocumentSubmission")}</div>
            ),
            key: "Document Submission",
            children: (
              <DocumentSubmissionPage selectedProject={selectedProject} />
            ),
          },
          {
            label: <div style={{ color: "black" }}>{t("ActivityLogs")}</div>,
            key: "ActivityLogs",
            children: <ActivityLog selectedProject={selectedProject} />,
          },

          {
            label: <div style={{ color: "black" }}>{t("UserList")}</div>,
            key: "UserList",
            children: <UserListPage selectedProject={selectedProject} />,
          },
        ]}
      />
    </div>
  );
};
