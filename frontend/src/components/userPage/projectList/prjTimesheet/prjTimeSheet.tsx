import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TeamSlotModal } from "./slotModal";
import TeamEventModal from "./eventModal";

const localizer = momentLocalizer(moment);
export interface DataType {
  id: number;
  title: string;
  start: string;
  end: string;
}

export const ProjectTimeSheet = ({ selectedProject }) => {
  const [view, setView] = useState(Views.Month);
  const [calCurrDate, setCalCurrDate] = useState(new Date());
  const onView = useCallback((newView) => setView(newView), [setView]);
  const [openSlotModal, setOpenSlotModal] = useState(false);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [event, setEvent] = useState([]);
  const fetchData = async (date: Date) => {
    const response = await axios.get("/dashboard/getProjectCalendarSchedule", {
      params: { ProjectID: selectedProject },
    });
    if (response.data.status === true) {
      try {
        const newData: DataType[] = response.data.result.map((items: any) => ({
          ...items,
          id: items.ID,
          title: items.Name,
          start: new Date(items.Start),
          end: new Date(items.End),
          Description: items.Description,
        }));
        setEvent(newData);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("failed to get project calednar list");
    }
  };

  useEffect(() => {
    fetchData(new Date());
  }, []);

  /** Returning the Current Date Value */
  const onNavigate = (newDate: Date) => {
    setCalCurrDate(newDate);
    fetchData(newDate);
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
  const handleSelectSlot = (SlotInfo: SlotInfo) => {
    // setSelect(SlotInfo.start);
    setOpenSlotModal(true);
  };
  // /** Action when Event cell has been clicked */
  const handleSelectEvent = async (evt: Event) => {
    setOpenEventModal(true);
    setSelectedTask(evt);
  };

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
        events={event}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        // onSelecting={handleSelecting}
        selectable
        step={15}
        popup
        onView={onView}
        view={view}
        onNavigate={onNavigate}
        eventPropGetter={(event: any) => {
          var backgroundColor = event.Color;
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
      <TeamSlotModal
        open={openSlotModal}
        onClose={() => {
          setOpenSlotModal(false);
        }}
        selectedProject={selectedProject}
        onChange={() => {
          fetchData(calCurrDate);
        }}
      />
      {selectedTask && (
        <TeamEventModal
          open={openEventModal}
          onClose={() => {
            setOpenEventModal(false);
          }}
          selectedProject={selectedProject}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
};
