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