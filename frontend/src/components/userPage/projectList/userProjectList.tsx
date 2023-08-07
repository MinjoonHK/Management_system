import { Button, Row } from "antd";
import { useEffect, useState } from "react";
import AddModal from "./prjAddModal";
import axios from "axios";
import "../../../assets/project/project-override.css";
import { PlusOutlined } from "@ant-design/icons";
import "../../../assets/project/projectAction.css";
import DeleteModal from "./prjListDelModal";
import AddGuestModal from "./prjAddGuestModal";
import MemberListModal from "./memberListModal";
import { ProjectList } from "./prjProjectList";

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
              <ProjectList
                key={e.ID}
                e={e}
                onChange={(e) => {
                  setSelectedProject(e);
                }}
                changeGuestModal={() => {
                  setOpenAddGuestModal(true);
                }}
                ChangeDeleteModal={() => {
                  setOpenDeleteModal(true);
                }}
                ChangeUserListModal={() => {
                  setOpenUserListModal(true);
                }}
              />
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
