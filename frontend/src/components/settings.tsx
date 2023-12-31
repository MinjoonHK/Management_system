import React, { useContext } from "react";
import { I18nContext } from "../language/i18n";
import { Button, Switch } from "antd";
import { useTranslation } from "react-i18next";

function Settings() {
  const { t } = useTranslation();
  const i18n = React.useContext(I18nContext);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change language Globally
    window.location.reload();
  };

  return (
    <div
      style={{
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 25,
        fontSize: "16.5px ",
      }}
    >
      <div>
        <span style={{ fontWeight: "bold" }}>{t("languageLabel")}:</span>
        <span
          style={{
            marginLeft: "2%",
          }}
        >
          <Button onClick={() => changeLanguage("en")}>English</Button>
          <Button onClick={() => changeLanguage("ko")}>한국어</Button>
          <Button onClick={() => changeLanguage("cn")}>中文（简体）</Button>
          <Button onClick={() => changeLanguage("tcn")}>中文（繁體)</Button>
        </span>
      </div>
    </div>
  );
}

export default Settings;
