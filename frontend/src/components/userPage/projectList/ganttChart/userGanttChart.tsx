import "gantt-task-react/dist/index.css";
import "./viewSwitcher";
import { useEffect, useState } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./viewSwitcher";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Empty } from "antd";
import AddScheduleModal from "./ganttChartModal";
import "../../../../assets/project/ganttChartOverride.css";
import { t } from "i18next";
import GanttTaskDelete from "./ganttChartDeleteModal";
import dayjs from "dayjs";
import UpdateModal from "./ganttChartUpdateModal";
import jwtDecode from "jwt-decode";

export function GanttChart({ selectedProject }) {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [openAddScheduleModal, setOpenAddScheduleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [taskName, setTaskName] = useState("");

  const userMode = localStorage.getItem("Mode");
  const CustomTooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }> = ({ task, fontSize, fontFamily }) => {
    return null;
  };
  const getSchedule = async () => {
    try {
      const response = await axios.get("/dashboard/schedule", {
        params: { ProjectID: selectedProject },
      });
      console.log(response);
      // const sortedResponse = response.data.sort(() => {
      //   return;
      // });
      setTaskName(response.data);
      setTasks(
        response.data.map((d) => {
          return {
            end: new Date(d.EndDate),
            id: d.ID,
            isDisabled: userMode === "Guest" ? true : false,
            name: (
              <div
                style={{
                  width: "100%",
                }}
              >
                {d.Type === "project" ? (
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ marginLeft: "10%" }}>{d.Name}</span>
                      {userMode === "Guest" || (
                        <span>
                          <Button
                            size="small"
                            onClick={async () => {
                              setSelectedTask(d);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <ul>
                      <li>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedTask(d);
                              setOpenUpdateModal(true);
                            }}
                          >
                            {d.Name}
                          </span>
                          {userMode === "Guest" || (
                            <span>
                              <Button
                                size="small"
                                onClick={async () => {
                                  setSelectedTask(d);
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <DeleteOutlined />
                              </Button>
                            </span>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ),
            progress: 45,
            start: new Date(d.StartDate),
            dependencies: [d.Dependencies],
            type: d.Type,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getTask = async () => {
    try {
      const response = await axios.get("/dashboard/getProjectGanttTask", {
        params: { ProjectID: selectedProject },
      });
      if (response.data.status === true) {
        setProjectList(response.data.result);
      } else {
        console.log("getTask failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSchedule();
    getTask();
  }, []);

  useEffect(() => {
    getTask();
  }, [tasks]);

  const handleTaskChange = (task: Task) => {
    const TaskID = Number(task.id);
    const NewStart = dayjs(task.start).format("YYYY-MM-DD");
    const NewEnd = dayjs(task.end).format("YYYY-MM-DD");
    axios.post("/dashboard/updateGanttDate", {
      TaskID: TaskID,
      NewStart: NewStart,
      NewEnd: NewEnd,
    });
    getTask();
  };
  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  return (
    <div className="Wrapper">
      {tasks.length > 0 ? (
        <div>
          <div style={{ textAlign: "left" }}>
            <ViewSwitcher
              onViewModeChange={(viewMode) => setView(viewMode)}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
              projectList={projectList}
              fetchSchdule={() => getSchedule()}
              selectedProject={selectedProject}
            />
          </div>

          <div style={{ backgroundColor: "white" }}>
            <Gantt
              TooltipContent={CustomTooltipContent}
              tasks={tasks}
              viewMode={view}
              onDateChange={handleTaskChange}
              onProgressChange={handleProgressChange}
              listCellWidth={isChecked ? "185px" : ""}
            />
          </div>
        </div>
      ) : (
        <div>
          {" "}
          <Empty
            description={
              <span>
                <p style={{ fontWeight: "bold" }}>GanttChart Task Not Found</p>
                <Button
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginRight: "0.5%",
                  }}
                  onClick={() => setOpenAddScheduleModal(true)}
                >
                  {t("CreateNow")}
                </Button>
              </span>
            }
          />
        </div>
      )}
      <GanttTaskDelete
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        selectedTask={selectedTask}
        selectedProject={selectedProject}
        onChange={() => {
          getSchedule();
        }}
      />
      <AddScheduleModal
        open={openAddScheduleModal}
        onClose={() => setOpenAddScheduleModal(false)}
        projectList={projectList}
        fetchSchdule={() => {
          getSchedule();
          getTask();
        }}
        selectedProject={selectedProject}
      />
      {selectedTask && (
        <UpdateModal
          open={openUpdateModal}
          onClose={() => {
            setOpenUpdateModal(false);
          }}
          projectList={projectList}
          fetchSchdule={() => {
            getSchedule();
            getTask();
          }}
          selectedProject={selectedProject}
          selectedGantt={selectedTask}
        />
      )}
    </div>
  );
}

export default GanttChart;
