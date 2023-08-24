import {
  Button,
  Descriptions,
  Divider,
  List,
  Modal,
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";

const { Dragger } = Upload;

interface userToken {
  Email: string;
  ID?: Number;
  Role?: String;
  exp?: number;
  iat?: number;
}

export default function DocumentUploadModal({
  open,
  onClose,
  onChange,
  selectedProject,
  selectedTask,
}) {
  const [defaultList, setDefaultList] = useState([]);
  const [manager, setManager] = useState(null);
  const getJwt = localStorage.getItem("decoded_jwt");
  const userToken: userToken = JSON.parse(getJwt);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    async customRequest(props) {
      const form = new FormData();
      form.append("file", props.file);
      form.append("selectedProject", selectedProject);
      form.append("taskID", selectedTask.ID);
      const res = await axios.post("/dashboard/upload/documents", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          props.onProgress(progressEvent);
        },
      });
      if (res.data.status === "success") {
        onChange();
        fetchUploadTask();

        props.onSuccess("");
      } else if (res.data.status === "error") {
        message.error("file upload failed");
      }
      return;
    },
  };

  const fetchUploadTask = async () => {
    if (selectedTask) {
      const res = await axios.get("/dashboard/upload/uploadedTasks", {
        params: { TaskID: selectedTask.ID, projectID: selectedProject },
      });
      if (res.data.status === "true") {
        setDefaultList(res.data.result);
      } else {
        console.log("error");
      }
    }
  };

  const fetchTaskPeople = async () => {
    if (selectedTask) {
      const res = await axios.get("/dashboard/getTaskPeople", {
        params: { TaskID: selectedTask.ID },
      });
      if (res.data.status === "success") {
        const filteredData = res.data.result.filter(
          (e) => e.Role === "Manager"
        );
        setManager(filteredData[0]);
      } else {
        console.log("error");
      }
    }
  };

  useEffect(() => {
    if (selectedTask) {
      fetchUploadTask();
      fetchTaskPeople();
    }
  }, [selectedTask]);

  const userMode = localStorage.getItem("Mode");
  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={false}
      width={"70%"}
      bodyStyle={{ height: "100%" }}
      keyboard={true}
      footer={[
        <Button key={"document-submission-modal-close-btn"} onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      {userMode === "Guest" || (
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Drag and Drop file here</p>
          <p>OR</p>
          <p
            style={{ textDecoration: "underline" }}
            className="ant-upload-text"
          >
            Choose from computer
          </p>
        </Dragger>
      )}
      <Divider orientation="left">Recent Uploads</Divider>
      <List
        size="small"
        bordered
        style={{
          marginTop: "1%",
          height: "300px",
          overflow: "hidden",
          overflowY: "scroll",
        }}
        dataSource={defaultList}
        renderItem={(item) => (
          <>
            {userMode === "Guest" ? (
              <div>
                {item.Status === "Approved" && (
                  <List.Item
                    style={{ textAlign: "center" }}
                    key={`taskitem` + item.ID}
                    actions={[
                      <a
                        download={true}
                        href={`${
                          axios.defaults.baseURL
                        }/download?token=${encodeURIComponent(
                          localStorage.getItem("jwt")
                        )}&fileId=${
                          item.ID
                        }&projectID=${selectedProject} &taskID=${
                          selectedTask.ID
                        }`}
                        className="btn"
                        style={{
                          color: "rgb(45,68,134)",
                          textAlign: "left",
                        }}
                      >
                        <Button>download</Button>
                      </a>,
                    ]}
                  >
                    <Descriptions layout="vertical" column={5}>
                      <Descriptions.Item label="Upload Date">
                        {item.UploadDate.substring(0, 10)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Uploader">
                        {item.FirstName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        {item.Status}
                      </Descriptions.Item>

                      <Descriptions.Item label="File Name">
                        <div
                          style={{
                            textOverflow: "ellipsis",
                            textAlign: "left",
                            overflowX: "hidden",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            width: "100px",
                          }}
                        >
                          {item.Name}
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              </div>
            ) : (
              <>
                <List.Item
                  style={{ textAlign: "center" }}
                  key={`taskitem` + item.ID}
                  actions={[
                    <a
                      download={true}
                      href={`${
                        axios.defaults.baseURL
                      }/download?token=${encodeURIComponent(
                        localStorage.getItem("jwt")
                      )}&fileId=${
                        item.ID
                      }&projectID=${selectedProject} &taskID=${
                        selectedTask.ID
                      }`}
                      className="btn"
                      style={{
                        color: "rgb(45,68,134)",
                        textDecoration: "underline",
                      }}
                    >
                      <Button>download</Button>
                    </a>,
                  ]}
                >
                  <Descriptions layout="vertical" column={5}>
                    <Descriptions.Item label="Upload Date">
                      {item.UploadDate.substring(0, 10)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Uploader">
                      {item.FirstName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      {item.Status}
                    </Descriptions.Item>
                    {userMode === "Manager" && (
                      <Descriptions.Item label="Approval">
                        <div style={{ textAlign: "left", width: "100%" }}>
                          <Button
                            onClick={async () => {
                              const res = await axios.post(
                                "/dashboard/upload/updateApproved",
                                {
                                  ItemID: item.ID,
                                }
                              );
                              if (res.data.status === "success") {
                                fetchUploadTask();
                              }
                            }}
                            size="small"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </Button>{" "}
                          |{" "}
                          <Button
                            onClick={async () => {
                              const res = await axios.post(
                                "/dashboard/upload/updateReject",
                                {
                                  ItemID: item.ID,
                                }
                              );
                              if (res.data.status === "success") {
                                fetchUploadTask();
                              }
                            }}
                            size="small"
                          >
                            <FontAwesomeIcon icon={faX} />
                          </Button>
                        </div>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="File Name">
                      <div
                        style={{
                          textOverflow: "ellipsis",
                          textAlign: "left",
                          overflowX: "hidden",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                          width: "100px",
                        }}
                      >
                        {item.Name}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              </>
            )}
          </>
        )}
      />
    </Modal>
  );
}
