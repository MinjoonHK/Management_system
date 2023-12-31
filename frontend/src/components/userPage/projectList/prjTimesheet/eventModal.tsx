import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Modal, Button, Divider } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { t } from "i18next";

interface TeamEventModal {
  open: boolean;
  onClose: any;
  selectedProject: number;
  selectedTask: {
    ID: Number;
    Name: string;
    Start: string;
    End: string;
    Color: string;
    Description: string;
  };
}

export default function TeamEventModal({
  open,
  onClose,
  selectedProject,
  selectedTask,
}: TeamEventModal) {
  const [memberList, setMemberList] = useState([]);
  const fetchProjectPeople = async () => {
    if (selectedProject) {
      const response = await axios.get("dashboard/getProjectCalendarPeople", {
        params: {
          ProjectID: selectedProject,
          selectedTask: selectedTask.ID,
        },
      });
      if (response.data.status === true) {
        setMemberList(response.data.result);
      }
    }
  };
  useEffect(() => {
    fetchProjectPeople();
  }, [selectedTask]);
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
      footer={[
        <Button type="default" key="Cancel" onClick={onClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Card
        title={
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {selectedTask.Name}
          </div>
        }
      >
        <div style={{ fontSize: "15px" }}>
          <Divider>{t("TimeSlot")}</Divider>
          <div style={{ display: "flex", justifyContent: "center" }}>{`${dayjs(
            selectedTask.Start
          ).format("YYYY-MMM-DD HH:mm")}  -  ${dayjs(selectedTask.End).format(
            "YYYY-MMM-DD HH:mm"
          )}`}</div>

          <Divider>{t("JoinedMemberList")}</Divider>
          {memberList && (
            <div>
              {memberList.map((member, index) => {
                return (
                  <div
                    style={{ display: "flex", justifyContent: "center" }}
                    key={index}
                  >
                    {member.Role ? (
                      <div>
                        {member.Role === "Manager" ? (
                          <div>
                            {`${member.FirstName}  ${member.LastName}   `}
                            <FontAwesomeIcon icon={faCrown} />
                          </div>
                        ) : (
                          <div>{`${member.FirstName}  ${member.LastName}`}</div>
                        )}
                      </div>
                    ) : (
                      <div>{`${member.FirstName}  ${member.LastName}`}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <Divider>{t("Description")}</Divider>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {selectedTask.Description}
          </div>
        </div>
      </Card>
    </Modal>
  );
}
