import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mercadopago.com/",
});

api.interceptors.request.use(async config => {
  const token = "APP_USR-4602688415278600-061617-55322dfe0ed3b4d240adce1c8edacb2c-141342279";

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;