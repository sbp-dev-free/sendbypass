import dayjs from "dayjs";

export const formatDate = (date: string | Date) => {
  return date ? dayjs(date).format("ddd DD MMM") : "Any date";
};

export const formatTime = (date: string | Date) => {
  return date ? dayjs(date).format("hh:mm") : "Any time";
};
