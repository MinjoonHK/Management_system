import { Button, Card, Divider, Popover } from "antd";
import { useEffect, useState } from "react";
import AddModal from "./projectAddModal";
import axios from "axios";
import "../../../assets/project-override.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

function UserProject() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [projectList, setProjectList] = useState([]);

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

  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button
          style={{ fontWeight: "bold", fontSize: "14px" }}
          onClick={() => setOpenAddModal(true)}
        >
          +PROJECT
        </Button>
      </div>
      <Divider
        orientation="left"
        style={{ fontSize: "20px", border: "#D3D3D3" }}
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
                  <span>{e.ProjectName}</span>
                  <span>
                    <Popover
                      placement="bottom"
                      title={"Actions"}
                      trigger={"click"}
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
              Hello
            </Card>
          ))}
        </div>
      )}
      <AddModal open={openAddModal} onClose={() => setOpenAddModal(false)} />
    </div>
  );
}

export default UserProject;
