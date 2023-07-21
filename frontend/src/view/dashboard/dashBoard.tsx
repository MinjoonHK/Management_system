import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Dropdown, Space } from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import EnergyPerformance from "../../components/energyPerformance";
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
import WorkOrderDetail from "../../components/workOrderDetail";
import GanttChart from "../../components/userPage/ganttChart/userGanttChart";
import TimeSheet from "../../components/userPage/TimeSheet/userTimeSheet";
import { t } from "i18next";
import UserContact from "../../components/userPage/userContatctList";
import BudgetManagement from "../../components/userPage/userBudget";
import MaterialInfo from "../../components/userPage/userMaterialInfo";
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
    const token = localStorage.getItem("jwt");
    const decoded: decodedToken = jwtDecode(token);
    const hour = new Date().getHours();
    const currentTime: number = Date.now();
    const expirationTime: number = new Date(decoded.exp * 1000).getTime();
    if (currentTime > expirationTime) {
      navigate("/login");
      setTimeout(() => logout(), 100);
    }
    if (token) {
      const greetingName = decoded.Name;
      setFirstName(greetingName);
      setUserRole(decoded.Role);
    }
    if (hour < 12) {
      setGreeting(t("GoodMorning"));
    } else if (hour < 18) {
      setGreeting(t("GoodAfterNoon"));
    } else {
      setGreeting(t("GoodEvening"));
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
            defaultSelectedKeys={["/ganttChart"]}
            onClick={({ item, key, keyPath, domEvent }) => {
              // console.log(key, AdminDashboard[key]);
              // localStorage.setItem(
              //   "lastPage",
              //   AdminDashboard[key].label.props.to
              // );
            }}
            items={AdminDashboard}
          />
        )}
        {userRole === "User" && (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/ganttChart"]}
            onClick={({ item, key, keyPath, domEvent }) => {
              // console.log(key, UserDashboard[key]);
              // localStorage.setItem(
              //   "lastPage",
              //   UserDashboard[key].label.props.to
              // );
            }}
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
                {greeting}
              </span>

              <Dropdown menu={{ items: DashboardDropdown }} trigger={["click"]}>
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
              background: colorBgContainer,
            }}
          >
            {userRole == "Admin" && (
              <Routes>
                <Route
                  path="/dashboard"
                  element={<EnergyPerformance />}
                ></Route>
                <Route
                  path="/energyPerformance"
                  element={<EnergyPerformance />}
                ></Route>
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
                <Route path="/dashboard" element={<GanttChart />}></Route>
                <Route
                  path="/userenergyperformance"
                  element={<UserEnergyPerformance />}
                ></Route>
                <Route path="/workorder" element={<WorkOrder />}></Route>
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
                  path="/admininformation"
                  element={<AdminProfile />}
                ></Route>
                <Route path="/ganttchart" element={<GanttChart />}></Route>
                <Route path="/contact" element={<UserContact />}></Route>
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
