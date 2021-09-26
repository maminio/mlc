// @flow
import moment from 'moment';

type TimeUnits = (
    "year" | "years" | "y" |
    "month" | "months" | "M" |
    "week" | "weeks" | "w" |
    "day" | "days" | "d" |
    "hour" | "hours" | "h" |
    "minute" | "minutes" | "m" |
    "second" | "seconds" | "s" |
    "millisecond" | "milliseconds" | "ms"
    );


/**
 * Check if a timestamp is expired.
 * @param {number | string} time - Time in milliseconds
 * @returns {boolean} - Expiration status.
 */
export const isExpired = (time: number): boolean => {
    return !moment().isBefore(moment(time));
};


/**
 * Add amount of time to now.
 * @param {number | string} amount - The amount to add.
 * @param {TimeUnits} unit - The unit of time to add to now.
 * @returns {number} - Timestamp in number.
 */
export const addToNow = (amount: number | string, unit: TimeUnits): number => moment().add(amount, unit).valueOf();
