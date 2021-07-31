import { apiClient } from "../helpers/apiHelper";
import { Patient } from "./PatientsService";

export type AppointmentType = "firstVisit" | "followUp" |
                              "checkUp" | "exam" |
                              "surgery";

export type AppointmentSpecialty = "neurology" | "cardiology" | "general";

export type AppointmentStatus = "pending" | "completed" | "cancelled" | "absent";

export type Appointment = Omit<RawAppointment, "patientId"> & {
  patient : Patient;
};

export type RawAppointment = {
  id : number;
  specialty : AppointmentSpecialty;
  type : AppointmentType;
  description : string;
  notes : string;
  patientId : number;
  startTime : string;
  endTime : string | null;
  status : AppointmentStatus;
};

export class AppointmentsService {
  public static displayableAppointmentType : {
    [Key in AppointmentType] : string;
  } = {
    firstVisit: "First Visit",
    followUp: "Follow Up",
    checkUp: "Check Up",
    exam: "Exam",
    surgery: "Surgery"
  };

  public static displayableAppointmentSpecialty : {
    [Key in AppointmentSpecialty] : string;
  } = {
    cardiology: "Cardiology",
    general: "General",
    neurology: "Neurology"
  };

  public static displayableAppointmentStatus : {
    [Key in AppointmentStatus] : string;
  } = {
    absent: "Absent",
    cancelled: "Cancelled",
    completed: "Completed",
    pending: "Pending"
  };

  public static async fetchRawAppointments() : Promise<Array<RawAppointment>> {
    const response = await apiClient.request({
      url: "/appointments",
      method: "GET"
    });

    return response.data;
  }
}