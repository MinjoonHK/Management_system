import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
export const ProjectTimeSheet = () => {
  const [view, setView] = useState(Views.Month);
  const [calCurrDate, setCalCurrDate] = useState(new Date());
  const onView = useCallback((newView) => setView(newView), [setView]);
  const [myCalendarList, setMyCalendarList] = useState([]);

  const fetchData = async (date: Date) => {
    const response = await axios.get("/dashboard/getProjectSchedule");
    if (response.data.status === true) {
    }
  };

  useEffect(() => {
    // fetchData(new Date());
  }, []);

  /** Returning the Current Date Value */
  const onNavigate = (newDate: Date) => {
    setCalCurrDate(newDate);
    // fetchData(newDate);
  };

  // /** Action when the slot box has selected */
  // const handleSelectSlot = (SlotInfo: SlotInfo) => {
  //   setSelect(SlotInfo.start);
  //   setOpen(true);
  // };
  // /** Action when Event cell has been clicked */
  // const handleSelectEvent = (evt: Event) => {
  //   console.log(evt);
  //   setOpenDetail(true);
  //   setEvtTitle(evt);
  // };

  // const handleSelecting = (range: { start: Date; end: Date }) => {
  //   console.log("range", range);

  //   return false;
  // };

  const handleAntdSelect = (newDate: Dayjs) => {
    setCalCurrDate(newDate.toDate());
    setView(Views.DAY);
  };

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

  // /** Action when the slot box has selected */
  // const handleSelectSlot = (SlotInfo: SlotInfo) => {
  //   setSelect(SlotInfo.start);
  //   setOpen(true);
  // };
  // /** Action when Event cell has been clicked */
  // const handleSelectEvent = (evt: Event) => {
  //   console.log(evt);
  //   setOpenDetail(true);
  //   setEvtTitle(evt);
  // };

  return (
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
        // onSelectEvent={handleSelectEvent}
        // onSelectSlot={handleSelectSlot}
        // onSelecting={handleSelecting}
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
  );
};
