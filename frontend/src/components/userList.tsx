import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { TableProps } from "antd/es/table";
import { DataType, data } from "../data/userList";
import axios from "axios";
import { columns } from "../data/tableColumns/userListTable";

const UserList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>("large");
  const [showHeader, setShowHeader] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [ellipsis, setEllipsis] = useState(false);
  const [dataList, setDataList] = useState([]);
  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await data();
        setDataList(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    showHeader,
    tableLayout,
  };

  const DeactivateUser = async () => {
    try {
      const res = await axios.post("/dashboard/deactivateuser", {
        params: { DeactivateUserList: selectedRowKeys },
      });
      if (res.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ActivateUser = async () => {
    try {
      const res = await axios.post("/dashboard/activateuser", {
        params: { ActivateUserList: selectedRowKeys },
      });
      if (res.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <Button onClick={ActivateUser}>
          <b>Activate Selected User</b>
        </Button>
        <span style={{ marginLeft: "15px" }}>
          <Button onClick={DeactivateUser}>
            <b>Deactivate Selected User</b>
          </Button>
        </span>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        {...tableProps}
        columns={tableColumns}
        dataSource={dataList}
      />
    </>
  );
};

export default UserList;
