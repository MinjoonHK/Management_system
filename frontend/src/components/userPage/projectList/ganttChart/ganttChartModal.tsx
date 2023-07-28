import { Button, Card, Form, Input, Modal } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

const AddScheduleModal = ({ open, onClose }) => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onFinish = async ({ name, startDate, endDate }) => {
    try {
      const decodedToken: { ID: string } = jwtDecode(
        localStorage.getItem("jwt")
      );
      const userID = decodedToken.ID;
      const res = await axios.post("/dashboard/ganttchart/addschedule", {
        name,
        startDate,
        endDate,
        userID,
      });
      if (res.status === 200) {
        Swal.fire("You have successfully added the new schedule!", "success");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: never) => {
    console.log("Failed:", errorInfo);
  };

  const onOkHandler = () => {
    window.location.reload();
    onClose();
  };

  return (
    <Modal
      centered
      open={open}
      onOk={onOkHandler}
      closable={false}
      onCancel={onClose}
      width={1000}
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
                Add New Schedule
              </div>
            }
            bordered={false}
            style={{ width: "100%", border: "solid rgb(226, 226, 226) 1.5px" }}
          >
            <Form
              layout="vertical"
              initialValues={{ size: componentSize }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Company Name!",
                  },
                ]}
              >
                <Input placeholder="Name of the Schedule" size="large" />
              </Form.Item>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  { required: true, message: "Please input the Phone Number!" },
                ]}
              >
                <Input size="large" type="Date" />
              </Form.Item>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[
                  { required: true, message: "Please input the Address!" },
                ]}
              >
                <Input size="large" type="Date" />
              </Form.Item>
              <Form.Item>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Button
                    style={{
                      width: "300px",
                      height: "50px",
                      color: "white",
                      backgroundColor: "rgb(45,68,134)",
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    Add Schedule
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

export default AddScheduleModal;
