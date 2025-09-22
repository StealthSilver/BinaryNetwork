import axios from "axios";

const clientServer = axios.create({
  baseURL: "https://binarynetwork-1-i2z7.onrender.com/",
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
