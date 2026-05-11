import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://wild-escape.onrender.com",
  withCredentials: false, // 🔥 IMPORTANT
});

export default publicApi;
