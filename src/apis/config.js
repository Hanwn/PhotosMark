import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // baseURL
  timeout: 3000,
});

// interceptors
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
