import { ColumnsType } from "antd/es/table";
import { DataType } from "../workOrderList";

import { Button, Tag } from "antd";

import { t } from "i18next";

export const columns: ColumnsType<DataType> = [
  {
    title: <>{t("CompanyName")}</>,
    dataIndex: "Company",
    align: "center",
  },
  {
    title: <>{t("Orderer")}</>,
    dataIndex: "Orderer",
    align: "center",
  },
  {
    title: <>{t("Contact")}</>,
    dataIndex: "Contact",
    align: "center",
  },
  {
    title: <>{t("Email")}</>,
    dataIndex: "Email",
    align: "center",
  },
  {
    title: <>{t("WorkOrderSummary")}</>,
    dataIndex: "OrderSummary",
    align: "center",
  },
  {
    title: <>{t("StartDate")}</>,
    dataIndex: "StartDate",
    align: "center",
    sorter: (a, b) =>
      new Date(a.StartDate).valueOf() - new Date(b.StartDate).valueOf(),
  },
  {
    title: <>{t("DueDate")}</>,
    dataIndex: "EndDate",
    align: "center",
    sorter: (a, b) =>
      new Date(a.StartDate).valueOf() - new Date(b.StartDate).valueOf(),
  },
  {
    title: <>{t("Status")}</>,
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
