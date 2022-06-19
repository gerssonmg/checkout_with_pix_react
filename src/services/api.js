import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mercadopago.com/",
});

api.interceptors.request.use(async config => {
  const token = "APP_USR-4602688415278600-061617-55322dfe0ed3b4d240adce1c8edacb2c-141342279";
  // const token = "TEST-4281159543020715-052201-34688b7b24413e4917c6b2e43d91e602-141342279";

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;