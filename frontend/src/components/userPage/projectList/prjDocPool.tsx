import { Table } from "antd";
import { t } from "i18next";

export const DocumentPool = ({ data, FileColumns }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5%",
        }}
      >
        <span
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginLeft: "1%",
          }}
        >
          {t("UploadedFiles")}
        </span>
      </div>

      <Table dataSource={data} columns={FileColumns} />
    </div>
  );
};
