import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddTimeSheet from "./timeSheetModal";
import { data } from "../../../data/TimeSheetData";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

export default function TimeSheet() {
  const [calCurrDate, setCalCurrDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await data();
        console.log(result);
        setDataList(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  /** Returning the Current Date Value */
  const onNavigate = useCallback(
    (newDate: Date) => {
      setCalCurrDate(newDate);
    },
    [setCalCurrDate]
  );

  /** Action when the slot box has selected */
  const handleSelectSlot = (SlotInfo: SlotInfo) => {
    setOpen(true);
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
        events={dataList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
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
