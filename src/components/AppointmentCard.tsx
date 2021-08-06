import Dayjs from "../helpers/dayjs";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AllowedTime, allowedTimeToCssGridLabel, dateToAllowedTime, dateToWeekday, Weekday } from "../helpers/calendarHelper";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { AppointmentStatusChip } from "./AppointmentStatusChip";
import { generateAppointmentCardCypressDataSelector } from "../helpers/cypressHelper";

interface ContainerProps {
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
}

const Container = styled(({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  weekday,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTime,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endTime,
  ...props
}) => <Link {...props}/>)<ContainerProps>`
  grid-column-start: ${props => props.weekday};
  grid-row-start: ${props => allowedTimeToCssGridLabel(props.startTime)};
  grid-row-end: ${props => allowedTimeToCssGridLabel(props.endTime)};

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100px;
  background-color: #4a7dff;
  border-radius: 3px;
  padding: 10px;
  cursor: pointer;
  text-decoration: none;

  // transition: 350ms;
  // transition-timing-function: ease-out;

  // &:hover {
  //   transform: translateY(-12px);
  // }
`;

const Content = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PatientNameField = styled.span`
  font-weight: bold;
  color: white;
  text-align: center;
`;

const TypeField = styled.span`
  color: white;
  text-align: center;
  margin-top: 8px;
`;

const TooltipContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  z-index: 9999;
  position: absolute;
  left: calc(100% + 18px);
  top: 0;
  opacity: 0;
  visibility: hidden;

  ${Container}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const Tooltip = styled.div`
  width: 200px;
  padding: 20px;
  background-color: rgba(43, 43, 43, 0.95);
  color: white;
  border-radius: 3px;

  ${Container}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 10px);
    left: 0;
    margin-left: -20px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent rgba(43, 43, 43, 0.95) transparent transparent;
  }
`;

const StatusChip = styled(AppointmentStatusChip)`
  display: inline-block;
  margin-top : 8px;
`;

export interface AppointmentCardProps {
  appointment : Appointment<"patient">;
}

export const AppointmentCard = React.memo((props : AppointmentCardProps) => {
  const {
    appointment
  } = props;

  const {
    id: appointmentId,
    startTime,
    endTime,
    description,
    type,
    status,
    patient
  } = appointment;

  const {
    id: patientId,
    name: patientName
  } = patient;

  const displayableType = AppointmentsService.displayableAppointmentType[type];
  const weekday = dateToWeekday(startTime);
  const formattedStartTime = dateToAllowedTime(startTime);
  const formattedEndTime = endTime ? 
    dateToAllowedTime(endTime) : 
    dateToAllowedTime(Dayjs(startTime).add(30, "minutes").toISOString());

  return (
    <Container
      weekday={weekday}
      startTime={formattedStartTime}
      endTime={formattedEndTime}
      to={`/patientDetails/${patientId}/appointments/${appointmentId}`}
      data-cy={generateAppointmentCardCypressDataSelector(weekday, formattedStartTime, formattedEndTime)}
    >
      <Content>
        <PatientNameField>{patientName}</PatientNameField>
        <TypeField>{displayableType}</TypeField> 
        {/* <StatusField>{displayableStatus}</StatusField> */}
        <StatusChip status={status} />
      </Content>

      <TooltipContainer>
        <Tooltip>{description}</Tooltip>
      </TooltipContainer>
    </Container>
  );
});

AppointmentCard.displayName = "AppointmentCard";