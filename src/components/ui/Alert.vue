<template>
  <div
    @click="emit('close')"
    class="fixed inset-0 z-80 flex items-center justify-center text-white"
  >
    <div
      class="border-2 bg-base-100 text-base-content rounded-lg shadow-lg w-[90vw] h-32 max-w-md flex items-center justify-center"
      :class="classList(message.type)"
    >
      <p class="p-4 break-words overflow-y-auto max-h-60">
        {{ message.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  defineProps({
    message: {
      type: Object,
      required: true
    }
  });
  const emit = defineEmits(["close"]);

  const classList = type =>
    ({
      info: "border-info/20",
      error: "border-error/20",
      warning: "border-warning/20"
    })[type] || "border-info/20";
</script>
