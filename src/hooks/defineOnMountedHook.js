import axios from "axios";
import { setSettings } from "@/store/defineSettings";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { requestNotifyStatus } from "@/utils/notify";

function useAppOnMountedHook() {
  const fetchSettings = async () => {
    let resp;
    try {
      resp = await axios.get("http://localhost:8080/settings");
      resp.status === 200 ? setSettings(resp.data) : "";
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
      let resp = await axios.get("http://localhost:8080/iconList");
      if (resp.status === 200) {
        const data = resp.data;
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
      }
    } catch (e) {
      // ElMessage.error("Oops, this is a error message.");
      requestNotifyStatus("Oops, this is a error message.", "error");
    }
  };
  return { options, fetchIconList };
}

export { useParameterAreaOnMountedHook, useAppOnMountedHook };
