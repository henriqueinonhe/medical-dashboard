import { apiClient } from "../helpers/apiHelper";

export type InsurancePlan = "Regional" | "NationalBasic" |
                            "NationalPremium" | "International" |
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
    NationalBasic: "National Basic",
    NationalPremium: "National Premium",
    International: "International",
    Diamond: "Diamond"
  };

  public static async fetchPatients() : Promise<Array<Patient>> {
    const response = await apiClient.request({
      url: "/patients",
      method: "GET"
    });

    return response.data;
  }
}