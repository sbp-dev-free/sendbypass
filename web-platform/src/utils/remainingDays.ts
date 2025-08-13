import dayjs from "dayjs";

export const remainingDays = (
  startDate: string | Date,
  endDate: string | Date,
) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const differenceInDays = end.diff(start, "day");

  return differenceInDays;
};
