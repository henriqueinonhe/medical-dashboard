import Dayjs from "../helpers/dayjs";
import { Appointment } from "../services/AppointmentsService";

export function isUpcomingAppointment(appointment : Appointment) : boolean {
  const now = Dayjs();
  const appointmentDate = Dayjs(appointment.startTime);
  return now.isBefore(appointmentDate);
}

export function isPreviousAppointment(appointment : Appointment) : boolean {
  const now = Dayjs();
  const appointmentDate = Dayjs(appointment.startTime);
  return now.isAfter(appointmentDate);
}

export function isRecentAppointment(appointment : Appointment) : boolean {
  const now = Dayjs();
  const appointmentDate = Dayjs(appointment.startTime);
  const appointmentWasAtMostOneWeekAgo = 
    now.diff(appointmentDate, "days", true) <= 7 &&
    isPreviousAppointment(appointment);

  return appointmentWasAtMostOneWeekAgo;
}

export function computeRecentAppointments(appointments : Array<Appointment>) : Array<Appointment> {
  return appointments.filter(appointment => isRecentAppointment(appointment));
}

export function computeUpcomingAppointments(appointments : Array<Appointment>) : Array<Appointment> {
  return appointments.filter(appointment => isUpcomingAppointment(appointment));
}

export function computePreviousAppointments(appointments : Array<Appointment>) : Array<Appointment> {
  return appointments.filter(appointment => isPreviousAppointment(appointment));
}
