import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SlotModal from "./slotModal";
import EventModal from "./eventModal";
import {
  Calendar as AntdCalendar,
  Card,
  theme,
  Checkbox,
  Popover,
  Button,
  ColorPicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "../../../assets/calendar/calendar-override.css";
import { t } from "i18next";
import { PlusSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import AddMyCalendar from "./addMyCalendarModal";
import { CalendarList } from "../../../data/calendarList";
import DeleteModal from "./deleteModal";
import AddProjectCalendar from "./addProjectCalendarModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import "../../../assets/calendar/calendarList.css";
import { ColorList } from "../../../data/colorList";
import axios from "axios";
import { Color } from "antd/es/color-picker";
import ShareModal from "./shareModal";
const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

export default function TimeSheet() {
  const [calCurrDate, setCalCurrDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [view, setView] = useState(Views.Month);
  const [select, setSelect] = useState(new Date());
  const [antdSelect, setAntdSelect] = useState(() => dayjs());
  const [antdValue, setAntdValue] = useState(() => dayjs());
  const [evtTitle, setEvtTitle] = useState({});
  const [openAddProjectCalendar, setOpenAddProjectCalendar] = useState(false);
  const [openAddMyCalendar, setOpenAddMyCalendar] = useState(false);
  const [myCalendarList, setMyCalendarList] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState();
  const [openShareModal, setOpenShareModal] = useState(false);

  const fetchData = async (date: Date) => {
    try {
      const calendarList = await CalendarList(
        dayjs(date).startOf("month"),
        dayjs(date).endOf("month")
      );
      setMyCalendarList(calendarList);
      console.log(JSON.stringify(calendarList));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData(new Date());
  }, []);
  function contrastingColor(color) {
    return luma(color) >= 165 ? "000" : "fff";
  }
  function luma(color) {
    // color can be a hx string or an array of RGB values 0-255
    var rgb = typeof color === "string" ? hexToRGBArray(color) : color;
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // SMPTE C, Rec. 709 weightings
  }
  function hexToRGBArray(color) {
    if (color.length === 3)
      color =
        color.charAt(0) +
        color.charAt(0) +
        color.charAt(1) +
        color.charAt(1) +
        color.charAt(2) +
        color.charAt(2);
    else if (color.length !== 6) throw "Invalid hex color: " + color;
    var rgb = [];
    for (var i = 0; i <= 2; i++) rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
  }
  /** Returning the Current Date Value */
  const onNavigate = (newDate: Date) => {
    setCalCurrDate(newDate);
    setAntdValue(dayjs(newDate));
    fetchData(newDate);
  };

  /** Action when the slot box has selected */
  const handleSelectSlot = (SlotInfo: SlotInfo) => {
    setSelect(SlotInfo.start);
    setOpen(true);
  };
  /** Action when Event cell has been clicked */
  const handleSelectEvent = (evt: Event) => {
    console.log(evt);
    setOpenDetail(true);
    setEvtTitle(evt);
  };

  const handleSelecting = (range: { start: Date; end: Date }) => {
    console.log("range", range);

    return false;
  };

  const handleAntdSelect = (newDate: Dayjs) => {
    setAntdSelect(newDate);
    setCalCurrDate(newDate.toDate());
    setAntdValue(newDate);
    setView(Views.DAY);
  };

  const projectCalendarActions = (e: any) => {
    return (
      <div>
        <div
          className="projectAction shareCalendar"
          style={{ cursor: "pointer" }}
          onClick={() => setOpenShareModal(true)}
        >
          <FontAwesomeIcon icon={faShare} style={{ marginRight: "3%" }} />
          <span style={{ textAlign: "left" }}>Share to other</span>
        </div>
        <div
          className="projectAction deleteCalendar"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedCalendar(e);
            setOpenDeleteModal(true);
          }}
        >
          <DeleteOutlined /> Delete Selected Calendar
        </div>
      </div>
    );
  };

  const handleAddMyCalendar = () => {
    setOpenAddMyCalendar(true);
  };

  const { token } = theme.useToken();
  const onView = useCallback((newView) => setView(newView), [setView]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "25%",
            margin: "0 1%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "100%",
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              height: "100vh",
            }}
          >
            <AntdCalendar
              fullscreen={false}
              style={{ flex: 1, width: "100%", height: "100%" }}
              onSelect={handleAntdSelect}
              value={antdValue}
            />
          </div>
          <div>
            <Card
              title={
                <div style={{ textAlign: "left", flex: 1, minWidth: "100%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{t("MyCalendars")}</span>
                    <span>
                      <PlusSquareOutlined onClick={handleAddMyCalendar} />
                    </span>
                  </div>
                </div>
              }
              style={{ minWidth: "100%", marginTop: "1.5%" }}
            >
              {myCalendarList && (
                <ul
                  style={{
                    padding: 0,
                    listStyle: "none",
                    textAlign: "left",
                  }}
                >
                  {myCalendarList.map((e) => (
                    <li
                      key={"calendar-" + e.ID}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Checkbox
                        checked={e.selected}
                        onChange={(evt) => {
                          let mycalendars = [...myCalendarList];
                          const idx = myCalendarList.findIndex(
                            (d) => d.ID == e.ID
                          );
                          mycalendars[idx].selected =
                            !myCalendarList[idx].selected;
                          setMyCalendarList(mycalendars);
                        }}
                      >
                        {e.Name}
                      </Checkbox>
                      <span className="threeDot">
                        <Popover
                          title={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{ fontWeight: "bold", fontSize: "18px" }}
                              >
                                Actions
                              </div>
                              <div>
                                <ColorPicker
                                  presets={[ColorList]}
                                  defaultValue={e.Color}
                                  onChange={async (
                                    value: Color,
                                    hex: string
                                  ) => {
                                    const res = await axios.post(
                                      "/dashboard/updatecalendar",
                                      {
                                        Name: e.Name,
                                        Color: hex,
                                      }
                                    );
                                    if (
                                      res.data ===
                                      "Successfully updated the color"
                                    ) {
                                      try {
                                        fetchData(calCurrDate);
                                      } catch (error) {
                                        console.log(
                                          "CalendarList Error",
                                          error
                                        );
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          }
                          trigger={"click"}
                          placement="right"
                          content={projectCalendarActions(e)}
                        >
                          <Button size="small">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Button>
                        </Popover>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
          <div>
            <Card
              title={
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {t("SharedCalendars")}
                  </div>
                </div>
              }
              style={{ marginTop: "1.5%", flex: 1, minWidth: "100%" }}
            >
              {myCalendarList && (
                <ul
                  style={{
                    padding: 0,
                    listStyle: "none",
                    textAlign: "left",
                  }}
                >
                  {myCalendarList.map((e) => (
                    <li
                      key={"calendar-" + e.ID}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Checkbox
                        checked={e.selected}
                        onChange={(evt) => {
                          let mycalendars = [...myCalendarList];
                          const idx = myCalendarList.findIndex(
                            (d) => d.ID == e.ID
                          );
                          mycalendars[idx].selected =
                            !myCalendarList[idx].selected;
                          setMyCalendarList(mycalendars);
                        }}
                      >
                        {/* {e.Name} */}
                      </Checkbox>
                      <DeleteOutlined
                        className="delete-icon"
                        onClick={() => {
                          setSelectedCalendar(e);
                          setOpenDeleteModal(true);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            marginRight: "2%",
            height: "100vh",
            background: "#FFFFFF",
          }}
        >
          <Calendar
            localizer={localizer}
            events={myCalendarList
              .filter((c) => c.selected)
              .map((d) => {
                let schedules = [...d.schedules];
                schedules = schedules.map((c) => {
                  c.color = d.Color;
                  return c;
                });
                console.log("schedules", schedules);
                return schedules;
              })
              .flat()}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onSelecting={handleSelecting}
            selectable
            step={15}
            popup
            onView={onView}
            view={view}
            onNavigate={onNavigate}
            eventPropGetter={(event: any) => {
              var backgroundColor = event.color;
              if (backgroundColor != null) {
                var style = {
                  backgroundColor: backgroundColor,
                  color: "#" + contrastingColor(backgroundColor.slice(-6)),
                };
                return {
                  style: style,
                };
              } else {
                return {};
              }
            }}
            date={calCurrDate}
          />
        </div>
      </div>
      <SlotModal
        open={open}
        onClose={() => setOpen(false)}
        calendarList={myCalendarList.map((e) => {
          return {
            label: e.Name,
            value: e.ID,
          };
        })}
        start={select}
        onChange={() => fetchData(calCurrDate)}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        selectedCalendar={selectedCalendar}
        onChange={() => fetchData(calCurrDate)}
      />
      <EventModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        evtTitle={evtTitle}
      />
      <AddProjectCalendar
        open={openAddProjectCalendar}
        onClose={() => setOpenAddProjectCalendar(false)}
      />
      <AddMyCalendar
        open={openAddMyCalendar}
        onClose={() => setOpenAddMyCalendar(false)}
        onChange={() => fetchData(calCurrDate)}
      />
      <ShareModal
        open={openShareModal}
        onClose={() => {
          setOpenShareModal(false);
        }}
      />
    </div>
  );
}
