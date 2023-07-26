import axios from "axios";

interface DataType {}
export const data = async (): Promise<DataType[]> => {
  const response = await axios.get<DataType[]>("/dashboard/projectList");
  const projectList: DataType[] = response.data.map((item) => ({
    ...item,
  }));
  return projectList;
};
