import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Dropdown, Space } from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CompanyList from "../../components/companyList";
import AddCompany from "../../components/companyAdd";
import AdminProfile from "../../components/adminProfile";
import jwtDecode from "jwt-decode";
import WorkOrder from "../../components/workOrder";
import AddWorkOrder from "../../components/workOrderAdd";
import UserList from "../../components/userList";
import Settings from "../../components/settings";
import DeviceInfo from "../../components/deviceInfo";
import AddDevice from "../../components/deviceAdd";
import UserEnergyPerformance from "../../components/userPage/userEnergyPerformance";
import { AdminDashboard } from "./dashBoardComponents/adminDashBoardMenu";
import { DashboardDropdown } from "./dashBoardComponents/dashBoardDropDown";
import { UserDashboard } from "./dashBoardComponents/userDashBoardMenu";
import { WorkOrderDetail } from "../../components/workOrderDetail";
import TimeSheet from "../../components/userPage/TimeSheet/userTimeSheet";
import { t } from "i18next";
import UserProject from "../../components/userPage/projectList/userProjectList";
import BudgetManagement from "../../components/userPage/userBudget";
import MaterialInfo from "../../components/userPage/userMaterialInfo";
import UserInformation from "../../components/userProfile";
import { ProjectDetail } from "../../components/userPage/projectList/projectDetail";
const { Header, Content, Footer, Sider } = Layout;

function logout() {
  localStorage.clear();
}

export interface decodedToken {
  ID: number;
  Email: string;
  Name: string;
  Role: string;
  iat: number;
  exp: number;
}

const Dashboard: React.FC = () => {
  const [greeting, setGreeting] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const Location = useLocation();
  const [userRole, setUserRole] = useState("User");
  useEffect(() => {
    if (Location.pathname != "" && Location.pathname != "/") {
      localStorage.setItem("lastPage", Location.pathname);
    }
  }, [Location]);
  useEffect(() => {
    let lastPage = localStorage.getItem("lastPage");
    if (lastPage && lastPage != "") {
      navigate(lastPage);
    }
  }, []);
  useEffect(() => {
    const getJwt = localStorage.getItem("decoded_jwt");
    const decoded: decodedToken = JSON.parse(getJwt);
    const hour = new Date().getHours();
    const currentTime: number = Date.now();
    if (decoded) {
      const expirationTime: number = new Date(decoded.exp * 1000).getTime();
      if (currentTime > expirationTime) {
        navigate("/login");
        setTimeout(() => logout(), 100);
      }
      if (getJwt) {
        const greetingName = decoded.Name;
        setFirstName(greetingName);
        setUserRole(decoded.Role);
      }
    }
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        style={{ minHeight: "100vh" }}
      >
        <div
          style={{
            color: "white",
            margin: "20px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          {t("Navigator")}
        </div>
        {userRole === "Admin" && (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/Project"]}
            items={AdminDashboard}
          />
        )}
        {userRole === "User" && (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/Project"]}
            items={UserDashboard}
          />
        )}
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            padding: 0,
            background: colorBgContainer,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>

          <span
            style={{
              textAlign: "center",
            }}
          >
            <span
              style={{
                marginRight: "20px",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  marginRight: "16px",
                }}
              >
                <BellOutlined />
                {greeting}
              </span>

              <Dropdown
                menu={{ items: DashboardDropdown(userRole) }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space style={{ color: "black", fontSize: "18px" }}>
                    {firstName ? <>{firstName}</> : null}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </span>
          </span>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0", //margin between header and body content
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 20,
              textAlign: "center",
            }}
          >
            {userRole == "Admin" && (
              <Routes>
                <Route path="/workorder" element={<WorkOrder />}></Route>
                <Route path="/settings" element={<Settings />}></Route>
                <Route path="/companylist" element={<CompanyList />}></Route>
                <Route path="/userlist" element={<UserList />}></Route>

                <Route path="/deviceinfo" element={<DeviceInfo />}></Route>
                <Route path="/addcompany" element={<AddCompany />}></Route>
                <Route path="/addDevice" element={<AddDevice />}></Route>
                <Route path="/addworkorder" element={<AddWorkOrder />}></Route>
                <Route
                  path="/admininformation"
                  element={<AdminProfile />}
                ></Route>
                <Route
                  path="/workorderdetail"
                  element={<WorkOrderDetail />}
                ></Route>
              </Routes>
            )}
            {userRole == "User" && (
              <Routes>
                <Route
                  path="/userenergyperformance"
                  element={<UserEnergyPerformance />}
                ></Route>
                <Route path="/workorder" element={<WorkOrder />}></Route>
                <Route
                  path="/projectdetail/:selectedProject"
                  element={<ProjectDetail />}
                ></Route>
                <Route
                  path="/budgetmanagement"
                  element={<BudgetManagement />}
                ></Route>
                <Route path="/settings" element={<Settings />}></Route>
                <Route path="/companylist" element={<CompanyList />}></Route>
                <Route path="/userlist" element={<UserList />}></Route>
                <Route path="/materialinfo" element={<MaterialInfo />}></Route>
                <Route path="/addcompany" element={<AddCompany />}></Route>
                <Route path="/addDevice" element={<AddDevice />}></Route>
                <Route path="/addworkorder" element={<AddWorkOrder />}></Route>
                <Route
                  path="/workorderdetail"
                  element={<WorkOrderDetail />}
                ></Route>
                <Route path="/project" element={<UserProject />}></Route>
                <Route
                  path="/userinformation"
                  element={<UserInformation />}
                ></Route>
                <Route path="/timesheet" element={<TimeSheet />}></Route>
              </Routes>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>©KELLON 2023</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
