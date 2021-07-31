import React from "react";
import styled from "styled-components";
import Joi from "joi";
import { LogicError } from "../exceptions/LogicError";
import { capitalize } from "lodash";
import { Weekday, AllowedTime, weekdays, allowedTimes, computeAvailableWeekdays, computeAvailableTimes, formatAllowedTime } from "../helpers/calendarHelper";
import { AppointmentCard } from "./AppointmentCard";

const Container = styled.div`
  min-width: 700px;
  max-width: 1000px;
  width: 70vw;
  margin: auto;
  padding: 12px;
  background-color: white;
  border-radius: 3px;
`;

const CalendarLabel = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

interface GridProps {
  gridTemplateColumns : string;
  gridTemplateRows : string;
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${props => props.gridTemplateColumns};
  grid-template-rows: ${props => props.gridTemplateRows};
  row-gap: 10px;
  column-gap: 10px;
`;

function generateGridTemplateColumns(availableWeekdays : Array<Weekday>) : string {
  //One column for the time labels and then one for each
  //available weekday
  return `
    auto ${availableWeekdays.map(weekday => `[${weekday}] 1fr`).join(" ")}
  `;
}

function generateGridTemplateRows(availableTimes : Array<AllowedTime>) : string {
  //One row for the weekdays labels and then one for each
  //available time
  return `
    auto ${availableTimes.map(time => `[${formatAllowedTime(time)}] 80px`).join(" ")}
  `;
}

interface WeekdayLabelProps {
  weekday : Weekday;
}

const WeekdayLabel = styled.span<WeekdayLabelProps>`
  grid-column-start: ${props => props.weekday};
  text-align: center;
  width: 100%;
  font-weight: bold;
`;

interface TimeLabelProps {
  startTime : AllowedTime;
}

const TimeLabel = styled.span<TimeLabelProps>`
  grid-row-start: ${props => formatAllowedTime(props.startTime)};
  font-weight: bold;
`;

interface AppointmentCardUnderlayProps {
  weekday : Weekday;
  startTime : AllowedTime;
}

const AppointmentCardUnderlay = styled.div<AppointmentCardUnderlayProps>`
  border-radius: 3px;
  border: 1px dashed #a8a8a8;

  grid-column-start: ${props => props.weekday};
  grid-row-start: ${props => formatAllowedTime(props.startTime)};
`;

function validateAppointmentCalendarProps(props : AppointmentsCalendarProps) : void {
  //TODO Implement custom maxWeekday and maxTime validators
  const schema = Joi.object<AppointmentsCalendarProps>({
    minWeekday: Joi.string()
      .valid(...weekdays())
      .required(),

    maxWeekday: Joi.string()
      .valid(...weekdays())
      .required(),
    
    minTime: Joi.string()
      .valid(...allowedTimes())
      .required(),

    maxTime: Joi.string()
      .valid(...allowedTimes())
      .required()
  }).required();

  const { error } = schema.validate(props);

  if(error) {
    throw new LogicError("Invalid AppointmentCalendar props!", 
                         "InvalidAppointmentCalendarProps",
                         error);
  }
}

export interface AppointmentsCalendarProps {
  minTime : AllowedTime;
  maxTime : AllowedTime;
  minWeekday : Weekday;
  maxWeekday : Weekday;
}

//TODO Documentation
export const AppointmentsCalendar = React.memo((props : AppointmentsCalendarProps) => {
  const {
    minWeekday,
    maxWeekday,
    minTime,
    maxTime
  } = props;

  validateAppointmentCalendarProps(props);

  const availableWeekdays = computeAvailableWeekdays(minWeekday, maxWeekday);
  const availableTimes = computeAvailableTimes(minTime, maxTime);

  return (
    <Container>
      <CalendarLabel>Calendar</CalendarLabel>

      <Grid
        gridTemplateColumns={generateGridTemplateColumns(availableWeekdays)}
        gridTemplateRows={generateGridTemplateRows(availableTimes)}
      >
        {
          availableWeekdays.map(weekday =>
            <WeekdayLabel 
              key={weekday}
              weekday={weekday}
            >
              {capitalize(weekday.slice(0, 3))}
            </WeekdayLabel>)
        }

        {
          availableTimes.map(time =>
            <TimeLabel
              key={time}
              startTime={time}
            >
              {time}
            </TimeLabel>)
        }

        {
          availableWeekdays.map(weekday => 
            availableTimes.map(time => 
              <AppointmentCardUnderlay 
                key={weekday + time}
                weekday={weekday}
                startTime={time}
              />))
        }

        <AppointmentCard 
          weekday="thursday"
          startTime="09:30"
          endTime="10:30"
        />
      </Grid>
    </Container>
  );
});

AppointmentsCalendar.displayName = "AppointmentsCalendar";