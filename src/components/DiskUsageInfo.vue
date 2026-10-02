<template>
  <div class="px-3 py-2 border-t border-base-300 bg-base-100">
    <div v-if="usage" class="min-w-0">
      <!-- Storage info -->
      <div
        class="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none text-xs"
      >
        <span class="text-base-content/60">
          <!-- Full-->
          <svg
            v-if="usage.percent >= 90"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 36 36"
          >
            <path d="M0 0h36v36H0z" fill="none" />
            <path
              fill="currentColor"
              d="M2 22v7a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-7Zm28 5h-4v-2h4Z"
              class="clr-i-solid--alerted clr-i-solid-path-1--alerted"
            />
            <path
              fill="currentColor"
              d="M32.58 15.4H22.23A3.68 3.68 0 0 1 19 9.89L20.71 7H7.06a2 2 0 0 0-1.93 1.47L2.29 20h31.42Z"
              class="clr-i-solid--alerted clr-i-solid-path-2--alerted"
            />
            <path
              fill="currentColor"
              d="M26.85 1.14L21.13 11a1.28 1.28 0 0 0 1.1 2h11.45a1.28 1.28 0 0 0 1.1-2l-5.72-9.86a1.28 1.28 0 0 0-2.21 0"
              class="clr-i-solid--alerted clr-i-solid-path-3--alerted clr-i-alert"
            />
            <path fill="none" d="M0 0h36v36H0z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 36 36"
          >
            <path d="M0 0h36v36H0z" fill="none" />
            <path
              fill="currentColor"
              d="M30.86 8.43A2 2 0 0 0 28.94 7H7.06a2 2 0 0 0-1.93 1.47L2.29 20h31.42Z"
              class="clr-i-solid clr-i-solid-path-1"
            />
            <path
              fill="currentColor"
              d="M2 22v7a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-7Zm28 5h-4v-2h4Z"
              class="clr-i-solid clr-i-solid-path-2"
            />
            <path fill="none" d="M0 0h36v36H0z" />
          </svg>
        </span>

        <span class="text-base-content/70">
          {{ formatBytes(usage.used) }} used
        </span>

        <span
          class="font-medium"
          :class="
            usage.percent >= 90
              ? 'text-error'
              : usage.percent >= 75
                ? 'text-warning'
                : 'text-primary'
          "
        >
          {{ usage.percent.toFixed(1) }}%
        </span>

        <span class="text-base-content/50">
          {{ formatBytes(usage.available) }} free
        </span>

        <span class="text-base-content/40">
          {{ formatBytes(usage.total) }} total
        </span>
      </div>

      <!-- Progress -->
      <div class="mt-1.5 h-1.5 w-full rounded-full bg-base-300 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="
            usage.percent >= 90
              ? 'bg-error'
              : usage.percent >= 75
                ? 'bg-warning'
                : 'bg-primary'
          "
          :style="{
            width: `${Math.min(Math.max(usage.percent, 0), 100)}%`
          }"
        ></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="text-xs text-base-content/40">Loading disk usage...</div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { fs } from "@/api";

  const usage = ref(null);

  const formatBytes = bytes => {
    if (!bytes || bytes <= 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(
      i === 0 ? 0 : 1
    )} ${units[i]}`;
  };

  const loadDiskUsage = async () => {
    const { data, error } = await fs.diskUsage("home://");

    if (error) {
      console.error("Failed to get disk usage:", error);
      return;
    }

    usage.value = data;
  };

  onMounted(loadDiskUsage);
</script>
