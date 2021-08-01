import React, { useState } from "react";
import styled from "styled-components";
import { RawAppointment } from "../services/AppointmentsService";
import Dayjs from "../helpers/dayjs";
import { PatientAppointmentsListEntry } from "./PatientAppointmentsListEntry";
import { PatientAppointmentDetails } from "./PatientAppointmentDetails";

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

function computeRecentAppointments(appointments : Array<RawAppointment>) : Array<RawAppointment> {
  return appointments.filter(appointment => 
    Dayjs().diff(Dayjs(appointment.startTime), "days") <= 7);
}

function computeUpcomingAppointments(appointments : Array<RawAppointment>) : Array<RawAppointment> {
  return appointments.filter(appointment => Dayjs().isBefore(Dayjs(appointment.startTime)));
}

function computePreviousAppointments(appointments : Array<RawAppointment>) : Array<RawAppointment> {
  return appointments.filter(appointment => Dayjs().isAfter(Dayjs(appointment.startTime)));
}

export interface PatientAppointmentsInfoProps {
  appointments : Array<RawAppointment>;
}

export const PatientAppointmentsInfo = React.memo((props : PatientAppointmentsInfoProps) => {
  const {
    appointments
  } = props;

  const [activeTab, setActiveTab] = useState<Tab>("Recent");
  const [activeAppointment, setActiveAppointment] = useState<RawAppointment>();

  const categorizedAppointments : {
    [Key in Tab] : Array<RawAppointment>;
  } = {
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
        >
          Recent
        </NavigationTab>
        <NavigationTab 
          onClick={() => setActiveTab("Upcoming")}
          isActive={activeTab === "Upcoming"}
        >
          Upcoming
        </NavigationTab>
        <NavigationTab 
          onClick={() => setActiveTab("History")}
          isActive={activeTab === "History"}
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
                onClick={() => setActiveAppointment(appointment)}
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