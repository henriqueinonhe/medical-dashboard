import React from "react";
import styled from "styled-components";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
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

const DescriptionField = styled.span`
  margin-top: 20px;
  margin-left: 40px;
`;

export interface PatientAppointmentDetailsProps {
  appointment : RawAppointment;
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

      <DescriptionField>{description}</DescriptionField>
    </Container>
  );
});

PatientAppointmentDetails.displayName = "PatientAppointmentDetails";