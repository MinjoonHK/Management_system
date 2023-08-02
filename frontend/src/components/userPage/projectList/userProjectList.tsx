import { Button, Card, Col, Descriptions, Popover, Row } from "antd";
import { useEffect, useState } from "react";
import AddModal from "./projectAddModal";
import axios from "axios";
import "../../../assets/project/project-override.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import {
  DeleteOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../../../assets/project/projectAction.css";
import DeleteModal from "./deleteModal";
import AddGuestModal from "./addGuestModal";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { t } from "i18next";
import MemberListModal from "./memberListModal";

function UserProject() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUserListModal, setOpenUserListModal] = useState(false);
  const [openAddGuestModal, setOpenAddGuestModal] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState();

  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard/projectList");
      setProjectList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const projectCalendarActions = (e: any) => {
    const url = `/projectDetail`;
    return (
      <div>
        <div
          className="projectAction"
          onClick={() => {
            setSelectedProject(e);
            setOpenAddGuestModal(true);
          }}
        >
          <UserAddOutlined /> {t("AddGuest")}
        </div>
        <Link to={url} style={{ textDecoration: "none", color: "black" }}>
          <div className="projectAction">
            <InfoCircleOutlined /> {t("ProjectDetail")}
          </div>
        </Link>
        <div
          className="projectAction"
          onClick={() => {
            setSelectedProject(e);
            setOpenUserListModal(true);
          }}
        >
          <UserOutlined /> {t("MemberList")}
        </div>
        <div
          className="projectAction deleteProject"
          onClick={() => {
            setSelectedProject(e);
            setOpenDeleteModal(true);
          }}
        >
          <DeleteOutlined />
          {t("DeleteSelectedProject")}
        </div>
      </div>
    );
  };
  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button
          style={{ fontWeight: "bold", fontSize: "14px", marginRight: "0.5%" }}
          onClick={() => setOpenAddModal(true)}
        >
          <PlusOutlined />
        </Button>
      </div>
      {projectList && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row>
            {projectList.map((e) => (
              <Col key={`prj` + e.ID} style={{ padding: "8px 8px 0 8px" }}>
                <Card
                  style={{
                    border: "1px solid #D3D3D3",
                    marginBottom: 20,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                  title={
                    <>
                      <div
                        style={{
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Link to={`/projectdetail/${e.ID}`}>
                          <span
                            onClick={() => {
                              setSelectedProject(e);
                              console.log(e);
                            }}
                            style={{ fontSize: "20px" }}
                          >
                            {e.ProjectName}
                          </span>
                        </Link>
                        <span>
                          <Popover
                            key={e.ID}
                            placement="bottom"
                            title={
                              <div style={{ fontSize: "20px" }}>
                                {t("Actions")}
                              </div>
                            }
                            trigger={"click"}
                            content={projectCalendarActions(e)}
                          >
                            <FontAwesomeIcon
                              icon={faEllipsis}
                              style={{ cursor: "pointer" }}
                            />
                          </Popover>
                        </span>
                      </div>
                    </>
                  }
                >
                  <Row
                    style={{
                      textAlign: "left",
                    }}
                  >
                    <Col span={24}>
                      <Descriptions
                        key={e.ID}
                        layout="vertical"
                        column={5}
                        bordered={false}
                        title={t("GeneralInfo")}
                      >
                        <Descriptions.Item label={t("ProjectOwner")}>
                          {e.FirstName}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Status")}>
                          {e.Status}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("StartDate")}>
                          {dayjs(e.Start).format("YYYY-MM-DD")}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("DueDate")}>
                          {dayjs(e.End).format("YYYY-MM-DD")}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
      <AddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onChange={fetchData}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        selectedProject={selectedProject}
        onChange={fetchData}
      />
      <AddGuestModal
        open={openAddGuestModal}
        onClose={() => {
          setOpenAddGuestModal(false);
        }}
        selectedProject={selectedProject}
      />
      <MemberListModal
        open={openUserListModal}
        onClose={() => {
          setOpenUserListModal(false);
        }}
        selectedProject={selectedProject}
      />
    </div>
  );
}

export default UserProject;
