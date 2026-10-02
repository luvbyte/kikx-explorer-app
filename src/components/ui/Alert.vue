<template>
  <div
    @click="emit('close')"
    class="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
  >
    <div
      @click.stop
      class="relative w-[90vw] max-w-md overflow-hidden rounded-2xl border bg-base-100 shadow-2xl"
      :class="config.border"
    >
      <!-- Accent -->
      <div class="absolute inset-x-0 top-0 h-1" :class="config.accent" />

      <!-- Content -->
      <div class="flex items-start gap-3 p-5 pt-6">
        <!-- Icon -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
          :class="config.icon"
        >
          {{ config.symbol }}
        </div>

        <!-- Message -->
        <div class="min-w-0 flex-1">
          <h3 class="mb-1 font-semibold">
            {{ config.title }}
          </h3>

          <p
            class="whitespace-pre-wrap break-words text-sm leading-6 text-base-content/70"
          >
            {{ message.message }}
          </p>
        </div>
      </div>

      <!-- Action -->
      <div class="flex justify-end border-t border-base-content/10 px-5 py-3">
        <button
          @click="emit('close')"
          class="btn btn-sm"
          :class="config.button"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    message: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["close"]);

  const configs = {
    info: {
      title: "Information",
      symbol: "i",
      border: "border-info/30",
      accent: "bg-info",
      icon: "bg-info/10 text-info",
      button: "btn-info"
    },

    warning: {
      title: "Warning",
      symbol: "!",
      border: "border-warning/30",
      accent: "bg-warning",
      icon: "bg-warning/10 text-warning",
      button: "btn-warning"
    },

    error: {
      title: "Error",
      symbol: "!",
      border: "border-error/30",
      accent: "bg-error",
      icon: "bg-error/10 text-error",
      button: "btn-error"
    }
  };

  const config = computed(() => {
    return configs[props.message.type] || configs.info;
  });
</script>
