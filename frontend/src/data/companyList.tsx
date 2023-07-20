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
  const response = await axios.get<DataType[]>("/dashboard/companylist");
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
    key: item.ID,
    value: item.Name,
    label: item.Name,
    Created_at: formatDate(item.Created_at),
  }));
  return newData;
};
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
