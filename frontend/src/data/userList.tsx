import axios from "axios";

export interface DataType {
  key: React.Key;
  ID: number;
  FirstName?: string;
  Email?: string;
  isActive?: string;
  PhoneNumber?: string;
  Created_at?: string;
  Company?: string;
  Role?: string;
}
export const data = async (): Promise<DataType[]> => {
  const response = await axios.get<DataType[]>("/dashboard/userlist");
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
    key: item.ID,
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
