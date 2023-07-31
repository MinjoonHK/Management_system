import { Button, Card, Divider, Modal, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Dragger } = Upload;

export default function DocumentSubmission({ open, onClose }) {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    customRequest(props) {
      /*onProgress: (event: { percent: number }): void
onError: (event: Error, body?: Object): void
onSuccess: (body: Object): void
data: Object
filename: String
file: File
withCredentials: Boolean
action: String
headers: Object */
      const form = new FormData();
      form.append("file", props.file);

      axios
        .post("/upload/documents", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((d) => {
          alert("success");
        });
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
