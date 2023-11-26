import axios from "axios";
import { setSettings } from "@/store/defineSettings";
import { ref } from "vue";

function useAppOnMountedHook() {
  const fetchSettings = async () => {
    let resp;
    try {
      resp = await axios.get("http://localhost:8080/settings");
      // settings.value = resp.data;
      setSettings(resp.data);
    } catch (e) {}
  };

  return {
    fetchSettings,
  };
}

async function appOnMountedHook() {
  let resp;
  try {
    resp = await axios.get("http://localhost:8080/settings");
    console.log(resp.data);
    setSettings(resp.data);
  } catch (e) {
    console.log(e);
    setSettings({
      iconPrefix: "",
      logoPrefix: "",
    });
  }
}

function useParameterAreaOnMountedHook() {
  const options = ref([]);
  const fetchIconList = async () => {
    try {
      let resp = await axios.get("http://localhost:8080/iconList");
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
    } catch (e) {}
  };
  return { options, fetchIconList };
}

export { useParameterAreaOnMountedHook, appOnMountedHook, useAppOnMountedHook };
