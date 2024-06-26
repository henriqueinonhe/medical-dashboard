import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Patient, PatientsService } from "../services/PatientsService";
import { DoctorDashboardComponentContainer } from "./DoctorDashboardComponentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { computeCurrentAge } from "../helpers/ageHelper";
import { Link } from "react-router-dom";
import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import { SpinnerWrapper } from "./SpinnerWrapper";
import { cypressDataSelector } from "../helpers/cypressHelper";

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

export interface PatientsListProps {
  patientsPerPage ?: number;
}

export const PatientsList = React.memo((props : PatientsListProps) => {
  const {
    patientsPerPage = 10
  } = props;

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    fetchPatients(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchPatients(page : number) : void {
    asyncCallback(isMounted, async () => {

      return await PatientsService.fetchPatients({
        _page: page,
        _embed: "appointments",
        _limit: patientsPerPage
      });

    }, (paginatedPatients) => {

      setLastPage(paginatedPatients.meta.lastPage);
      setPatients(paginatedPatients.data);

    }, setDataIsLoading);
  } 

  function goToPreviousPage() : void {
    if(page > 1) {
      const previousPage = page - 1;
      setPage(previousPage);
      fetchPatients(previousPage);
    }
  }

  function goToNextPage() : void {
    if(page < lastPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPatients(nextPage);
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
          data-cy={cypressDataSelector("patientsListGoToNextPage")}
        />
      </PageNavigationRow>

      <SpinnerWrapper isLoading={dataIsLoading}>
        <PatientEntriesContainer>
          {
            patients.map(patient =>
              <PatientEntry
                key={patient.id}
                to={`/patientDetails/${patient.id}`}
              >
                <PatientNameField>{patient.name}</PatientNameField>
                <PatientAgeField>{`${computeCurrentAge(patient.birthday)} y/o`}</PatientAgeField>
              </PatientEntry>)
          }
        </PatientEntriesContainer>
      </SpinnerWrapper>
    </Container>
  );
});

PatientsList.displayName = "PatientsList";