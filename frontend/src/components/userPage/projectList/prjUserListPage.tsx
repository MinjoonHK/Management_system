import { Button, Card, Divider, List, MenuProps } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import ReactAvatar from "react-avatar";
import { useEffect, useState } from "react";
import AddUserModal from "./prjAddUserModal";
import jwtDecode from "jwt-decode";
import PrjUserChangeRole from "./prjUserChangeRole";
import PrjUserDeleteModal from "./prjUserDeleteModal";
import { t } from "i18next";

interface successResponse {
  data: {
    status: true;
    message: string;
    result: [
      {
        Joined_User_Email: string;
        Created_At: Date;
        Role: string;
        FirstName: string;
        LastName: string;
      }
    ];
  };
}

interface userToken {
  Email: string;
  ID: number;
  Role: string;
  exp: number;
  iat: number;
}

const userToken: userToken = localStorage.getItem("jwt")
  ? jwtDecode(localStorage.getItem("jwt"))
  : null;

export const UserListPage = ({ selectedProject }) => {
  const [users, setUsers] = useState([]);
  const [openAddUserModal, setOPenAddUserModal] = useState(false);
  const [openChangeUserRole, setOpenChangeUserRole] = useState(false);
  const [openUserDelete, setOpenUserDelete] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [memberList, setMemberList] = useState([]);
  const [existingUsers, setExistingUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response: successResponse = await axios.get(
        "dashboard/getProjectPeople",
        {
          params: { ProjectID: selectedProject },
        }
      );
      if (response.data.status === true) {
        setUsers(response.data.result);
        const ogMembers = response.data.result.filter((users) => {
          return users.FirstName != null;
        });
        setExistingUsers(ogMembers);
        const invitedMembers = response.data.result.filter((users) => {
          return users.FirstName === null;
        });
        setInvitedUsers(invitedMembers);
        const memberFilter = response.data.result.filter((users) => {
          return users.Role === "Member" || users.Role === "Guest";
        });
        if (memberFilter) {
          setMemberList(memberFilter);
        }
        const creatorFilter = response.data.result.filter((users) => {
          return users.Role === "Creator";
        });
        const creatorChecker = creatorFilter.find(
          (m) => m.Joined_User_Email == userToken.Email
        );
        if (creatorChecker !== undefined) {
          setIsCreator(true);
        }
        const managerFilter = response.data.result.filter((users) => {
          return users.Role === "Manager";
        });
        const managerChecker = managerFilter.find(
          (m) => m.Joined_User_Email == userToken.Email
        );
        if (managerChecker !== undefined) {
          setIsManager(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(isManager);
  return (
    <div>
      {users && (
        <Card>
          <div style={{ textAlign: "left" }}>
            {(isManager === true || isCreator === true) && (
              <Button
                onClick={() => {
                  setOPenAddUserModal(true);
                }}
              >
                {t("InviteMember")}
              </Button>
            )}
          </div>
          <Divider orientation="left">{t("JoinedUsers")}</Divider>
          <List
            itemLayout="horizontal"
            bordered
            dataSource={existingUsers}
            style={{
              height: "40vh",
              marginTop: "1%",

              backgroundColor: "white",
              overflow: "hidden",
              overflowY: "scroll",
            }}
            renderItem={(item, index) => (
              <div style={{ marginLeft: "3%" }}>
                <List.Item style={{ width: "100%" }}>
                  <List.Item.Meta
                    style={{ textAlign: "left", width: "200px" }}
                    avatar={
                      <ReactAvatar
                        round
                        size="35px"
                        name={item.FirstName + " " + item.LastName}
                        maxInitials={2}
                      />
                    }
                    title={
                      item.FirstName && item.LastName
                        ? item.FirstName + " " + item.LastName
                        : `Invited User`
                    }
                    description={
                      <div style={{ wordWrap: "break-word" }}>
                        {item.Joined_User_Email}
                      </div>
                    }
                  />

                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={"Last Login Time"}
                    description={dayjs(item.LastLoginTime).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                  />
                  <List.Item.Meta
                    title={"Joined Date"}
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    description={dayjs(item.Created_At).format("YYYY-MM-DD")}
                  />
                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={"Role"}
                    description={item.Role}
                  />
                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={"Status"}
                    description={item.Status}
                  />

                  {(isManager === true || isCreator === true) && (
                    <ul style={{ padding: 0 }}>
                      {isCreator === true ? (
                        <div>
                          {item.Role === "Manager" ? (
                            <div>
                              <List.Item
                                style={{ textAlign: "left" }}
                                actions={[
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenChangeUserRole(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("ChangeRole")}
                                  </a>,
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenUserDelete(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("Delete")}
                                  </a>,
                                ]}
                              />
                            </div>
                          ) : (
                            <div>
                              <List.Item
                                style={{ textAlign: "left" }}
                                actions={[
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenChangeUserRole(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("ChangeRole")}
                                  </a>,
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenUserDelete(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("Delete")}
                                  </a>,
                                ]}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {item.Role === "Manager" ? (
                            <div>
                              <List.Item
                                style={{ textAlign: "left" }}
                                actions={[
                                  <a
                                    onClick={() => {
                                      return false;
                                    }}
                                    style={{
                                      color: "rgb(33,33,33)",
                                      fontSize: "15px",
                                      textDecoration: "line-through",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t("ChangeRole")}
                                  </a>,
                                  <a
                                    onClick={() => {
                                      return false;
                                    }}
                                    style={{
                                      color: "rgb(33,33,33)",
                                      fontSize: "15px",
                                      textDecoration: "line-through",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t("Delete")}
                                  </a>,
                                ]}
                              />
                            </div>
                          ) : item.Role === "Member" ||
                            item.Role === "Guest" ? (
                            <div>
                              <List.Item
                                style={{ textAlign: "left" }}
                                actions={[
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenChangeUserRole(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("ChangeRole")}
                                  </a>,
                                  <a
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setOpenUserDelete(true);
                                    }}
                                    style={{ fontSize: "15px" }}
                                  >
                                    {t("Delete")}
                                  </a>,
                                ]}
                              />
                            </div>
                          ) : (
                            <div>
                              <List.Item
                                style={{ textAlign: "left" }}
                                actions={[
                                  <a
                                    onClick={() => {
                                      return false;
                                    }}
                                    style={{
                                      color: "rgb(33,33,33)",
                                      fontSize: "15px",
                                      textDecoration: "line-through",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t("ChangeRole")}
                                  </a>,
                                  <a
                                    onClick={() => {
                                      return false;
                                    }}
                                    style={{
                                      color: "rgb(33,33,33)",
                                      fontSize: "15px",
                                      textDecoration: "line-through",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t("Delete")}
                                  </a>,
                                ]}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </ul>
                  )}
                </List.Item>
              </div>
            )}
          />
          <Divider orientation="left">{t("InvitedUsers")}</Divider>
          <List
            itemLayout="horizontal"
            bordered
            dataSource={invitedUsers}
            style={{
              height: "40vh",
              marginTop: "1%",

              backgroundColor: "white",
              overflow: "hidden",
              overflowY: "scroll",
            }}
            renderItem={(item, index) => (
              <div style={{ marginLeft: "3%" }}>
                <List.Item style={{ width: "100%" }}>
                  <List.Item.Meta
                    style={{ textAlign: "left", width: "200px" }}
                    avatar={
                      <ReactAvatar
                        round
                        size="35px"
                        name={item.FirstName + " " + item.LastName}
                        maxInitials={2}
                      />
                    }
                    title={
                      item.FirstName && item.LastName
                        ? item.FirstName + " " + item.LastName
                        : `Invited User`
                    }
                    description={
                      <div style={{ wordWrap: "break-word" }}>
                        {item.Joined_User_Email}
                      </div>
                    }
                  />

                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={t("LastLoginTime")}
                    description={dayjs(item.LastLoginTime).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                  />
                  <List.Item.Meta
                    title={t("JoinedDate")}
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    description={dayjs(item.Created_At).format("YYYY-MM-DD")}
                  />
                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={t("Role")}
                    description={item.Role}
                  />
                  <List.Item.Meta
                    style={{ textAlign: "left", marginLeft: "5%" }}
                    title={t("Status")}
                    description={item.Status}
                  />
                  {isManager === true && (
                    <ul style={{ padding: 0 }}>
                      <List.Item
                        style={{ textAlign: "left" }}
                        actions={[
                          <a
                            onClick={() => {
                              setSelectedUser(item);
                              setOpenChangeUserRole(true);
                            }}
                            style={{ fontSize: "15px" }}
                          >
                            {t("ChangeRole")}
                          </a>,
                          <a
                            onClick={() => {
                              setSelectedUser(item);
                              setOpenUserDelete(true);
                            }}
                            style={{ fontSize: "15px" }}
                          >
                            {t("Delete")}
                          </a>,
                        ]}
                      />
                    </ul>
                  )}
                </List.Item>
              </div>
            )}
          />
        </Card>
      )}

      <AddUserModal
        open={openAddUserModal}
        onChange={() => {
          fetchData();
        }}
        onClose={() => {
          setOPenAddUserModal(false);
        }}
        selectedProject={selectedProject}
      />
      <PrjUserChangeRole
        open={openChangeUserRole}
        onClose={() => {
          setOpenChangeUserRole(false);
        }}
        selectedProject={selectedProject}
        onChange={() => {
          fetchData();
        }}
        selectedMember={selectedUser}
      />
      <PrjUserDeleteModal
        open={openUserDelete}
        onClose={() => {
          setOpenUserDelete(false);
        }}
        selectedUser={selectedUser}
        selectedProject={selectedProject}
        onChange={() => {
          fetchData();
        }}
      />
    </div>
  );
};
