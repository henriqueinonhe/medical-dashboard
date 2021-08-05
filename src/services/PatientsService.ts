import { apiClient } from "../helpers/apiHelper";
import { assemblePaginatedData, PaginatedData } from "../helpers/paginationHelper";
import { Appointment } from "./AppointmentsService";

export type InsurancePlan = "Regional" | "National Basic" |
                            "National Premium" | "International" |
                            "Diamond";

type PatientWithoutRelations = {
  id : number;
  name : string;
  document : string;
  healthSystemId : string;
  birthday : string;
  insurancePlan : InsurancePlan;
}

type PatientRelations = {
  appointments : Array<Appointment>;
};

type PatientWithRelations<Relations extends keyof PatientRelations> = 
  Pick<PatientRelations, Relations>;

export type Patient<Relations extends keyof PatientRelations = never> = 
  PatientWithoutRelations & PatientWithRelations<Relations>;

export type FetchPatientsQuery = {
  _embed ?: "appointments";
  _limit ?: number;
  _page ?: number;
  _sort ?: keyof Patient;
  _order ?: "asc" | "desc";
};

type FetchPatientsReturnType<Query extends FetchPatientsQuery> = 
  Query["_page"] extends number ? 
    Promise<PaginatedData<Patient<Query["_embed"] extends keyof PatientRelations ? NonNullable<Query["_embed"]> : never>>> :
    Promise<Array<Patient<Query["_embed"] extends keyof PatientRelations ? NonNullable<Query["_embed"]> : never>>>;


export class PatientsService {
  public static displayableInsurancePlan : {
    [Key in InsurancePlan] : string;
  } = {
    Regional: "Regional",
    "National Basic": "National Basic",
    "National Premium": "National Premium",
    International: "International",
    Diamond: "Diamond"
  };

  public static displayableDocument(document : string) : string {
    //TODO Validate Input
    const firstPart = document.slice(0, 3);
    const secondPart = document.slice(3, 6);
    const thirdPart = document.slice(6, 9);
    const finalPart = document.slice(9);

    return `${firstPart}.${secondPart}.${thirdPart}-${finalPart}`;
  }

  public static displayableHealthSystemId(healthSystemId : string) : string {
    //TODO Validate Input

    const firstPart = healthSystemId.slice(0, 3);
    const secondPart = healthSystemId.slice(3, 6);
    const finalPart = healthSystemId.slice(6);

    return `${firstPart}.${secondPart}/${finalPart}`;
  }

  public static async fetchPatients<Query extends FetchPatientsQuery>(query ?: Query) 
    : Promise<FetchPatientsReturnType<Query>> {

    const response = await apiClient.request({
      url: "/patients",
      method: "GET",
      params: {
        ...query
      }
    });

    if(query?._page) {
      return {
        data: response.data,
        meta: assemblePaginatedData(response)
      };
    }

    return response.data;
  }

  public static async fetchSinglePatient(id : number, withAppointments : boolean) : Promise<Patient<"appointments">>;
  public static async fetchSinglePatient(id : number, withAppointments ?: boolean) : Promise<Patient> {
    const response = await apiClient.request({
      url: `/patients/${id}`,
      method: "GET",
      params: {
        _embed: withAppointments ? "appointments" : undefined
      }
    });

    return response.data;
  }
}