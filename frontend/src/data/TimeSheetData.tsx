import axios from "axios";
import jwtDecode from "jwt-decode";

interface DataType {
  Start: string;
  ID: number;
  End: string;
  Title: string;
}
export const data = async (): Promise<DataType[]> => {
  const Token = localStorage.getItem("jwt");
  console.log(Token);
  const response = await axios.get<DataType[]>("/dashboard/timesheet", {
    params: { Token },
  });
  console.log(response.data);
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
  }));
  return newData;
};
