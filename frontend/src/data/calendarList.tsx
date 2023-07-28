import axios from "axios";
import dayjs from "dayjs";
interface Schedule {
  id: number;
  title: string;
  start: Date;
  end: Date;
}
interface DataType {
  Name: string;
  ID: number;
  selected: boolean;
  Color: string;
  schedules: Schedule[];
  Description: string;
}
export const CalendarList = async (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs
): Promise<DataType[]> => {
  const response = await axios.get<DataType[]>("/dashboard/calendarlist", {
    params: {
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
    },
  });
  const newData: DataType[] = response.data.map((item) => {
    return {
      ...item,
      selected: true,
      schedules: item.schedules.map((si: any, index: number) => {
        return {
          start: new Date(si.Start),
          end: new Date(si.End),
          id: item.ID * 1000 + index,
          allday: false,
          title: si.Title,
          description: si.Description,
        };
      }),
    };
  });
  return newData;
};
