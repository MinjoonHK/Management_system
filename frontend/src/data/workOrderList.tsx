import axios from "axios";

export interface DataType {
  key: React.Key;
  ID: number;
  Address?: string;
  Company?: string;
  OrderSummary?: string;
  Orderer?: string;
  contact?: string;
  StartDate?: string;
  Status?: string;
  EndDate?: string;
}
export const data = async (): Promise<DataType[]> => {
  const response = await axios.get<DataType[]>("/dashboard/workorder");
  const newData: DataType[] = response.data.map((item) => ({
    ...item,
    key: item.ID,
    StartDate: formatDate(item.StartDate),
    EndDate: formatDate(item.EndDate),
  }));
  return newData;
};
function formatDate(dateString: string | null) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
