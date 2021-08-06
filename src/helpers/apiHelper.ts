import Axios from "axios";
import axiosRetry from "axios-retry";

const baseURL = process.env.TEST_ENVIRONMENT === "true" ?
  "https://localhost:8080/api" : process.env.API_BASE_URL;

export const apiClient = Axios.create({
  baseURL
});
axiosRetry(apiClient, { retries: 4 });
