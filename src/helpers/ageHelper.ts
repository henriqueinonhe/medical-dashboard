import Dayjs from "../helpers/dayjs";

export function computeCurrentAge(birthdate : string) : number {
  return Dayjs().diff(Dayjs(birthdate), "years");
}