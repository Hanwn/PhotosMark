<script setup>
defineProps({
  option: { type: Object, required: true },
  value: { type: [Boolean, Number, String], default: null },
  disabled: { type: Boolean, default: false },
  idPrefix: { type: String, default: "theme-option" },
});
const emit = defineEmits(["change"]);

function changeNumber(event) {
  const value = Number(event.target.value);
  if (Number.isFinite(value)) emit("change", value);
}
</script>

<template>
  <div class="option-row">
    <label :for="`${idPrefix}-${option.key}`">{{ option.label }}</label>
    <input v-if="option.type === 'switch'" :id="`${idPrefix}-${option.key}`" type="checkbox" role="switch" :checked="Boolean(value)" :disabled="disabled" @change="emit('change', $event.target.checked)" />
    <input v-else-if="option.type === 'number'" :id="`${idPrefix}-${option.key}`" class="ui-input option-value" type="number" :min="option.min" :max="option.max" :step="option.step ?? 1" :value="value" :disabled="disabled" @change="changeNumber" />
    <input v-else-if="option.type === 'color'" :id="`${idPrefix}-${option.key}`" class="option-color" type="color" :value="value" :disabled="disabled" @input="emit('change', $event.target.value)" />
    <select v-else-if="option.type === 'select'" :id="`${idPrefix}-${option.key}`" class="ui-input option-value" :value="value" :disabled="disabled" @change="emit('change', $event.target.value)"><option v-for="choice in option.choices || []" :key="choice.value" :value="choice.value">{{ choice.label }}</option></select>
    <input v-else :id="`${idPrefix}-${option.key}`" class="ui-input option-value" type="text" :value="value" :disabled="disabled" @change="emit('change', $event.target.value)" />
  </div>
</template>

<style scoped>
.option-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 32px; font-size: 13px; }
.option-row label { min-width: 0; }
.option-row input[type="checkbox"] { appearance: none; width: 34px; height: 19px; margin: 0; border-radius: 20px; background: var(--switch-off); position: relative; cursor: pointer; transition: background .2s; }
.option-row input[type="checkbox"]:checked { background: var(--primary); }
.option-row input[type="checkbox"]:after { content: ''; width: 15px; height: 15px; border-radius: 50%; background: var(--primary-foreground); position: absolute; top: 2px; left: 2px; box-shadow: 0 1px 2px #0002; transition: transform .2s; }
.option-row input[type="checkbox"]:checked:after { transform: translateX(15px); }
.option-row input:disabled, .option-row select:disabled { opacity: .5; }
.option-value { width: 100px; min-width: 100px; text-align: right; }
.option-color { width: 40px; height: 34px; padding: 3px; border: 1px solid var(--border); border-radius: 7px; background: var(--card); }
</style>
