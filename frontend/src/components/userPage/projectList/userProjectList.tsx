import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popover,
  Row,
  Table,
} from "antd";
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
} from "@ant-design/icons";
import "../../../assets/project/projectAction.css";
import DeleteModal from "./deleteModal";
import AddGuestModal from "./addGuestModal";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function UserProject() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddGuestModal, setOpenAddGuestModal] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState();

  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard/projectList");
      console.log(res.data);
      setProjectList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const projectCalendarActions = (e: any) => {
    const url = `/projectDetail/${encodeURIComponent(e.ID)}`;
    return (
      <div>
        <div
          className="projectAction"
          onClick={() => {
            setSelectedProject(e);
            setOpenAddGuestModal(true);
          }}
        >
          <UserAddOutlined /> Add Guest
        </div>
        <Link to={url} style={{ textDecoration: "none", color: "black" }}>
          <div className="projectAction">
            <InfoCircleOutlined /> Project Detail
          </div>
        </Link>
        <div
          className="projectAction deleteProject"
          onClick={() => {
            setSelectedProject(e);
            setOpenDeleteModal(true);
          }}
        >
          <DeleteOutlined /> Delete Selected Project
        </div>
      </div>
    );
  };
  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button
          style={{ fontWeight: "bold", fontSize: "14px" }}
          onClick={() => setOpenAddModal(true)}
        >
          <PlusOutlined />
        </Button>
      </div>
      {/* <Divider
        orientation="left"
        style={{ fontSize: "22px", border: "#D3D3D3" }}
      >
        Project List
      </Divider> */}
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
                    <div
                      style={{
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{e.ProjectName}</span>
                      <span>
                        <Popover
                          key={e.ID}
                          placement="bottom"
                          title={
                            <div style={{ fontSize: "20px" }}>Actions</div>
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
                        title={"General Info"}
                      >
                        <Descriptions.Item label="Project Owner">
                          {e.FirstName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                          {e.Status}
                        </Descriptions.Item>
                        <Descriptions.Item label="Start Date">
                          {dayjs(e.Start).format("YYYY-MM-DD")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Due Date">
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
    </div>
  );
}

export default UserProject;
