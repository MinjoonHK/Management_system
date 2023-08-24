import React, { useState } from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button, Dropdown, MenuProps, Space, Switch, Modal } from "antd";
import { items } from "./ganttChartViewList";
import { DownOutlined } from "@ant-design/icons";
import AddScheduleModal from "./ganttChartModal";
import { t } from "i18next";

type ViewSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  projectList: string[];
  fetchSchdule: any;
  selectedProject: any;
};
export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  projectList,
  fetchSchdule,
  selectedProject,
}) => {
  const [CurrentView, setCurrentView] = useState("Change View");
  const [open, setOpen] = useState(false);
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onViewModeChange(e.key as ViewMode);
    setCurrentView(e.key as ViewMode);
  };
  const userMode = localStorage.getItem("Mode");
  const menuProps1 = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div style={{ marginBottom: "2%" }}>
      <div>
        {userMode === "Guest" || (
          <span style={{ marginRight: "1%" }}>
            <Button type="primary" onClick={() => setOpen(true)}>
              {t("AddSchedule")} +
            </Button>
          </span>
        )}

        <Dropdown menu={menuProps1}>
          <Button>
            <Space>
              {CurrentView}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <span>
          <Switch
            style={{ marginLeft: "1%", marginRight: "1%" }}
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          {t("ShowTaskList")}
        </span>
      </div>
      <AddScheduleModal
        open={open}
        onClose={() => setOpen(false)}
        projectList={projectList}
        fetchSchdule={fetchSchdule}
        selectedProject={selectedProject}
      />
    </div>
  );
};
