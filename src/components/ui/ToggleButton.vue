<script setup>
  defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    }
  });

  const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <label class="flex justify-between items-center">
    {{ label }}

    <input
      type="checkbox"
      class="toggle"
      :checked="modelValue"
      @change="emit('update:modelValue', $event.target.checked)"
    />
  </label>
</template>
