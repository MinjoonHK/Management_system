import { Select, Table, Tag, Button, Tabs } from "antd";
import { data } from "../data/siteList";
import { useEffect, useState } from "react";
import { overallColumns, overallColumns2 } from "../data/tableColumns/opTable";
import { monthlyColumns } from "../data/tableColumns/mpTable";
import { dailyColumns } from "../data/tableColumns/dpTable";
import axios from "axios";

function EnergyPerformance() {
  const [searchCompany, setSearchCompnay] = useState("");
  const [nameList, setNameList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const onChange = (value: string) => {
    setSearchCompnay(value);
    getPerformanceData(value);
  };
  const options = nameList.map((name) => ({
    value: name,
    label: name,
  }));

  const getPerformanceData = async (searchCompany) => {
    try {
      const response = await axios.get(`/dashboard/performance`, {
        params: { Location: searchCompany },
      });
      setDataList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await data();
        const locations = result.map((item) => item.LocationName);
        setNameList(locations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  function changeState() {
    setSearchCompnay("");
  }
  return (
    <div>
      {searchCompany ? (
        <div>
          <div style={{ width: "100%", textAlign: "left" }}>
            <Button onClick={changeState}>Back to search</Button>
          </div>
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
              {
                label: (
                  <div style={{ fontWeight: "bold" }}>Overall Performance</div>
                ),
                key: "1",
                children: (
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginBottom: "3%",
                        marginTop: "3%",
                      }}
                    >
                      Overall Performance at {searchCompany}
                    </div>
                    <Table
                      columns={overallColumns}
                      pagination={false}
                      dataSource={dataList}
                    />
                    <Table
                      style={{ marginTop: "5%" }}
                      columns={overallColumns2}
                      pagination={false}
                    />
                    <div style={{ marginTop: "5%", textAlign: "center" }}>
                      <div style={{ fontSize: "20px", marginBottom: "5%" }}>
                        <b> Average Monthly Power Generation</b>
                      </div>
                    </div>
                    <div style={{ marginTop: "5%", textAlign: "center" }}>
                      <div style={{ fontSize: "20px", marginBottom: "5%" }}>
                        <b>Average Daily Power Generation</b>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: (
                  <div style={{ fontWeight: "bold" }}>Monthly Performance</div>
                ),
                key: "2",
                children: (
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginBottom: "3%",
                        marginTop: "3%",
                      }}
                    >
                      Monthly Energy Performance at {searchCompany}
                    </div>
                    <Table
                      columns={monthlyColumns}
                      pagination={false}
                      dataSource={dataList}
                    />
                  </div>
                ),
              },
              {
                label: (
                  <div style={{ fontWeight: "bold" }}>Daily Performance</div>
                ),
                key: "3",
                children: (
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginBottom: "3%",
                        marginTop: "3%",
                      }}
                    >
                      Daily Energy Performance at {searchCompany}
                    </div>
                    <Table
                      columns={dailyColumns}
                      pagination={false}
                      dataSource={dataList}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <Select
          showSearch
          style={{ width: "500px" }}
          placeholder="Select or Search Site Name"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={options}
        />
      )}
    </div>
  );
}

export default EnergyPerformance;
