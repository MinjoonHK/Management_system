import React, { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { DataType, data } from "../data/workOrderList";
import { Link } from "react-router-dom";
import { columns } from "../data/tableColumns/workOrderTable";
import axios from "axios";

const WorkOrder: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>("large");
  const [showHeader, setShowHeader] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [ellipsis, setEllipsis] = useState(false);
  const [dataList, setDataList] = useState([]);
  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    showHeader,
    tableLayout,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await data();
        setDataList(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const FinishOrder = async () => {
    try {
      const res = await axios.post("/dashboard/finishorder", {
        params: { FinishOrderList: selectedRowKeys },
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
        <Link to="/addworkorder">
          <Button>
            <b>Click to add Work Order +</b>
          </Button>
        </Link>
        <Button onClick={FinishOrder} style={{ marginLeft: "1%" }}>
          <b>Click to Finish Work Order</b>
        </Button>
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

export default WorkOrder;
