import { Card, Col, Divider, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
            Basic Information
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
                  <Col flex={"50%"}>Name</Col>
                  <Col flex="auto">{`${userInfo.FirstName} ${userInfo.LastName}`}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>Role</Col>
                  <Col flex="auto">{userInfo.Role}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>Company</Col>
                  <Col flex="auto">{userInfo.Name}</Col>
                </Row>
                <Divider></Divider>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>
      <Card
        title={
          <div style={{ fontSize: "25px", textAlign: "left" }}>
            Contact Information
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
                  <Col flex={"50%"}>Email</Col>
                  <Col flex="auto">{userInfo.Email}</Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col flex={"50%"}>Phone Number</Col>
                  <Col flex="auto">{userInfo.PhoneNumber}</Col>
                </Row>
                <Divider></Divider>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserInformation;
