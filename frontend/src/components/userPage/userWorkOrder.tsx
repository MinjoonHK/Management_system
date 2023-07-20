import React, { useState } from "react";
import { Button, Table, Tag } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { DataType, data } from "../../data/companyList";
import { Link } from "react-router-dom";

const columns: ColumnsType<DataType> = [
  {
    title: "CompanyName",
    dataIndex: "CompanyName",
    align: "center",
  },
  {
    title: "Contact",
    align: "center",
    dataIndex: "contact",
  },
  {
    title: "Email",
    align: "center",
    dataIndex: "maintainence",
  },
  {
    title: "Address",
    dataIndex: "address",
    align: "center",
  },
  {
    title: "Work Order Summary",
    align: "center",
    dataIndex: "maintainence",
  },

  {
    title: "Status",
    key: "isActive",
    dataIndex: "isActive",
    align: "center",
    // render: (_, { isActive }) => (
    //   <>
    //     {isActive === "Active" && (
    //       <Tag color="success" key={isActive}>
    //         {isActive}
    //       </Tag>
    //     )}
    //   </>
    // ),
  },
];

const WorkOrder: React.FC = () => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>("large");
  const [showHeader, setShowHeader] = useState(true);
  const [rowSelection, setRowSelection] = useState<
    TableRowSelection<DataType> | undefined
  >({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string>();

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
  }

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    showHeader,
    rowSelection,
    scroll,
    tableLayout,
  };
  data();
  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <Link to="/addWorkOrder">
          <Button>
            <b>Click to add Work Order +</b>
          </Button>
        </Link>
      </div>
      <Table
        {...tableProps}
        columns={tableColumns}
        // dataSource={hasData ? data : []}
        scroll={scroll}
      />
    </>
  );
};

export default WorkOrder;
