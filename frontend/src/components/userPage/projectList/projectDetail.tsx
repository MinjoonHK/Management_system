import { Button, Calendar, Card, Divider, List, Tabs, Upload } from "antd";
import GanttChart from "./ganttChart/userGanttChart";
import { UploadOutlined } from "@ant-design/icons";
import DocumentSubmission from "./documentSubmission/documentSubmissionModal";
import { useState } from "react";

export const ProjectDetail = () => {
  const [openDocumentSubmissionModal, setOpenDocumentSubmissionModal] =
    useState(false);

  const data = [
    <UploadOutlined />,
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires.",
  ];
  return (
    <div>
      <Tabs
        defaultActiveKey="WrokingSchedule"
        type="card"
        items={[
          {
            label: <div style={{ color: "black" }}>Working Schedule</div>,
            key: "WrokingSchedule",
            children: <Calendar />,
          },
          {
            label: <div style={{ color: "black" }}>Gantt Chart</div>,
            key: "GanttChart",
            children: <GanttChart />,
          },
          {
            label: <div style={{ color: "black" }}>Document Submission</div>,
            key: "Uploaded Documnets",
            children: (
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
                    <Button
                      shape={"round"}
                      onClick={() => {
                        setOpenDocumentSubmissionModal(true);
                      }}
                    >
                      Upload Files
                      <UploadOutlined />
                    </Button>
                  </span>
                </div>
                <Card bodyStyle={{ padding: "0 24px" }}>
                  <List
                    dataSource={data}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />
      <DocumentSubmission
        open={openDocumentSubmissionModal}
        onClose={() => {
          setOpenDocumentSubmissionModal(false);
        }}
      />
    </div>
  );
};
