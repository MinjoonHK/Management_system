import { ColumnsType } from "antd/es/table";
import { DataType } from "../workOrderList";
import { FileSearchOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import { Link } from "react-router-dom";

export const columns: ColumnsType<DataType> = [
  {
    title: "Company Name",
    dataIndex: "Company",
    align: "center",
  },
  {
    title: "Orderer",
    dataIndex: "Orderer",
    align: "center",
  },
  {
    title: "Contact",
    dataIndex: "Contact",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "Email",
    align: "center",
  },
  {
    title: "Work Order Summary",
    dataIndex: "OrderSummary",
    align: "center",
  },
  {
    title: "Start Date",
    dataIndex: "StartDate",
    align: "center",
    sorter: (a, b) =>
      new Date(a.StartDate).valueOf() - new Date(b.StartDate).valueOf(),
  },
  {
    title: "End Date",
    dataIndex: "EndDate",
    align: "center",
    sorter: (a, b) =>
      new Date(a.StartDate).valueOf() - new Date(b.StartDate).valueOf(),
  },
  {
    title: "Status",
    key: "Status",
    dataIndex: "Status",
    align: "center",
    render: (_, { Status }) => (
      <>
        {Status === "Progressing" && (
          <Tag color="warning" key={Status}>
            {Status}
          </Tag>
        )}
        {Status === "Completed" && (
          <Tag color="success" key={Status}>
            {Status}
          </Tag>
        )}
      </>
    ),
  },
  // {
  //   title: "See Detail",
  //   key: "Status",
  //   dataIndex: "Status",
  //   align: "center",
  //   render: (text) => (
  //     <Link to="/workorderdetail">
  //       <Button>
  //         <FileSearchOutlined />
  //       </Button>
  //     </Link>
  //   ),
  // },
];
