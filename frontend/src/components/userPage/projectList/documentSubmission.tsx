import { Button, Card, Descriptions } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentSubmissionModal } from "./documentSubmissionModal";

export const DocumentSubmissionPage = ({ selectedProject }) => {
  const [taskList, setTaskList] = useState([]);
  const [openAddDocumentSubmissionModal, setOpenAddDocumentSubmissionModal] =
    useState(false);
  console.log(taskList);
  const fetchData = async () => {
    try {
      const res = await axios.get("/dashboard/submissiontask", {
        params: { project_ID: selectedProject },
      });
      setTaskList(
        res.data.result.sort((a, b) => {
          return b.DueDate - a.DueDate;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <h2>Submission Tasks</h2>
        </span>
        <span>
          {/* <Link to={`/addprojecttask/${selectedProject}`}> */}
          <Button
            onClick={() => {
              setOpenAddDocumentSubmissionModal(true);
            }}
            style={{ marginTop: "15%" }}
            shape="round"
          >
            <PlusOutlined />
            <span style={{ fontSize: "15px" }}>Add Task</span>
          </Button>
          {/* </Link> */}
        </span>
      </div>
      {taskList.length > 0 ? (
        <div>
          {taskList.map((e) => (
            <Card
              style={{ marginBottom: "1%", height: "100%" }}
              bodyStyle={{ padding: "0 24px" }}
              key={e.ID}
              title={
                <h3 style={{ textAlign: "left" }}>
                  <Link to="/submissionpage">{e.Name}</Link>
                </h3>
              }
            >
              <Descriptions layout="vertical" bordered={false} column={5}>
                <Descriptions.Item label="Manager">
                  {e.Manager}
                </Descriptions.Item>
                <Descriptions.Item label="Status">{e.Status}</Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {e.CreateDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {e.DueDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item
                  style={{ textAlign: "center" }}
                  label="Drop Task"
                >
                  <Button>
                    <DeleteOutlined />
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </div>
      ) : (
        <Card title={<h2 style={{ textAlign: "left" }}>Welcome!</h2>}>
          <Link to={`/addprojecttask/${selectedProject}`}>
            <Button shape="round">
              <PlusOutlined />
              <span style={{ fontSize: "15px" }}>Add your first Task</span>
            </Button>
          </Link>
        </Card>
      )}
      <DocumentSubmissionModal
        open={openAddDocumentSubmissionModal}
        onClose={() => {
          setOpenAddDocumentSubmissionModal(false);
        }}
        onChange={() => {
          fetchData();
        }}
      />
    </div>
  );
};
