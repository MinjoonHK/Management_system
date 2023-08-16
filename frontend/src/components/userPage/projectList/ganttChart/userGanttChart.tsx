import "gantt-task-react/dist/index.css";
import "./viewSwitcher";
import { useEffect, useState } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./viewSwitcher";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import AddScheduleModal from "./ganttChartModal";
import "../../../../assets/project/ganttChartOverride.css";
import { t } from "i18next";
import GanttTaskDelete from "./ganttChartDeleteModal";

function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  if (projectTasks.length) {
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;

    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      if (start.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (end.getTime() < task.end.getTime()) {
        end = task.end;
      }
    }
    return [start, end];
  } else {
    return [new Date(), new Date()];
  }
}

export function GanttChart({ selectedProject }) {
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [openAddScheduleModal, setOpenAddScheduleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const getSchedule = async () => {
    try {
      const response = await axios.get("/dashboard/schedule", {
        params: { ProjectID: selectedProject },
      });

      setTasks(
        response.data.map((d) => {
          return {
            end: new Date(d.EndDate),
            id: d.ID,
            name: (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "100%", marginLeft: "17%" }}>{d.Name}</div>
                <Button
                  size="small"
                  onClick={async () => {
                    setSelectedTask(d);
                    setOpenDeleteModal(true);
                  }}
                >
                  <DeleteOutlined />
                </Button>
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
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
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
    </div>
  );
}

export default GanttChart;
