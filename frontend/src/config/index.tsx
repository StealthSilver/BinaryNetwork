import axios from "axios";

const clientServer = axios.create({
  baseURL: "http://localhost:9090/api",
});

export default clientServer;
