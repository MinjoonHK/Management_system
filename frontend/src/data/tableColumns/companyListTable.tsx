import { ColumnsType } from "antd/es/table";
import { DataType } from "../companyList";

export const columns: ColumnsType<DataType> = [
  {
    title: "Company Name",
    dataIndex: "Name",
    align: "center",
  },
  {
    title: "Address",
    dataIndex: "Address",
    align: "center",
  },
  {
    title: "Owner",
    dataIndex: "Owner",
    align: "center",
  },
  {
    title: "Contact",
    dataIndex: "Contact",
    align: "center",
  },
  {
    title: "Joined Date",
    align: "center",
    dataIndex: "Created_at",
    sorter: (a, b) =>
      new Date(a.Created_at).valueOf() - new Date(b.Created_at).valueOf(),
  },
];
