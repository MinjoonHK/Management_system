import { Tabs } from "antd";
import GanttChart from "./ganttChart/userGanttChart";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { t } from "i18next";
import { DocumentSubmissionPage } from "./docSubPage";
import { ActivityLog } from "./prjActivityLog";
import { ProjectTimeSheet } from "./prjTimesheet/prjTimeSheet";
import { UserListPage } from "./prjUserListPage";
import jwtDecode from "jwt-decode";

interface successResponse {
  data: {
    status: true;
    message: string;
    result: [
      {
        Joined_User_Email: string;
        Created_At: Date;
        Role: string;
        FirstName: string;
        LastName: string;
      }
    ];
  };
}

interface userToken {
  Email: string;
  ID: number;
  Role: string;
  exp: number;
  iat: number;
}

export const ProjectDetail = () => {
  const [data, setData] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const { selectedProject } = useParams();

  const userToken: userToken = localStorage.getItem("jwt")
    ? jwtDecode(localStorage.getItem("jwt"))
    : null;

  const fetchProjectPeople = async () => {
    try {
      const response: successResponse = await axios.get(
        "dashboard/getProjectPeople",
        {
          params: { ProjectID: selectedProject },
        }
      );
      if (response.data.status === true) {
        const findUser = response.data.result.find(
          (users) => users.Joined_User_Email == userToken.Email
        );
        localStorage.setItem("Mode", findUser.Role);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    fetchProjectPeople();
    setCurrentProject(selectedProject);
  }, []);

  const userMode = localStorage.getItem("Mode");

  return (
    <div>
      {userMode === "Guest" ? (
        <div>
          <Tabs
            type="card"
            items={[
              {
                label: <div style={{ color: "black" }}>{t("GanttChart")}</div>,
                key: "GanttChart",
                children: <GanttChart selectedProject={selectedProject} />,
              },
              {
                label: (
                  <div style={{ color: "black" }}>
                    {t("DocumentSubmission")}
                  </div>
                ),
                key: "Document Submission",
                children: (
                  <DocumentSubmissionPage selectedProject={selectedProject} />
                ),
              },
            ]}
          />
        </div>
      ) : (
        <div>
          <Tabs
            type="card"
            items={[
              {
                label: (
                  <div style={{ color: "black" }}>{t("WorkingSchedule")}</div>
                ),
                key: "WorkingSchdule",
                children: (
                  <ProjectTimeSheet selectedProject={selectedProject} />
                ),
              },
              {
                label: <div style={{ color: "black" }}>{t("GanttChart")}</div>,
                key: "GanttChart",
                children: <GanttChart selectedProject={selectedProject} />,
              },
              {
                label: (
                  <div style={{ color: "black" }}>
                    {t("DocumentSubmission")}
                  </div>
                ),
                key: "Document Submission",
                children: (
                  <DocumentSubmissionPage selectedProject={selectedProject} />
                ),
              },
              {
                label: (
                  <div style={{ color: "black" }}>{t("ActivityLogs")}</div>
                ),
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
      )}
    </div>
  );
};
