export type Weekday = "sunday" | "monday" | "tuesday" | "wednesday" |
               "thursday" | "friday" | "saturday";

export type AllowedTime = "00:00" | "00:30" | "01:00" | "01:30" | 
                          "02:00" | "02:30" | "03:00" | "03:30" | 
                          "04:00" | "04:30" | "05:00" | "05:30" | 
                          "06:00" | "06:30" | "07:00" | "07:30" | 
                          "08:00" | "08:30" | "09:00" | "09:30" | 
                          "10:00" | "10:30" | "11:00" | "11:30" | 
                          "12:00" | "12:30" | "13:00" | "13:30" | 
                          "14:00" | "14:30" | "15:00" | "15:30" | 
                          "16:00" | "16:30" | "17:00" | "17:30" | 
                          "18:00" | "18:30" | "19:00" | "19:30" | 
                          "20:00" | "20:30" | "21:00" | "21:30" | 
                          "22:00" | "22:30" | "23:00" | "23:30"; 

/**
 * Returns sorted existing weekdays (starting from sunday).
 * 
 * This is a function to avoid the possibility of
 * mutating the array.
 */
export function weekdays() : Array<Weekday> {
  // It is important that this array is sorted
  // for further manipulations
  return [
    "sunday", "monday", 
    "tuesday", "wednesday", 
    "thursday", "friday", 
    "saturday"
  ];
} 

/**
 * Returns sorted existing allowed times (starting from sunday).
 * 
 * This is a function to avoid the possibility of
 * mutating the array.
 */
export function allowedTimes() : Array<AllowedTime> {
  // It is important that this array is sorted
  // for further manipulations
  return [
    "00:00", "00:30", "01:00", "01:30", 
    "02:00", "02:30", "03:00", "03:30", 
    "04:00", "04:30", "05:00", "05:30", 
    "06:00", "06:30", "07:00", "07:30", 
    "08:00", "08:30", "09:00", "09:30", 
    "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30", 
    "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", 
    "22:00", "22:30", "23:00", "23:30"
  ];
} 

export function computeAvailableWeekdays(minWeekday : Weekday, maxWeekday : Weekday) : Array<Weekday> {
  const minWeekdayIndex = weekdays().findIndex(weekday => weekday === minWeekday);
  const maxWeekdayIndex = weekdays().findIndex(weekday => weekday === maxWeekday);

  return weekdays().slice(minWeekdayIndex, maxWeekdayIndex + 1);
}

export function computeAvailableTimes(minTime : AllowedTime, maxTime : AllowedTime) : Array<AllowedTime> {
  const minTimeIndex = allowedTimes().findIndex(time => time === minTime);
  const maxTimeIndex = allowedTimes().findIndex(time => time === maxTime);

  return allowedTimes().slice(minTimeIndex, maxTimeIndex + 1);
}
