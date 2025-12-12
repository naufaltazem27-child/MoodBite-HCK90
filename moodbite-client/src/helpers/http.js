import axios from "axios";

const BASE_URL = "https://solarya.childstudio.web.id/";

export const api = axios.create({
  baseURL: BASE_URL,
});
