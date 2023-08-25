import { Card, Col, Divider, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { t } from "i18next";

const UserInformation: React.FC = () => {
  const [userInfo, setUserInfo] = useState(undefined);

  const getUserInfo = async (token: any) => {
    try {
      const response = await axios.get("/dashboard/userinformation", {
        params: { Token: token },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    getUserInfo(token);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Card
        title={
          <div style={{ fontSize: "25px", textAlign: "left" }}>
            {t("BasicInformation")}
          </div>
        }
        bordered={false}
        style={{
          width: "100%",
          border: "solid rgb(226, 226, 226) 1.5px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          {userInfo ? (
            <>
              <div>
                <Row>
                  <Col flex={"50%"}>{t("Name")}</Col>
                  <Col flex="auto">{`${userInfo.FirstName} ${userInfo.LastName}`}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>{t("Role")}</Col>
                  <Col flex="auto">{userInfo.Role}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>{t("Company")}</Col>
                  <Col flex="auto">{userInfo.Name}</Col>
                </Row>
                <Divider></Divider>
              </div>
            </>
          ) : (
            <p>{t("Loading...")}</p>
          )}
        </div>
      </Card>
      <Card
        title={
          <div style={{ fontSize: "25px", textAlign: "left" }}>
            {t("ContactInformation")}
          </div>
        }
        bordered={false}
        style={{
          width: "100%",
          border: "solid rgb(226, 226, 226) 1.5px",
          marginTop: "2%",
        }}
      >
        <div style={{ textAlign: "left" }}>
          {userInfo ? (
            <>
              <div>
                <Row>
                  <Col flex={"50%"}>{t("Email")}</Col>
                  <Col flex="auto">{userInfo.Email}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>{t("PhoneNumber")}</Col>
                  <Col flex="auto">{userInfo.PhoneNumber}</Col>
                </Row>
                <Divider></Divider>
              </div>
            </>
          ) : (
            <p>{t("Loading...")}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserInformation;
