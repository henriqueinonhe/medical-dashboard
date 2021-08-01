import { apiClient } from "../helpers/apiHelper";

export type InsurancePlan = "Regional" | "National Basic" |
                            "National Premium" | "International" |
                            "Diamond";

export type Patient = {
  id : number;
  name : string;
  document : string;
  healthSystemId : string;
  birthday : string;
  insurancePlan : InsurancePlan;
}

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

  public static async fetchPatients() : Promise<Array<Patient>> {
    const response = await apiClient.request({
      url: "/patients",
      method: "GET"
    });

    return response.data;
  }

  public static async fetchSinglePatient(id : number) : Promise<Patient> {
    const response = await apiClient.request({
      url: `/patients/${id}`,
      method: "GET"
    });

    return response.data;
  }
}