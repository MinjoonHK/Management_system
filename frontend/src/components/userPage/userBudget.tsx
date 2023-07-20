import { Card, Divider, Space } from "antd";
import React from "react";

const BudgetManagement: React.FC = () => (
  <div>
    <Card
      title={
        <div
          style={{ textAlign: "left", fontSize: "25px", fontWeight: "bold" }}
        >
          Cost and Usage Graph
        </div>
      }
      style={{ width: "100%" }}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </div>
);

export default BudgetManagement;
