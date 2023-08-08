import { ProColumns } from "@ant-design/pro-components";
import { ColumnsType } from "antd/es/table";
import { t } from "i18next";

export type ActivityLogData = {
  key: number;
  TimeStamp: string;
  TaskName: string;
  FileName: string;
  Acitivity: string;
};

export const ActivityLogColumns: ProColumns<ActivityLogData>[] = [
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
    dataIndex: "TaskName",
    align: "center",
  },
  {
    title: <div>{t("TimeStamp")}</div>,
    dataIndex: "TimeStamp",
    align: "center",
  },
];
