import React from "react";
import styled from "styled-components";
import { AppointmentsService, Appointment } from "../services/AppointmentsService";
import Dayjs from "../helpers/dayjs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 10px;
  margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AppointmentDetailsLabel = styled.span`
  font-weight: bold;
`;

const DateField = styled.span``;

const TypeField = styled.span`
  font-weight: bold;
  margin-top: 20px;
  font-size: 24px;
`;

const DescriptionField = styled.div`
  margin-top: 10px;
  margin-left: 20px;
  padding: 20px;
  resize: none;
  border: none;
  border-radius: 3px;

  &:hover {
    background-color: #EEE;
  }

  &:focus {
    background-color: #EEE;
    border: none;
    outline: none;
  }
`;

export interface PatientAppointmentDetailsProps {
  appointment : Appointment;
}

export const PatientAppointmentDetails = React.memo((props : PatientAppointmentDetailsProps) => {
  const {
    appointment
  } = props;
  
  const {
    startTime,
    type,
    description
  } = appointment;

  const displayableDate = Dayjs(startTime).format("MM/DD/YYYY");
  const displayableType = AppointmentsService.displayableAppointmentType[type];

  return (
    <Container>
      <Header>
        <AppointmentDetailsLabel>Appointment Details</AppointmentDetailsLabel>
        <DateField>{displayableDate}</DateField>
      </Header>

      <TypeField>{displayableType} says:</TypeField>

      <DescriptionField contentEditable>{description}</DescriptionField>
    </Container>
  );
});

PatientAppointmentDetails.displayName = "PatientAppointmentDetails";