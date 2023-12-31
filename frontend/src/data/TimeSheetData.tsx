import axios from "axios";

interface DataType {
  Start: Date;
  ID: number;
  End: Date;
  Title: string;
  CalendarID: number;
  Description: string;
}
export const data = async (): Promise<DataType[]> => {
  const Token = localStorage.getItem("jwt");
  const response = await axios.get<DataType[]>("/dashboard/timesheet", {
    params: { Token },
  });
  console.log(response);
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
    start: new Date(item.Start),
    end: new Date(item.End),
    title: item.Title,
    description: item.Description,
  }));
  return newData;
};
