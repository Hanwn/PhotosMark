import axios from "axios";
import { ref } from "vue";
import { requestNotifyStatus } from "@/utils/notify";
import { request } from "@/apis/request";
import { setSettings } from "@/store/defineSettings";

function useAppOnMountedHook() {
  const fetchSettings = async () => {
    try {
      // resp = await axios.get("http://localhost:8080/settings");
      const data = await request.get("api/settings");
      if (data === null) return;
      setSettings(data);
    } catch (e) {
      requestNotifyStatus("Oops, this is a error message.", "error");
    }
  };

  return {
    fetchSettings,
  };
}

function useParameterAreaOnMountedHook() {
  const options = ref([]);
  const fetchIconList = async () => {
    try {
      // let resp = await axios.get("http://localhost:8080/api/iconList");
      const data = await request.get("api/iconList");
      if (data === null) {
        return;
      }
      for (let key in data) {
        const item = {
          label: key,
          options: [],
        };
        for (let i = 0; i < data[key].length; i++) {
          item.options.push({
            label: key,
            value: data[key][i],
          });
        }
        options.value.push(item);
      }
    } catch (e) {
      // ElMessage.error("Oops, this is a error message.");
      requestNotifyStatus("Oops, this is a error message.", "error");
    }
  };
  return { options, fetchIconList };
}

export { useParameterAreaOnMountedHook, useAppOnMountedHook };
