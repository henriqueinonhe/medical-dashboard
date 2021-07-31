import { Patient } from "./PatientsService";

export type AppointmentType = "firstVisit" | "followUp" |
                              "checkUp" | "exam" |
                              "surgery";

export type Specialty = "neurology" | "cardiology" | "general";

export type AppointmentStatus = "pending" | "completed" | "cancelled" | "absent";

export type Appointment = Omit<RawAppointment, "patientId"> & {
  patientId : Patient;
};

export type RawAppointment = {
  id : number;
  specialty : Specialty;
  type : AppointmentType;
  description : string;
  notes : string;
  patientId : number;
  startTime : string;
  endTime : string | null;
  status : AppointmentStatus;
};