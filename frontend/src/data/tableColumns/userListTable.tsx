import { ColumnsType } from "antd/es/table";
import { DataType } from "../userList";
import { Tag } from "antd";

export const columns: ColumnsType<DataType> = [
  {
    title: "User Name",
    dataIndex: "FirstName",
    align: "center",
  },
  {
    title: "Role",
    dataIndex: "Role",
    align: "center",
    filters: [
      {
        text: "User",
        value: "User",
      },
      {
        text: "Admin",
        value: "Admin",
      },
    ],

    onFilter: (value: string, record) => record.Role.indexOf(value) === 0,
  },
  {
    title: "Company",
    dataIndex: "Company",
    align: "center",
  },
  {
    title: "Contact",
    dataIndex: "PhoneNumber",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "Email",
    align: "center",
  },
  {
    title: "Joined Date",
    dataIndex: "Created_at",
    align: "center",
    sorter: (a, b) =>
      new Date(a.Created_at).valueOf() - new Date(b.Created_at).valueOf(),
  },
  {
    title: "Status",
    key: "isActive",
    dataIndex: "isActive",
    align: "center",
    filters: [
      {
        text: "Active",
        value: "Active",
      },
      {
        text: "Deactivated",
        value: "Deactivated",
      },
    ],

    onFilter: (value: string, record) => record.isActive.indexOf(value) === 0,
    render: (_, { isActive }) => (
      <>
        {isActive === "Active" && (
          <Tag color="success" key={isActive}>
            {isActive}
          </Tag>
        )}
        {isActive === "Deactivated" && (
          <Tag color="error" key={isActive}>
            {isActive}
          </Tag>
        )}
      </>
    ),
  },
];
