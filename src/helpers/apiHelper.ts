import Axios from "axios";

export const apiClient = Axios.create({
  baseURL: process.env.API_BASE_URL
});