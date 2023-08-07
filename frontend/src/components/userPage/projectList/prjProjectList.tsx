import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Descriptions, Popover, Row } from "antd";
import { t } from "i18next";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DeleteOutlined,
  UserAddOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const ProjectList = ({
  e,
  onChange,
  changeGuestModal,
  ChangeUserListModal,
  ChangeDeleteModal,
}) => {
  const [openPopOver, setOpenPopOver] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpenPopOver(newOpen);
  };

  const projectCalendarActions = (e: any) => {
    const url = `/projectDetail`;
    return (
      <div>
        <div
          className="projectAction"
          onClick={() => {
            onChange(e);
            setOpenPopOver(false);
            changeGuestModal();
          }}
        >
          <UserAddOutlined /> {t("AddGuest")}
        </div>
        <div
          className="projectAction"
          onClick={() => {
            onChange(e);
            setOpenPopOver(false);
            ChangeUserListModal();
          }}
        >
          <UserOutlined /> {t("MemberList")}
        </div>
        <div
          className="projectAction deleteProject"
          onClick={() => {
            onChange(e);
            setOpenPopOver(false);
            ChangeDeleteModal();
          }}
        >
          <DeleteOutlined />
          {t("DeleteSelectedProject")}
        </div>
      </div>
    );
  };
  return (
    <Col key={`prj` + e.ID} style={{ padding: "8px 8px 0 8px" }}>
      <Card
        style={{
          border: "1px solid #D3D3D3",
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
        title={
          <>
            <div
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link to={`/projectdetail/${e.ID}`}>
                <span
                  onClick={() => {
                    onChange(e);
                  }}
                  style={{ fontSize: "20px" }}
                >
                  {e.ProjectName}
                </span>
              </Link>
              <span>
                <Popover
                  placement="bottom"
                  open={openPopOver}
                  title={<div style={{ fontSize: "20px" }}>{t("Actions")}</div>}
                  trigger={"click"}
                  onOpenChange={handleOpenChange}
                  content={projectCalendarActions(e)}
                >
                  <Button
                    onClick={() => {
                      if (openPopOver === true) {
                        setOpenPopOver(false);
                      } else {
                        setOpenPopOver(true);
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      style={{ cursor: "pointer" }}
                    />
                  </Button>
                  Hello
                </Popover>
              </span>
            </div>
          </>
        }
      >
        <Row
          style={{
            textAlign: "left",
          }}
        >
          <Col span={24}>
            <Descriptions
              key={e.ID}
              layout="vertical"
              column={5}
              bordered={false}
              title={t("GeneralInfo")}
            >
              <Descriptions.Item label={t("ProjectOwner")}>
                {e.CreatorName}
              </Descriptions.Item>
              <Descriptions.Item label={t("Status")}>
                {e.Status}
              </Descriptions.Item>
              <Descriptions.Item label={t("StartDate")}>
                {dayjs(e.Start).format("YYYY-MM-DD")}
              </Descriptions.Item>
              <Descriptions.Item label={t("DueDate")}>
                {dayjs(e.End).format("YYYY-MM-DD")}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};
