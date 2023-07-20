import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface OverallPerformanceTable {
  key: number;
  name: string;
  age: number;
  address: string;
  tags: string;
  Status: string;
}

export const overallColumns: ColumnsType<OverallPerformanceTable> = [
  {
    title: "Serial Number",
    dataIndex: "Serial_Number",
    key: "Serial_Number",
    align: "center",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Average Daily Power Generation (KWH)",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Average Monthly Power Generation (KWH)",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Total Power Generation (KWH)",
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
    key: "Status",
    dataIndex: "Status",
    align: "center",
    render: (_, { Status }) => (
      <>
        {Status === "OK" && (
          <Tag color="success" key={Status}>
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

export const overallColumns2: ColumnsType<OverallPerformanceTable> = [
  {
    title: "Total Average Daily Power Generation (KWH)",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Total Average Monthly Power Generation (KWH)",
    dataIndex: "age",
    key: "age",
    align: "center",
  },
  {
    title: "Total Power Generation (KWH)",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "Average AC voltage (Vac)",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
];
