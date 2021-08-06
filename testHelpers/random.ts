import { Appointment, AppointmentSpecialty, AppointmentStatus, AppointmentType } from "../src/services/AppointmentsService";
import { random as randomNumber, sample, uniqWith } from "lodash";
//This is one is a hell of a LoL player!
import faker from "faker";
import { computeAvailableTimes } from "../src/helpers/calendarHelper";
import Dayjs from "../src/helpers/dayjs";
import RandExp from "randexp";
import { InsurancePlan, Patient } from "../src/services/PatientsService";

export function randomId() : number {
  return randomNumber(1, 10000000000);
}

export function randomAppointmentSpecialty() : AppointmentSpecialty {
  return sample(["neurology", "cardiology", "general"])!;
}

export function randomAppointmentType() : AppointmentType {
  return sample([
    "firstVisit", 
    "followUp",
    "checkUp", 
    "exam",
    "surgery"
  ])!;
}

export function randomStartTime() : string {
  const day = randomNumber(2, 6);
  const time = sample(computeAvailableTimes("09:00", "17:30"))! + ":00.000Z";
  const dateTime = `2021-08-0${day}T${time}`;

  return dateTime;
}

export function randomEndTime(startTime : string) : string {
  const halfHours = randomNumber(1, 2);
  const dateTime = Dayjs(startTime).add(halfHours * 30, "minutes").toISOString();

  return dateTime;
}

export function randomNullable<T>(value : T, probability = 0.333) : T | null {
  if(Math.random() > probability) {
    return value;
  }

  return null;
}

export function randomAppointmentStatus(startTime : string) : AppointmentStatus {
  if(Dayjs(startTime).isBefore(Dayjs())) {
    return sample(["cancelled", "completed", "absent"])!;
  }

  return sample(["cancelled", "pending"])!;
}

export function randomAppoinmentWithoutRelations(patientId ?: number) : Appointment {
  const startTime = randomStartTime();

  return {
    id: randomId(),
    description: faker.lorem.words(),
    specialty: randomAppointmentSpecialty(),
    type: randomAppointmentType(),
    notes: faker.lorem.words(),
    patientId: patientId ?? randomId(),
    startTime: startTime,
    endTime: randomNullable(randomEndTime(startTime)),
    status: randomAppointmentStatus(startTime)
  };
}

export function randomDocument() : string {
  return new RandExp(/\d{11}/).gen();
}

export function randomHealthSystemId() : string {
  return new RandExp(/\d{10}/).gen();
}

export function randomInsurancePlan() : InsurancePlan {
  return sample([
    "Regional", 
    "National Basic",
    "National Premium", 
    "International",
    "Diamond"
  ])!;
}

export function randomPatientWithoutRelations(id ?: number) : Patient {
  return {
    id: id ?? randomId(),
    name: faker.name.findName(),
    document: randomDocument(),
    healthSystemId: randomHealthSystemId(),
    birthday: faker.date.past(randomNumber(70)).toISOString(),
    insurancePlan: randomInsurancePlan()
  };
}

export function randomAppointment() : Appointment<"patient"> {
  const appointmentWithoutRelations = randomAppoinmentWithoutRelations();
  const patient = randomPatientWithoutRelations(appointmentWithoutRelations.patientId);
  
  return {
    ...appointmentWithoutRelations,
    patient: patient
  };
}

export function randomList<T>(generator : () => T, length : number) : Array<T> {
  return new Array(length).fill(null).map(() => generator());
}

export function randomPatient() : Patient<"appointments"> {
  const patientWithoutRelations = randomPatientWithoutRelations();
  const appointments = randomList(() => randomAppoinmentWithoutRelations(patientWithoutRelations.id), randomNumber(20));

  function appointmentTimesOverlap(a1 : Appointment, a2 : Appointment) : boolean {
    const firstStartTime = Dayjs(a1.startTime);
    const secondStartTime = Dayjs(a2.startTime);
    const firstEndTime =  a1.endTime ? Dayjs(a1.endTime) : Dayjs(a1.startTime).add(30, "minutes");
    const secondEndTime =  a2.endTime ? Dayjs(a2.endTime) : Dayjs(a2.startTime).add(30, "minutes");

    return firstStartTime.isSame(secondStartTime) ||
             firstEndTime.isSame(secondStartTime) ||
             secondEndTime.isSame(firstStartTime);
  }

  return {
    ...patientWithoutRelations,
    appointments: uniqWith(appointments, appointmentTimesOverlap)
  };
}