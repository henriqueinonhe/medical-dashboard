import { sortedIndexOf } from "lodash";
import { apiClient } from "../helpers/apiHelper";
import { Patient, PatientsService } from "./PatientsService";
import { assemblePaginatedData, PaginatedData } from "../helpers/paginationHelper";

export type AppointmentType = "firstVisit" | "followUp" |
                              "checkUp" | "exam" |
                              "surgery";

export type AppointmentSpecialty = "neurology" | "cardiology" | "general";

export type AppointmentStatus = "pending" | "completed" | "cancelled" | "absent";

type AppointmentWithoutRelations = {
  id : number;
  specialty : AppointmentSpecialty;
  type : AppointmentType;
  description : string;
  notes : string;
  patientId : number;
  startTime : string;
  endTime : string | null;
  status : AppointmentStatus;
}

type AppointmentRelations = {
  patient : Patient;
}

type AppointmentWithRelations<Relations extends keyof AppointmentRelations> = 
  Pick<AppointmentRelations, Relations>;

export type Appointment<Relations extends keyof AppointmentRelations = never> = 
  AppointmentWithoutRelations & AppointmentWithRelations<Relations>;

export type FetchAppointmentsQuery = {
  _embed ?: keyof AppointmentRelations;
  _page ?: number;
  _limit ?: number;
  _sort ?: keyof Appointment;
  _order ?: "asc" | "desc";
};

type FetchAppointmentsReturnType<Query extends FetchAppointmentsQuery> = 
  Query["_page"] extends number ? 
    Promise<PaginatedData<Appointment<Query["_embed"] extends keyof AppointmentRelations ? NonNullable<Query["_embed"]> : never>>> :
    Promise<Array<Appointment<Query["_embed"] extends keyof AppointmentRelations ? NonNullable<Query["_embed"]> : never>>>;

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

  private static embedPatients(appointmentsWithoutPatients : Array<Appointment>, patients : Array<Patient>) : Array<Appointment<"patient">> {
    const patientsIds = patients.map(patient => patient.id);
    const appointments = appointmentsWithoutPatients.map(appointment => {
      const correspondingPatientIndex = sortedIndexOf(patientsIds, appointment.patientId);
      const correspondingPatient = patients[correspondingPatientIndex];

      return {
        ...appointment,
        patient: correspondingPatient
      };
    });
  
    return appointments;
  }

  public static async fetchAppointments<Query extends FetchAppointmentsQuery>(query ?: Query) 
    : Promise<FetchAppointmentsReturnType<Query>> {
    const appointmentsResponsePromise = apiClient.request({
      url: "/appointments",
      method: "GET",
      params: {
        ...query
      }
    });
  
    if(query?._embed === "patient") {
      const patientsPromise = PatientsService.fetchPatients({
        _sort: "id",
        _order: "asc"
      });

      const [
        appointmentsResponse,
        patients
      ] = await Promise.all([
        appointmentsResponsePromise,
        await patientsPromise
      ]);

      const appointments = appointmentsResponse.data;
      const appointmentsWithPatients = AppointmentsService.embedPatients(appointments, patients);

      if(query?._page) {
        return {
          data: appointmentsWithPatients,
          meta: assemblePaginatedData(appointmentsResponse)
        };
      }
  
      return appointmentsWithPatients;
    }

    const appointmentsResponse = await appointmentsResponsePromise;

    if(query?._page) {
      return {
        data: appointmentsResponse.data,
        meta: assemblePaginatedData(appointmentsResponse)
      };
    }

    return appointmentsResponse.data;
  }
}

