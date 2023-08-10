import { MenuProps } from "antd";
import { t } from "i18next";
export const items: MenuProps["items"] = [
  {
    label: <div>{t("Day")}</div>,
    key: "Day",
  },
  {
    label: <div>{t("Week")}</div>,
    key: "Week",
  },
  {
    label: <div>{t("Month")}</div>,
    key: "Month",
  },
  {
    label: <div>{t("Year")}</div>,
    key: "Year",
  },
];
