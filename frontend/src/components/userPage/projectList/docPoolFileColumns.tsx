import { ColumnsType } from "antd/es/table";
import { t } from "i18next";
export const FileColumns: ColumnsType = [
  {
    title: <div>{t("FileName")}</div>,
    dataIndex: "Name",
    align: "center",
    width: "30%",
    ellipsis: true,
  },
  {
    title: <div>{t("Uploader")}</div>,
    dataIndex: "FirstName",
    align: "center",
  },
  {
    title: <div>{t("UploadedDate")}</div>,
    dataIndex: "UploadDate",
    align: "center",
  },
  {
    title: <div>{t("FileSize")}</div>,
    dataIndex: "Size",
    align: "center",
  },
  {
    title: <div>{t("Download")}</div>,
    dataIndex: "Download",
    align: "center",
  },
];
