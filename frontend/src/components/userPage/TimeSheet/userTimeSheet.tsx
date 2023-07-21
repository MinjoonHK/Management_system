import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SlotModal from "./slotModal";
import { data } from "../../../data/timeSheetData";
import EventModal from "./eventModal";
import { Calendar as AntdCalendar, Button, Card, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "./calendar-override.css";
import { t } from "i18next";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import AddCalendar from "./addCalendarModal";
import AddMyCalendar from "./addMyCalendarModal";
import { CalendarList } from "../../../data/calendarList";
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
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [select, setSelect] = useState(new Date());
  const [antdSelect, setAntdSelect] = useState(() => dayjs());
  const [antdValue, setAntdValue] = useState(() => dayjs());
  const [evtTitle, setEvtTitle] = useState({});
  const [openAddCalendar, setOpenAddCalendar] = useState(false);
  const [openAddMyCalendar, setOpenAddMyCalendar] = useState(false);
  const [currentCalendar, setCurrentCalendar] = useState();
  const [myCalendarList, setMyCalendarList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await data();
        const calendarList = await CalendarList();
        setEvents(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  /** Returning the Current Date Value */
  const onNavigate = (newDate: Date) => {
    setCalCurrDate(newDate);
    setAntdValue(dayjs(newDate));
  };

  /** Action when the slot box has selected */
  const handleSelectSlot = (SlotInfo: SlotInfo) => {
    setSelect(SlotInfo.start);
    console.log(`${SlotInfo.start.getHours()}:${SlotInfo.start.getMinutes()}`);
    setOpen(true);
  };
  /** Action when Event cell has been clicked */
  const handleSelectEvent = (evt: Event) => {
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

  const handleAddCalendar = () => {
    setOpenAddCalendar(true);
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
              <ul
                style={{
                  padding: 0,
                  listStyle: "none",
                  textAlign: "left",
                }}
              >
                <li style={{ padding: 0 }}>
                  <MinusSquareOutlined
                    onClick={() => {
                      console.log("Delete!");
                    }}
                  />{" "}
                  MySchedule
                </li>
              </ul>
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
                    <span>
                      <PlusSquareOutlined onClick={handleAddCalendar} />
                    </span>
                  </div>
                </div>
              }
              style={{ marginTop: "1.5%", flex: 1, minWidth: "100%" }}
            >
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut
              explicabo quibusdam eum placeat quae consectetur modi odit quam
              rerum excepturi corrupti provident maxime, odio assumenda soluta
              recusandae fuga, labore sint.
            </Card>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            marginRight: "2%",
            height: "100vh",
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
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
            date={calCurrDate}
          />
        </div>
      </div>
      <SlotModal
        open={open}
        onClose={() => setOpen(false)}
        events={events}
        start={select}
      />
      <EventModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        evtTitle={evtTitle}
      />
      <AddCalendar
        open={openAddCalendar}
        onClose={() => setOpenAddCalendar(false)}
      />
      <AddMyCalendar
        open={openAddMyCalendar}
        onClose={() => setOpenAddMyCalendar(false)}
      />
    </div>
  );
}
