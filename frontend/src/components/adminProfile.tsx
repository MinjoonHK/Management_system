import { Card } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminInformation: React.FC = () => {
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
      }}
    >
      <Card
        title={<div style={{ fontSize: "25px" }}>User Information</div>}
        bordered={false}
        style={{
          width: "100%",
          border: "solid rgb(226, 226, 226) 1.5px",
        }}
      >
        <div>
          {userInfo ? (
            <>
              <div>
                <span>
                  <p>
                    First Name: {userInfo.FirstName} &nbsp; Last Name:{" "}
                    {userInfo.LastName}
                  </p>
                </span>
              </div>
              <p></p>
              <p>{userInfo.Role}</p>
              <p>{userInfo.Email}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminInformation;
