import { MenuProps } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nContext } from "../language/i18n";

const { t } = useTranslation();
const i18n = React.useContext(I18nContext);
const [currentLanguage, setCurrentLanguage] = useState("Language");

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng); // Change language Globally
};

export const items: MenuProps["items"] = [
  {
    label: "English",
    key: "Day",
  },
  {
    label: "한국어",
    key: "Week",
  },
  {
    label: "中文（简体）",
    key: "Month",
  },
];
