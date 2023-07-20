import { MenuProps } from "antd";
import { t } from "i18next";
import { NavLink } from "react-router-dom";

export const AdminDashboard: MenuProps["items"] = [
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        Energy Performnace
      </div>
    ),
    key: "/Performance", //key name should be uniform
    link: "/energyPerformance",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("DeviceInfo")}
      </div>
    ),
    key: "/deviceinfo", //key name should be uniform
    link: "/deviceinfo",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>See In Map</div>
    ),
    key: "/map", //key name should be uniform
    link: "/map",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>Work Order</div>
    ),
    key: "/WorkOrder", //key name should be uniform
    link: "/workorder",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        Registered Companies
      </div>
    ),
    key: "/CompanyList", //key name should be uniform
    link: "/companylist",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        Registered Users
      </div>
    ),
    key: "/UserList", //key name should be uniform
    link: "/userlist",
  },

  {
    label: <div style={{ fontSize: "14px", fontWeight: "bold" }}>Settings</div>,
    key: "/settings", //key name should be uniform
    link: "/settings",
  },
].map((item, index) => ({
  key: String(index + 1),
  label: item.link ? (
    <NavLink style={{ textDecoration: "none" }} to={item.link}>
      {item.label}
    </NavLink>
  ) : (
    item.label
  ),
}));
