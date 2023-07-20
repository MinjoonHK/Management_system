import "gantt-task-react/dist/index.css";
import "./viewSwitcher";
import { useEffect, useState } from "react";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import { ViewSwitcher } from "./viewSwitcher";
import axios from "axios";

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

function GanttChart() {
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChecked, setIsChecked] = useState(true);

  const getSchedule = async (token: any) => {
    try {
      const response = await axios.get("/dashboard/schedule", {
        params: { Token: token },
      });
      console.log("scheduleResponse", response);
      setTasks(
        response.data.map((d) => {
          return {
            end: new Date(d.EndDate),
            id: d.ID,
            name: d.Name,
            progress: d.Progress,
            start: new Date(d.StartDate),
            type: d.Type,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    getSchedule(token);
  }, []);

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
    console.log("On progress change Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <div style={{ textAlign: "left" }}>
        <ViewSwitcher
          onViewModeChange={(viewMode) => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
      </div>
      {tasks.length && (
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDateChange={handleTaskChange}
          onProgressChange={handleProgressChange}
          listCellWidth={isChecked ? "185px" : ""}
        />
      )}
    </div>
  );
}

export default GanttChart;
