import React, { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { DataType, data } from "../data/companyList";
import { Link } from "react-router-dom";
import { columns } from "../data/tableColumns/companyListTable";

const CompanyList: React.FC = () => {
  const [dataList, setDataList] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bordered, setBordered] = useState(false);
  const [size, setSize] = useState<SizeType>("large");
  const [showHeader, setShowHeader] = useState(true);
  const [rowSelection, setRowSelection] = useState<
    TableRowSelection<DataType> | undefined
  >({});
  const [tableLayout, setTableLayout] = useState();
  const [ellipsis, setEllipsis] = useState(false);

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

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    showHeader,
    rowSelection,
    tableLayout,
  };

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <Link to="/addCompany">
          <Button>
            <b>Add Company +</b>
          </Button>
        </Link>
        <span style={{ marginLeft: "15px" }}>
          <Button>
            <b>Delete Selected Company -</b>
          </Button>
        </span>
      </div>
      <Table {...tableProps} columns={tableColumns} dataSource={dataList} />
    </>
  );
};

export default CompanyList;
