import axios from "axios";
import { Task } from "gantt-task-react";

export interface DataType {
  ID: number;
  StartDate?: string;
  EndDate?: string;
  Name?: string;
}

export const schedule = async (): Promise<Task[]> => {
  const response = await axios.get<DataType[]>("/dashboard/schedule", {
    params: localStorage.getItem("jwt"),
  });
  const newTasks: Task[] = response.data.map((item) => ({
    start: new Date(item.StartDate!),
    end: new Date(item.EndDate!),
    name: item.Name!,
    id: `Task ${item.ID}`,
    type: "task",
    progress: 45,
    styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
  }));
  return newTasks;
};
