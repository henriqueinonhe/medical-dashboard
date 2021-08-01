import Axios from "axios";
import axiosRetry from "axios-retry";

export const apiClient = Axios.create({
  baseURL: process.env.API_BASE_URL
});
axiosRetry(apiClient, { retries: 4 });
