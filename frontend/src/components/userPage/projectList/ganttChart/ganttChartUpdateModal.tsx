import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { t } from "i18next";

const UpdateModal = ({
  open,
  onClose,
  projectList,
  fetchSchdule,
  selectedProject,
  selectedGantt,
}) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  console.log(projectList);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [selectedMileStone, setSelectedMileStone] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
  const [existingGanttData, setExistingGanttData] = useState(null);
  const [existingData, setExistingData] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [ogList, setOgList] = useState(null);
  const [form] = Form.useForm();
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({ name, Group, Manager, Member, Description }) => {
    try {
      const member = Member.map((d) => {
        if (d.value) {
          return d.value;
        } else {
          return d;
        }
      });
      const manager = Manager.map((d) => {
        if (d.value) {
          return d.value;
        } else {
          return d;
        }
      });
      const projectID = Number(selectedProject);
      const GanttID = Number(selectedGantt.ID);
      const res = await axios.post("/dashboard/updateganttdata", {
        name,
        Group,
        projectID,
        Manager: manager,
        Member: member,
        Description,
        GanttID,
      });
      if (res.data.status === true) {
        Swal.fire({
          html: "<h2>You have successfully updated information!</h2>",
          timer: 2000,
          icon: "success",
        });
        form.resetFields();
        fetchSchdule();
        onClose();
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExistingGanttData = async () => {
    const response = await axios.get("/dashboard/getExistingGanttData", {
      params: { ganttTaskID: selectedGantt.ID },
    });
    if (response.data.status === true) {
      setExistingData(response.data.result);
    } else {
      console.log("failed to get existing data");
    }
  };

  const fetchGanttData = async () => {
    const response = await axios.get("/dashboard/getGanttData", {
      params: { ganttTaskID: selectedGantt.ID },
    });
    if (response.data.status === true) {
      setExistingGanttData(response.data.result);
    } else {
      console.log("failed to get existing data");
    }
  };

  const fetchganttPeople = async () => {
    if (selectedGantt) {
      const response = await axios.get("dashboard/getganttpeople", {
        params: { GanttID: selectedGantt.ID },
      });
      if (response.data.status === true) {
        console.log(response.data.result);
        setOgList(response.data.result);
      }
    }
  };

  const fetchOgGanttPeople = async () => {
    const response = await axios.get("dashboard/getOgGanttPeople", {
      params: { GanttID: selectedGantt.ID },
    });
    if (response.data.status === true) {
      const ogManagers = response.data.result.filter((users: any) => {
        return users.Role === "Manager";
      });
      const ogMembers = response.data.result.filter((users: any) => {
        return users.Role === "Member";
      });
      setManagerList(ogManagers);
      setMemberList(ogMembers);
    }
  };

  useEffect(() => {
    fetchExistingGanttData();
    fetchGanttData();
    fetchganttPeople();
    fetchOgGanttPeople();
  }, [selectedGantt]);

  useEffect(() => {
    if (open === true) {
      fetchExistingGanttData();
      fetchGanttData();
    }
  }, [open]);

  useEffect(() => {
    if (ogList) {
      const Members = ogList.filter((people) => {
        return people.Role === "Member";
      });
      form.setFieldValue(
        "Member",
        Members.map((items) => {
          let option = {
            label: `${items.FirstName} ${items.LastName}`,
            value: items.Joined_User_Email,
            key: items.ID,
          };
          return option;
        })
      );
      const Managers = ogList.filter((people) => {
        return people.Role === "Manager";
      });

      form.setFieldValue(
        "Manager",
        Managers.map((items) => {
          let option = {
            label: `${items.FirstName} ${items.LastName}`,
            value: items.Joined_User_Email,
            key: items.ID,
          };
          return option;
        })
      );
    } else {
      console.log("ogList does not exist!", ogList);
    }
  }, [existingData, existingGanttData]);

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const handleMileStoneChanger = async (value: number) => {
    setSelectedMileStone(value);
    console.log(selectedMileStone);
  };

  //   const selectedMileStoneStart = projectList.filter((p) => {
  //     return p.ID === selectedMileStone;
  //   });
  //   const selectedMileStoneEnd = projectList.filter((p) => {
  //     return p.ID === selectedMileStone;
  //   });
  //   const format = "DD.MM.YYYY HH:mm";
  //   const disabledDates = [
  //     {
  //       start: selectedMileStoneStart.Start,
  //       end: selectedMileStoneEnd,
  //     },
  //     {
  //       start: selectedMileStoneStart.Start,
  //       end: selectedMileStoneEnd,
  //     },
  //   ];

  return (
    <Modal
      centered
      destroyOnClose={true}
      open={open}
      closable={false}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
            flexWrap: "wrap",
          }}
        >
          <Card
            title={
              <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                {selectedGantt && <div>{selectedGantt.Name}</div>}
              </div>
            }
            bordered={false}
            style={{ width: "100%", border: "solid rgb(226, 226, 226) 1.5px" }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                size: componentSize,
              }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              fields={[
                {
                  name: ["name"],
                  value: selectedGantt.Name,
                },
                {
                  name: ["Group"],
                  value: existingGanttData
                    ? existingGanttData[0].InGroup
                    : undefined,
                },
                {
                  name: ["Description"],
                  value: existingGanttData
                    ? existingGanttData[0].Description
                    : undefined,
                },
              ]}
            >
              <Form.Item
                label={t("Name")}
                name="name"
                style={{ display: "inline-block", width: "50%" }}
              >
                <Input placeholder="Name of the Schedule" size="large" />
              </Form.Item>

              <div>
                <Form.Item label={t("SelectMileStone")} name="Group">
                  <Select
                    size="large"
                    onChange={handleMileStoneChanger}
                    placeholder="Please Select the Milestone"
                    options={projectList.map((projectList) => ({
                      label: projectList.Name,
                      value: projectList.ID,
                    }))}
                  />
                </Form.Item>

                <Form.Item name="Manager" label={t("JoinedManagerList")}>
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Please select managers"
                    value={selectedMember}
                    onChange={setSelectedMember}
                    options={managerList.map((item) => ({
                      value: item.Joined_User_Email,
                      label: item.FirstName + " " + item.LastName,
                    }))}
                    style={{ width: "100%" }}
                    tokenSeparators={[","]}
                  />
                </Form.Item>
                <Form.Item name="Member" label={t("JoinedMemberList")}>
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Please select members"
                    value={selectedMember}
                    onChange={setSelectedMember}
                    options={memberList.map((item) => ({
                      value: item.Joined_User_Email,
                      label: item.FirstName + " " + item.LastName,
                    }))}
                    style={{ width: "100%" }}
                    tokenSeparators={[","]}
                  />
                </Form.Item>
                <Form.Item name="Description" label={t("Description")}>
                  <TextArea size="large" />
                </Form.Item>
              </div>
              <Form.Item>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Button
                    style={{
                      width: "300px",
                      height: "50px",
                      color: "white",
                      backgroundColor: "rgb(45,68,134)",
                      marginTop: "3%",
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    {t("Update")}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
