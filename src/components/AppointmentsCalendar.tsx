import React from "react";
import styled from "styled-components";
import Joi from "joi";
import { LogicError } from "../exceptions/LogicError";
import { capitalize } from "lodash";
import { Weekday, AllowedTime, weekdays, allowedTimes, computeAvailableWeekdays, computeAvailableTimes, formatAllowedTime, dateToAllowedTime, dateToWeekday } from "../helpers/calendarHelper";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "../services/AppointmentsService";
import Dayjs from "../helpers/dayjs";
import { Dayjs as DayjsType } from "dayjs";
import { DoctorDashboardComponentContainer } from "./DoctorDashboardComponentContainer";

const Container = styled(DoctorDashboardComponentContainer)`
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
    auto ${availableTimes.map(time => `[${formatAllowedTime(time)}] auto`).join(" ")}
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
  min-height: 100px;

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
  }).required().unknown();

  const { error } = schema.validate(props);

  if(error) {
    throw new LogicError("Invalid AppointmentCalendar props!", 
                         "InvalidAppointmentCalendarProps",
                         error);
  }
}

function renderAppointmentsCards(currentDate : DayjsType, appointments : Array<Appointment<"patient">>) : React.ReactNode {
  const currentDateFirstWeekDay = currentDate.day(0);
  const currentDateLastWeekDay = currentDate.day(6);
  const currentDateWeekAppointments = appointments.filter(appointment => 
    Dayjs(appointment.startTime).isBetween(currentDateFirstWeekDay, currentDateLastWeekDay));

  return currentDateWeekAppointments.map(appointment => {
    const {
      id,
      startTime,
      endTime,
      patient,
      description,
      type,
      status
    } = appointment;

    const weekday = dateToWeekday(startTime);
    const formattedStartTime = dateToAllowedTime(startTime);
    const formattedEndTime = endTime ? 
      dateToAllowedTime(endTime) : 
      dateToAllowedTime(Dayjs(startTime).add(30, "minutes").toISOString());

    return (
      <AppointmentCard 
        key={id}
        appointmentId={id}
        weekday={weekday}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        patientId={patient!.id}
        patientName={patient!.name}
        description={description}
        type={type}
        status={status}
      />
    );
  });
}

export interface AppointmentsCalendarProps {
  minTime : AllowedTime;
  maxTime : AllowedTime;
  minWeekday : Weekday;
  maxWeekday : Weekday;
  currentDate : DayjsType;
  appointments : Array<Appointment<"patient">>;
}

//TODO Documentation
export const AppointmentsCalendar = React.memo((props : AppointmentsCalendarProps) => {
  validateAppointmentCalendarProps(props);

  const {
    minWeekday,
    maxWeekday,
    minTime,
    maxTime,
    currentDate,
    appointments
  } = props;

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

        {renderAppointmentsCards(currentDate, appointments)}

      </Grid>
    </Container>
  );
});

AppointmentsCalendar.displayName = "AppointmentsCalendar";