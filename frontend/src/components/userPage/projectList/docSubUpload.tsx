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

const { Dragger } = Upload;

export default function DocumentUploadModal({
  open,
  onClose,
  onChange,
  selectedProject,
  selectedTask,
}) {
  const [defaultList, setDefaultList] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    async customRequest(props) {
      console.log(props);
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
        fetchData();
        props.onSuccess("");
      } else if (res.data.status === "error") {
        message.error("file upload failed");
      }
      return;
    },
  };
  const fetchData = async () => {
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

  useEffect(() => {
    if (selectedTask) {
      fetchData();
    }
  }, [selectedTask]);
  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={false}
      width={"70%"}
      bodyStyle={{ height: "100%" }}
      keyboard={true}
      footer={[<Button onClick={onClose}>Cancel</Button>]}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Drag and Drop file here</p>
        <p>OR</p>
        <p style={{ textDecoration: "underline" }} className="ant-upload-text">
          Choose from computer
        </p>
      </Dragger>
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
          <List.Item
            style={{ textAlign: "center" }}
            key={item.ID}
            actions={[
              <a
                download={true}
                href={`${
                  axios.defaults.baseURL
                }/download?token=${encodeURIComponent(
                  localStorage.getItem("jwt")
                )}&fileId=${item.ID}`}
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
            <div>
              <Descriptions layout="vertical" column={5}>
                <Descriptions.Item label="Upload Date">
                  {item.UploadDate.substring(0, 10)}
                </Descriptions.Item>
                <Descriptions.Item label="Uploader">
                  {item.FirstName}
                </Descriptions.Item>
                <Descriptions.Item label="Status">Pending</Descriptions.Item>
                <Descriptions.Item label="Approval">Hi</Descriptions.Item>
                <Descriptions.Item
                  style={{ overflowX: "hidden" }}
                  label="File Name"
                >
                  {item.Name}
                </Descriptions.Item>
              </Descriptions>
            </div>
            {/* <List.Item.Meta title={item.FirstName} description={item.Name} />
            <List.Item.Meta
              title={"Upload Date"}
              description={item.UploadDate.substring(0, 10)}
            />
            <List.Item.Meta title={"Status"} description={"Pending"} />
            <List.Item.Meta
              title={"Approval"}
              description={
                <div>
                  <Button style={{ padding: 0 }}>
                    <CheckOutlined style={{ padding: 0 }} />
                  </Button>
                  <Button style={{ padding: 0 }}>X</Button>
                </div>
              }
            /> */}
          </List.Item>
        )}
      />
    </Modal>
  );
}
