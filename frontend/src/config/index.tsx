const { default: axios } = require("axios");

const clientServer = axios.ceate({
  baseURL: "http://localhost:9090",
});
