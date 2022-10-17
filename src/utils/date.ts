import { format } from "date-fns";

export function dateformat(date: Date, formatStr = "yyyy-MM-dd (HH:mm)") {
  return format(date, formatStr);
}
