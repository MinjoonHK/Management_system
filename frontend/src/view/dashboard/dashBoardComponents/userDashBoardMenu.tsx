import { MenuProps } from "antd";
import { t } from "i18next";
import { NavLink } from "react-router-dom";

export const UserDashboard: MenuProps["items"] = [
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("GanttChart")}
      </div>
    ),
    key: "/ganttChart", //key name should be uniform
    link: "/ganttchart",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("TimeSheet")}
      </div>
    ),
    key: "/TimeSheet",
    link: "/timesheet",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("BudgetManagement")}
      </div>
    ),
    key: "/Budget Management",
    link: "/budgetmanagement",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("MaterialInfo")}
      </div>
    ),
    key: "/MaterialInfo", //key name should be uniform
    link: "/materialinfo",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("WorkOrder")}
      </div>
    ),
    key: "/WorkOrder", //key name should be uniform
    link: "/workorder",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>{t("Contact")}</div>
    ),
    key: "/contact", //key name should be uniform
    link: "/contact",
  },
  {
    label: (
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
        {t("Settings")}
      </div>
    ),
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
