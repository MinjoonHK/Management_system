import { ConfigProvider, Table } from "antd";
import { ActivityLogColumns } from "./prjActivityLogColumn";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { ProTable } from "@ant-design/pro-components";
import enUS from "antd/locale/en_US";
dayjs.locale("en_US");

export type ActivityLogData = {
  key: number;
  TimeStamp: string;
  TaskName: string;
  FileName: string;
  Acitivity: string;
};

export const ActivityLog = ({ selectedProject }) => {
  const [data, setData] = useState(null);
  const fetchTableData = async () => {
    const response = await axios.get("/dashboard/activityLogs", {
      params: { project_ID: selectedProject },
    });
    console.log(response);
    if (response.data.status === true) {
      const newData: ActivityLogData[] = response.data.result.map(
        (item: any) => ({
          ...item,
          key: item.ID,
          TimeStamp: dayjs(item.TimeStamp).format("YYYY-MM-DD"),
          TaskName: item.SubmissionTaskName,
          FileName: item.FilName,
        })
      );
      setData(newData);
    } else {
      console.log(response.data.error);
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  return (
    <div>
      <ConfigProvider locale={enUS}>
        <ProTable
          dataSource={data}
          columns={ActivityLogColumns}
          pagination={{ pageSize: 5 }}
          search={false}
        ></ProTable>
      </ConfigProvider>
    </div>
  );
};
