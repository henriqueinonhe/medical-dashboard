import React from "react";
import styled from "styled-components";
import { computeCurrentAge } from "../helpers/ageHelper";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import Dayjs from "../helpers/dayjs";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;

const InfoCardContainer = styled.div`
  padding: 10px;
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  border-radius: 3px;
  padding: 20px;
  height: 150px;
`;

const PatientInfoCardContainer = styled(InfoCardContainer)`
  width: 100%;

  @media (min-width: 1024px) {
    width: 33.33%;
  }
`;

const PlanCardContainer = styled(InfoCardContainer)`
  width: 100%;

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 50%;
  }

  @media (min-width: 1024px) {
    width: 33.33%;
  }
`;

const LastAppointmentCardContainer = styled(InfoCardContainer)`
  width: 100%;

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 50%;
  }

  @media (min-width: 1024px) {
    width: 33.33%;
  }
`;

const InfoCardTopRow = styled.div``;

const InfoCardBottomRow = styled.div``;

const InfoCardHeader = styled.div`
  font-weight: bold;
`;

const InfoCardMain = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

const InfoCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

export interface PatientInfoProps {
  patient : Patient;
  lastAppointment ?: RawAppointment;
}

export const PatientInfo = React.memo((props : PatientInfoProps) => {
  const {
    patient,
    lastAppointment
  } = props;

  const {
    name,
    birthday,
    document,
    healthSystemId,
    insurancePlan
  } = patient;

  const age = computeCurrentAge(birthday);
  const displayableDocument = PatientsService.displayableDocument(document);
  const displayableHealthSystemId = PatientsService.displayableHealthSystemId(healthSystemId);
  const displayableInsurancePlan = PatientsService.displayableInsurancePlan[insurancePlan];
  const displayableSpecialty = lastAppointment ? 
    AppointmentsService.displayableAppointmentSpecialty[lastAppointment.specialty] : "N/A";
  const displayableStartTime = lastAppointment ? 
    Dayjs(lastAppointment.startTime).format("MM/DD/YYYY") : "N/A";

  return (
    <Container>
      <PatientInfoCardContainer>
        <InfoCard>
          <InfoCardTopRow>
            <InfoCardHeader>Patient Info</InfoCardHeader>
          </InfoCardTopRow>

          <InfoCardBottomRow>
            <InfoCardMain>{name}</InfoCardMain>
            <InfoCardFooter>
              <span>{displayableDocument}</span> 
              <span>{`${age} y/o`}</span>
            </InfoCardFooter>
          </InfoCardBottomRow>
        </InfoCard>
      </PatientInfoCardContainer>

      <PlanCardContainer>
        <InfoCard>
          <InfoCardTopRow>
            <InfoCardHeader>Plan Info</InfoCardHeader>
          </InfoCardTopRow>

          <InfoCardBottomRow>
            <InfoCardMain>{displayableInsurancePlan}</InfoCardMain>
            <InfoCardFooter>{displayableHealthSystemId}</InfoCardFooter>
          </InfoCardBottomRow>
        </InfoCard>
      </PlanCardContainer>

      <LastAppointmentCardContainer>
        <InfoCard>
          <InfoCardTopRow>
            <InfoCardHeader>Last Appointment</InfoCardHeader>
          </InfoCardTopRow>

          <InfoCardBottomRow>
            <InfoCardMain>{displayableSpecialty}</InfoCardMain>
            <InfoCardFooter>{displayableStartTime}</InfoCardFooter>
          </InfoCardBottomRow>
        </InfoCard>
      </LastAppointmentCardContainer>
    </Container>
  );
});

PatientInfo.displayName = "PatientInfo";