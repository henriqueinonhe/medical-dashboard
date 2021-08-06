import { AllowedTime, allowedTimeToCssGridLabel, Weekday } from "./calendarHelper";

export function cypressDataSelector(identifier : string) : string {
  if(process.env.TEST_ENVIRONMENT === "true") {
    return identifier;
  }

  return "";
}

export function generateAppointmentCardCypressDataSelector(weekday : Weekday, startTime : AllowedTime, endTime : AllowedTime) : string {
  const formattedStartTime = allowedTimeToCssGridLabel(startTime);
  const formattedEndTime = allowedTimeToCssGridLabel(endTime);

  return `${weekday}${formattedStartTime}${formattedEndTime}`;
}