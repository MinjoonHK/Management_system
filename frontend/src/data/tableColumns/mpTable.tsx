import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface MonthlyPerformanceTable {
  key: number;
  name: string;
  age: number;
  address: string;
  tags: string;
  Status: string;
  Serial_Number: string;
}

export const monthlyColumns: ColumnsType<MonthlyPerformanceTable> = [
  {
    title: "Serial Number",
    dataIndex: "Serial_Number",
    key: "Serial_Number",
    align: "center",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Average Monthly Power Generation (KWH)",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Total Monthly Power Generation (KWH)",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "AC voltage (Vac)",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "Status",
    key: "tags",
    dataIndex: "tags",
    align: "center",
    render: (_, { Status }) => (
      <>
        {Status === "OK" && (
          <Tag color="success" key={Status}>
            {Status}
          </Tag>
        )}
        {Status === "WARNING" && (
          <Tag color="warning" key={Status}>
            {Status}
          </Tag>
        )}
        {Status === "ERROR" && (
          <Tag color="error" key={Status}>
            {Status}
          </Tag>
        )}
      </>
    ),
  },
];
