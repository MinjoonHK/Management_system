import { Button, Card, Divider, Popover } from "antd";
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

function UserProject() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
        <div
          className="projectAction"
          onClick={() => {
            console.log("Clicked");
          }}
        >
          <InfoCircleOutlined /> Project Detail
        </div>
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
      <Divider
        orientation="left"
        style={{ fontSize: "22px", border: "#D3D3D3" }}
      >
        Project List
      </Divider>
      {projectList && (
        <div>
          {projectList.map((e) => (
            <Card
              key={e.ID}
              style={{ margin: "2%", border: "1px solid #D3D3D3" }}
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
                    {/* Need to fix */}
                    <Popover
                      key={e.ID}
                      placement="bottom"
                      title={<div style={{ fontSize: "20px" }}>Actions</div>}
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
              <div style={{ textAlign: "left" }}>Example content</div>
            </Card>
          ))}
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
