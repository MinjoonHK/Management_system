import { ColumnsType } from "antd/es/table";
import { t } from "i18next";

export const ActivityLogColumns: ColumnsType = [
  {
    title: <div>{t("Name")}</div>,
    dataIndex: "FirstName",
    align: "center",
  },
  {
    title: <div>{t("Activity")}</div>,
    dataIndex: "Activity",
    align: "center",
  },
  {
    title: <div>{t("FileName")}</div>,
    dataIndex: "FileName",
    align: "center",
  },
  {
    title: <div>{t("TaskName")}</div>,
    dataIndex: "FileName",
    align: "center",
  },
  {
    title: <div>{t("ProjectName")}</div>,
    dataIndex: "ProjectName",
    align: "center",
  },
  {
    title: <div>{t("TimeStamp")}</div>,
    dataIndex: "TimeStamp",
    align: "center",
  },
];
