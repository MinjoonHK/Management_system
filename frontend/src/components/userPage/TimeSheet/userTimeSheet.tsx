import moment from "moment";
import { useCallback, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddTimeSheet from "./timeSheetModal";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const events: Event[] = [
  {
    title: "Event 1",
    start: new Date(2023, 6, 1, 14, 0),
    end: new Date(2023, 7, 1, 15, 0),
  },
  {
    title: "Event 2",
    start: new Date(2023, 6, 1, 11, 0),
    end: new Date(2023, 7, 1, 13, 0),
  },
  {
    title: "Event 3",
    start: new Date(2023, 6, 1, 11, 0),
    end: new Date(2023, 7, 1, 13, 0),
  },
];

export default function TimeSheet() {
  const [calCurrDate, setCalCurrDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  /** Returning the Current Date Value */
  const onNavigate = useCallback(
    (newDate: Date) => {
      setCalCurrDate(newDate);
      console.log("onNavigate", newDate);
    },
    [setCalCurrDate]
  );

  /** Action when the slot box has selected */
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setOpen(true);
    console.log(slotInfo.start.toLocaleString.format("YYYY-DD-MM"));
  };

  /** Action when Event has been selected in Agenda */
  const handleSelectEvent = (evt: Event) => {
    console.log("it has been selected", evt);
  };

  const handleSelecting = (range: { start: Date; end: Date }) => {
    console.log("range", range);

    return false;
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
        defaultView={Views.AGENDA}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onSelecting={handleSelecting}
        selectable
        step={15}
        onNavigate={onNavigate}
        // onView={onView}
        // onRangeChange={onRangeChange}
        // view={view}
        date={calCurrDate}
      />
      <AddTimeSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
