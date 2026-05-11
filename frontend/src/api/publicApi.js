import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false, // 🔥 IMPORTANT
});

export default publicApi;
