import { apiClient } from "../helpers/apiHelper";
import { Patient, PatientsService } from "./PatientsService";

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

  public static async fetchAppointments() : Promise<Array<Appointment>> {
    const [
      rawAppointments,
      patients
    ] = await Promise.all([
      this.fetchRawAppointments(),
      PatientsService.fetchPatients()
    ]);

    //NOTE If patients are guaranteed to always come sorted by id
    // this join can be made more efficient by using a binary search
    const appointments = rawAppointments.map(appointment => ({
      ...appointment,
      //TODO Treat case where for some reason the corresponding patient can't be found
      patient: patients.find(patient => patient.id === appointment.patientId)!
    })); 

    return appointments;
  }
}