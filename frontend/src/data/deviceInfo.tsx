import axios from "axios";

export interface DataType {
  key: React.Key;
  ID: number;
  Owner: string;
  Address?: string;
  Name?: string;
  contact?: string;
  Created_at?: string;
  maintainence?: string;
}

export const data = async (): Promise<DataType[]> => {
  const response = await axios.get<DataType[]>("/dashboard/performance");
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
    key: item.ID,
  }));
  return newData;
};
