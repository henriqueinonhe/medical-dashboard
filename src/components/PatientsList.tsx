import React, { useState } from "react";
import styled from "styled-components";
import { Patient } from "../services/PatientsService";
import { DoctorDashboardComponentContainer } from "./DoctorDashboardComponentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { computeCurrentAge } from "../helpers/ageHelper";
import { Link } from "react-router-dom";

const Container = styled(DoctorDashboardComponentContainer)``;

const PatientsListLabel = styled.span`
  font-weight: bold;
  user-select: none;
`;

const PageNavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const disabledIconColor = "#a3a3a3";

interface GoToPreviousPageIconProps {
  disabled ?: boolean;
}

const GoToPreviousPageIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faChevronLeft
}))<GoToPreviousPageIconProps> `
  font-size: 24px;
  cursor: ${props => props.disabled ? "default" : "pointer"};

  & > path {
    color: ${props => props.disabled ? disabledIconColor : "initial"};
  }
`;

interface GoToNextPageIconProps {
  disabled ?: boolean
}

const GoToNextPageIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faChevronRight
}))<GoToNextPageIconProps> `
  margin-left: 12px;
  font-size: 24px;
  cursor: ${props => props.disabled ? "default" : "pointer"};

  & > path {
    color: ${props => props.disabled ? disabledIconColor : "initial"};
  }
`;

const PageNumberField = styled.span`
  margin-left: 12px;
  font-size: 24px;
  user-select: none;
`;

const PatientEntriesContainer = styled.div`
  margin-top: 12px;
`;

const PatientEntry = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #a8a8a8;
  text-decoration: none;
  cursor: pointer;
  transition: 80ms;

  &:hover {
    background-color: #dbdbdb;
  }


  &:last-of-type {
    border-bottom: none;
  }
`;

const PatientNameField = styled.span`
  width: 150px;
`;

const PatientAgeField = styled.span`
  margin-left: 20px;
`;

function selectDisplayedPatients(patients : Array<Patient>, page : number, perPage : number) : Array<Patient> {
  const lowerBoundIndex = (page - 1) * perPage;
  const upperBoundIndex = page * perPage;

  return patients.slice(lowerBoundIndex, upperBoundIndex);
}

export interface PatientsListProps {
  patients : Array<Patient>;
  patientsPerPage ?: number;
}

export const PatientsList = React.memo((props : PatientsListProps) => {
  const {
    patients,
    patientsPerPage = 10
  } = props;

  const [page, setPage] = useState(1);

  const lastPage = Math.max(Math.ceil(patients.length / patientsPerPage), 1);
  const displayedPatients = selectDisplayedPatients(patients, page, patientsPerPage);

  function goToPreviousPage() : void {
    if(page > 1) {
      setPage(page => page - 1);
    }
  }

  function goToNextPage() : void {
    if(page < lastPage) {
      setPage(page => page + 1);
    }
  }

  return (
    <Container>
      <PatientsListLabel>Patients</PatientsListLabel>

      <PageNavigationRow>
        <GoToPreviousPageIcon 
          onClick={goToPreviousPage}
          disabled={page === 1}
        />
        <PageNumberField>{page}</PageNumberField>
        <GoToNextPageIcon 
          onClick={goToNextPage}
          disabled={page === lastPage}  
        />
      </PageNavigationRow>

      <PatientEntriesContainer>
        {
          displayedPatients.map(patient =>
            <PatientEntry
              key={patient.id}
              to={`/patientDetails/${patient.id}`}
            >
              <PatientNameField>{patient.name}</PatientNameField>
              <PatientAgeField>{`${computeCurrentAge(patient.birthday)} y/o`}</PatientAgeField>
            </PatientEntry>)
        }
      </PatientEntriesContainer>
    </Container>
  );
});

PatientsList.displayName = "PatientsList";