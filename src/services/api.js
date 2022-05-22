import axios from "axios";

const api = axios.create({
  baseURL: "https://",
});

api.interceptors.request.use(async config => {
  // Declaramos um token manualmente para teste.
  const token = "APP_USR-4281159543020715-052201-196ad55eb926e868b4f655100b9a2344-141342279";


  config.headers.Authorization = `Bearer ${token}`;


  return config;
});

export default api;