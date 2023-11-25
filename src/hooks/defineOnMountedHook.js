import axios from "axios";
import { setSettings } from "@/store/defineSettings";

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

async function parameterAreaOnMountedHook() {
  let resp;
  try {
    resp = await axios.get("http://localhost:8080/iconList");
  } catch (e) {
    console.log(e);
  }
  const data = resp.data;
  const options = [];

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
    options.push(item);
  }

  return options;
}

export { parameterAreaOnMountedHook, appOnMountedHook };
