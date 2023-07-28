import { Card, Tabs } from "antd";
import GanttChart from "./ganttChart/userGanttChart";

export const ProjectDetail = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="WrokingSchedule"
        type="card"
        items={[
          {
            label: <div style={{ color: "black" }}>Working Schedule</div>,
            key: "WrokingSchedule",
            children: (
              <Card
                title={
                  <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    Working Schedule
                  </div>
                }
                bordered={false}
                style={{
                  width: "100%",
                  border: "solid rgb(226, 226, 226) 1.5px",
                }}
              ></Card>
            ),
          },
          {
            label: <div style={{ color: "black" }}>Gantt Chart</div>,
            key: "GanttChart",
            children: <GanttChart />,
          },
          {
            label: <div style={{ color: "black" }}>Uploaded Documents</div>,
            key: "Uploaded Documnets",
            children: (
              <Card
                title={
                  <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    Uploaded Documents
                  </div>
                }
                bordered={false}
                style={{
                  width: "100%",
                  border: "solid rgb(226, 226, 226) 1.5px",
                }}
              ></Card>
            ),
          },
        ]}
      />
    </div>
  );
};
