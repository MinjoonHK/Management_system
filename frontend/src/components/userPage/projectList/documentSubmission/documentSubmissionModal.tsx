import { Button, Card, Divider, Modal, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Dragger } = Upload;

export default function DocumentSubmission({
  open,
  onClose,
  onChange,
  selectedProject,
}) {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    async customRequest(props) {
      const form = new FormData();
      form.append("file", props.file);
      form.append("selectedProject", selectedProject);
      const res = await axios.post("/dashboard/upload/documents", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.status === "success") {
        onChange();
        message.success(`file uploaded successfully.`);
      } else if (res.data.status === "error") {
        message.error("file upload failed");
      }
      return;
    },

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Modal
      centered
      open={open}
      okButtonProps={{ style: { backgroundColor: "rgb(45,68,134)" } }}
      closable={false}
      onCancel={onClose}
      width={500}
      onOk={onClose}
      bodyStyle={{ height: "100%" }}
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
    </Modal>
  );
}
