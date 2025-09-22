import axios from "axios";

const clientServer = axios.create({
  baseURL: "http://localhost:9090/api",
});

clientServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Ensure headers object exists
  if (!config.headers) {
    config.headers = {};
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default clientServer;
