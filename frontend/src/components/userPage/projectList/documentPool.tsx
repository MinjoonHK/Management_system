import { Button, Table } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import DocumentSubmissionModal from "./documentSubmission/documentSubmissionModal";
export const DocumentPool = ({ data, onChange, selectedProject }) => {
  const [openDocumentSubmissionModal, setOpenDocumentSubmissionModal] =
    useState(false);
  const FileColumns: ColumnsType = [
    {
      title: "File Name",
      dataIndex: "Name",
      align: "center",
    },
    {
      title: "Uploader",
      dataIndex: "FirstName",
      align: "center",
    },
    {
      title: "Uploaded Date",
      dataIndex: "UploadDate",
      align: "center",
    },
    {
      title: "File Size",
      dataIndex: "Size",
      align: "center",
    },
    {
      title: "Download",
      dataIndex: "Download",
      align: "center",
    },
    {
      title: "Download Logs",
      dataIndex: "DownloadLogs",
      align: "center",
      render: (text) => (
        <Button>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5%",
        }}
      >
        <span
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginLeft: "1%",
          }}
        >
          Uploaded Files
        </span>
        <span>
          <Button shape={"round"}>
            Upload Files
            <UploadOutlined
              onClick={() => setOpenDocumentSubmissionModal(true)}
            />
          </Button>
        </span>
      </div>
      {data && (
        <div>
          <Table dataSource={data} columns={FileColumns} />
        </div>
      )}
      <DocumentSubmissionModal
        open={openDocumentSubmissionModal}
        onClose={() => {
          setOpenDocumentSubmissionModal(false);
        }}
        onChange={() => {
          onChange();
        }}
        selectedProject={selectedProject}
      />
    </div>
  );
};
