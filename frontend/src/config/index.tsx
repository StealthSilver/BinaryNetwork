import axios from "axios";

const clientServer = axios.create({
  baseURL: "https://binary-network-rzoi.vercel.app/",
});

clientServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!config.headers) {
    config.headers = {};
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default clientServer;
