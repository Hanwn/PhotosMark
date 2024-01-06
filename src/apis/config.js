import axios from "axios";
import { requestNotifyStatus } from "@/utils/notify";

const service = axios.create({
  baseURL: "https://photosmark.art/",
  // debug url
  // baseURL: "http://localhost:8080/",
  timeout: 5000,
});

// interceptors
service.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res.data;
  } else {
    requestNotifyStatus("Oops, request err", "");
    return null;
  }
});

export { service };
