import Dayjs from "dayjs";
import UtcPlugin from "dayjs/plugin/utc";
import IsBetweenPlugn from "dayjs/plugin/isBetween";

Dayjs.extend(UtcPlugin);
Dayjs.extend(IsBetweenPlugn);

export default Dayjs.utc;