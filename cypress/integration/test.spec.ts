import { sample, uniqWith, sortBy, reverse } from "lodash";
import { Appointment, AppointmentsService } from "../../src/services/AppointmentsService";
import { randomAppoinmentWithoutRelations, randomList, randomPatientWithoutRelations } from "../../testHelpers/random";
import Dayjs from "../../src/helpers/dayjs";
import { generateAppointmentCardCypressDataSelector } from "../../src/helpers/cypressHelper";
import { dateToWeekday, dateToAllowedTime } from "../../src/helpers/calendarHelper";
import { PatientsService } from "../../src/services/PatientsService";
import { computeCurrentAge } from "../../src/helpers/ageHelper";
import { computePreviousAppointments, computeRecentAppointments, computeUpcomingAppointments } from "../../src/helpers/appointmentsHelper";
 
describe("Doctor's Dashboard", () => {
  const patients = randomList(randomPatientWithoutRelations, 10);
  const appointments = randomList(randomAppoinmentWithoutRelations, 40)
    .map(appointment => ({
      ...appointment,
      patientId: sample(patients)!.id
    }));

  //Patients must be sorted by Id ascending!
  patients.sort((p1, p2) => p1.id < p2.id ? -1 : 1);

  function appointmentTimesOverlap(a1 : Appointment, a2 : Appointment) : boolean {
    const firstStartTime = Dayjs(a1.startTime);
    const secondStartTime = Dayjs(a2.startTime);
    const firstEndTime =  a1.endTime ? Dayjs(a1.endTime) : Dayjs(a1.startTime).add(30, "minutes");
    const secondEndTime =  a2.endTime ? Dayjs(a2.endTime) : Dayjs(a2.startTime).add(30, "minutes");

    return firstStartTime.isSame(secondStartTime) ||
             firstEndTime.isSame(secondStartTime) ||
             secondEndTime.isSame(firstStartTime);
             
  }

  const uniqueAppointments = uniqWith(appointments, (a1, a2) => appointmentTimesOverlap(a1, a2));

  it("Appointments Calendar", () => {
    cy.intercept({
      pathname: "/api/appointments",
      method: "GET"
    }, {
      body: uniqueAppointments
    });

    cy.intercept({
      pathname: "/api/patients",
      method: "GET"
    }, {
      body: patients
    });

    patients.forEach(patient => {
      const relatedAppointments = uniqueAppointments
        .filter(appointment => appointment.patientId === patient.id);

      cy.intercept({
        pathname: `/api/patients/${patient.id}`,
        method: "GET"
      }, {
        body: {
          ...patient,
          appointments: relatedAppointments
        }
      });
    });

    cy.visit("/dashboard/calendar");
    
    uniqueAppointments.forEach(appointment => {
      const {
        startTime,
        endTime
      } = appointment;

      const weekday = dateToWeekday(startTime);
      const formattedStartTime = dateToAllowedTime(startTime);
      const formattedEndTime = endTime ? 
        dateToAllowedTime(endTime) : 
        dateToAllowedTime(Dayjs(startTime).add(30, "minutes").toISOString());

      const patient = patients.find(patient => patient.id === appointment.patientId)!;
      const displayableType = AppointmentsService.displayableAppointmentType[appointment.type];
      const displayableStatus = AppointmentsService.displayableAppointmentStatus[appointment.status];

      const selector = generateAppointmentCardCypressDataSelector(weekday, formattedStartTime, formattedEndTime);
      cy.get(`[data-cy="${selector}"]`)
        .should("contain.text", patient.name)
        .should("contain.text", displayableType)
        .should("contain.text", displayableStatus)
        .trigger("onmouseover")
        .should("contain.text", appointment.description)
        .click();


      //Patient info
      cy.contains(patient.name);
      cy.contains(PatientsService.displayableDocument(patient.document));
      cy.contains(PatientsService.displayableHealthSystemId(patient.healthSystemId));
      cy.contains(`${computeCurrentAge(patient.birthday)} y/o`);

      //Selected appointment info
      cy.contains(Dayjs(startTime).format("MM/DD/YYYY HH:mm"))
        .parentsUntil("[data-cy=appointmentListEntry]")
        .should("contain.text", displayableStatus)
        .should("contain.text", displayableType);

      cy.get("[data-cy=patientDetailsLeftArrowIcon]").click();
    });
  });

  it.only("Appointments History", () => {
    const sortedAppointments = reverse(sortBy(uniqueAppointments, "startTime"));

    cy.intercept({
      pathname: "/api/appointments",
      method: "GET"
    }, {
      body: sortedAppointments
    });

    cy.intercept({
      pathname: "/api/patients",
      method: "GET"
    }, {
      body: patients
    });

    patients.forEach(patient => {
      const relatedAppointments = uniqueAppointments
        .filter(appointment => appointment.patientId === patient.id);

      cy.intercept({
        pathname: `/api/patients/${patient.id}`,
        method: "GET"
      }, {
        body: {
          ...patient,
          appointments: relatedAppointments
        }
      });
    });

    cy.visit("/dashboard/history");

    sortedAppointments.forEach((appointment, index) => {
      const endTime = appointment.endTime ? Dayjs(appointment.endTime) : Dayjs(appointment.startTime).add(30, "minutes");
      const formattedDate = Dayjs(appointment.startTime).format("MM/DD/YYYY");
      const formattedStartTime = Dayjs(appointment.startTime).format("HH:mm");
      const formattedEndTime = Dayjs(endTime).format("HH:mm");

      const displayableType = AppointmentsService.displayableAppointmentType[appointment.type];
      const displayableStatus = AppointmentsService.displayableAppointmentStatus[appointment.status];

      const patient = patients.find(patient => patient.id === appointment.patientId)!;

      cy.viewport(1000, 700);

      cy.get("[data-cy=appointmentsHistoryEntry]")
        .eq(index)
        .should("contain.text", formattedDate)
        .should("contain.text", formattedStartTime)
        .should("contain.text", formattedEndTime)
        .should("contain.text", displayableType)
        .should("contain.text", displayableStatus)
        .should("contain.text", patient.name);

      cy.viewport(500, 700);

      cy.get("[data-cy=appointmentsHistoryEntry]")
        .eq(index)
        .should("contain.text", formattedDate)
        .should("contain.text", formattedStartTime)
        .should("contain.text", formattedEndTime)
        .should("contain.text", patient.name);

      cy.get("[data-cy=appointmentsHistoryEntry]")
        .eq(index)
        .contains(displayableType)
        .should("not.be.visible");

      cy.viewport(1000, 700);

      cy.get("[data-cy=appointmentsHistoryEntry]")
        .eq(index)
        .click();

      //At Patient Details Page
      //Patient info
      cy.contains(patient.name);
      cy.contains(PatientsService.displayableDocument(patient.document));
      cy.contains(PatientsService.displayableHealthSystemId(patient.healthSystemId));
      cy.contains(`${computeCurrentAge(patient.birthday)} y/o`);

      //Selected appointment info
      cy.contains(Dayjs(appointment.startTime).format("MM/DD/YYYY HH:mm"))
        .parentsUntil("[data-cy=appointmentListEntry]")
        .should("contain.text", displayableStatus)
        .should("contain.text", displayableType);

      cy.get("[data-cy=patientDetailsLeftArrowIcon]").click();
      cy.contains("History").click();
    });
      
  });
});