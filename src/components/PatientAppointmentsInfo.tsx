import React, { useState } from "react";
import styled from "styled-components";
import { Appointment } from "../services/AppointmentsService";
import { PatientAppointmentsListEntry } from "./PatientAppointmentsListEntry";
import { PatientAppointmentDetails } from "./PatientAppointmentDetails";
import { computePreviousAppointments, computeRecentAppointments, computeUpcomingAppointments, isRecentAppointment, isUpcomingAppointment } from "../helpers/appointmentsHelper";
import { cypressDataSelector } from "../helpers/cypressHelper";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const Navigation = styled.div`
  display: flex;
`;

interface NavigationTabProps {
  isActive ?: boolean;
}

const NavigationTab = styled.div<NavigationTabProps>`
  margin-left: 20px;
  border-radius: 3px 3px 0 0;
  text-align: center;
  padding: 16px;
  background-color: ${props => props.isActive ? "white" : "#a3a3a3"};
  cursor: pointer;
  user-select: none;

  &:first-of-type {
    margin-left: 0;
  }
`;

const TabBody = styled.div`
  background-color: white;
  width: 100%;
  padding: 20px;
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
`;

type Tab = "Recent" | "Upcoming" | "History";

function computeInitialActiveTab(activeAppointment ?: Appointment) : Tab {
  if(!activeAppointment) {
    return "Recent";
  }

  if(isRecentAppointment(activeAppointment)) {
    return "Recent";
  }
  else if(isUpcomingAppointment(activeAppointment)) {
    return "Upcoming";
  }
  else {
    return "History";
  }
}

type CategorizedAppointments = {
  [Key in Tab] : Array<Appointment>;
}
export interface PatientAppointmentsInfoProps {
  appointments : Array<Appointment>;
  activeAppointment ?: Appointment;
}

export const PatientAppointmentsInfo = React.memo((props : PatientAppointmentsInfoProps) => {
  const {
    appointments,
    activeAppointment
  } = props;
  
  const [activeTab, setActiveTab] = useState<Tab>(computeInitialActiveTab(activeAppointment));
  
  const categorizedAppointments : CategorizedAppointments = {
    Recent: computeRecentAppointments(appointments),
    Upcoming: computeUpcomingAppointments(appointments),
    History: computePreviousAppointments(appointments)
  };
  const displayedAppointments = categorizedAppointments[activeTab];

  return (
    <Container>
      <Navigation>
        <NavigationTab 
          onClick={() => setActiveTab("Recent")}
          isActive={activeTab === "Recent"}
          data-cy={cypressDataSelector("patientDetailsRecentTab")}
        >
          Recent
        </NavigationTab>
        <NavigationTab 
          onClick={() => setActiveTab("Upcoming")}
          isActive={activeTab === "Upcoming"}
          data-cy={cypressDataSelector("patientDetailsUpcomingTab")}
        >
          Upcoming
        </NavigationTab>
        <NavigationTab 
          onClick={() => setActiveTab("History")}
          isActive={activeTab === "History"}
          data-cy={cypressDataSelector("patientDetailsHistoryTab")}
        >
          History
        </NavigationTab>
      </Navigation>

      <TabBody>
        <AppointmentsList>
          {
            displayedAppointments.map(appointment => 
              <PatientAppointmentsListEntry 
                key={appointment.id}
                appointment={appointment}
                isActive={activeAppointment?.id === appointment.id}
                data-cy={cypressDataSelector("appointmentListEntry")}
              />)
          }
        </AppointmentsList>

        {
          activeAppointment &&
          <PatientAppointmentDetails appointment={activeAppointment}/>
        }
      </TabBody>
    </Container>
  );
});

PatientAppointmentsInfo.displayName = "PatientAppointmentsInfo";