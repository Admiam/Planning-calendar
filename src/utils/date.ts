import {format} from "date-fns";

export function floorDateToIncrement(date: Date, increment = 30): Date {
    const ms = 1000 * 60 * increment;
    return new Date(Math.floor(date.getTime() / ms) * ms);
}

export const formatHourOnly = (date: Date) =>
    format(date, "yyyy-MM-dd'T'HH':00'");

