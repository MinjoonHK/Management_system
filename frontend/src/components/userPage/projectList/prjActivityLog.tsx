import { Table } from "antd";
import { ActivityLogColumns } from "./prjActivityLogColumn";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export const ActivityLog = ({ selectedProject }) => {
  const [data, setData] = useState(null);
  const fetchTableData = async () => {
    const response = await axios.get("/dashboard/activityLogs", {
      params: { project_ID: selectedProject },
    });
    if (response.data.status === true) {
      const newData = response.data.result.map((item: any) => ({
        ...item,
        key: item.ID,
        TimeStamp: dayjs(item.TimeStamp).format("YYYY-MM-DD"),
      }));
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
      <Table dataSource={data} columns={ActivityLogColumns} />
    </div>
  );
};
