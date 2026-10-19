import { ref } from "vue";

const settings = ref({
  iconPrefix: `${import.meta.env.BASE_URL}icons/`,
});

function readSettings() {
  return settings;
}

export { readSettings };
