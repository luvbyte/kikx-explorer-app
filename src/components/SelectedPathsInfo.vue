<script setup>
  import { ref, computed } from "vue";

  import AlertConfirm from "@/components/ui/AlertConfirm.vue";

  import { formatBytes } from "@/api/utils";

  const props = defineProps([
    "selectedPaths",
    "visibleFiles",
    "toggleSelectAll",
    "deleteSelectedFiles",

    "updateCopyFilesList",
    "copyFilesList",
    "copyFiles"
  ]);

  // Temp hold files
  const confirmDeleteAlert = ref(false);

  function onResponse(yes) {
    confirmDeleteAlert.value = false;

    if (yes) props.deleteSelectedFiles();
  }

  const totalSize = computed(() => {
    return props.selectedPaths.reduce(
      (total, path) => total + (path.size_bytes || 0),
      0
    );
  });
</script>

<template>
  <div class="w-full flex justify-between items-center p-2 bg-base-200">
    <div class="text-sm">
      <div>{{ selectedPaths.length }} / {{ visibleFiles.length }}</div>
      <p class="text-xs opacity-60">{{ formatBytes(totalSize) }}</p>
    </div>

    <div class="flex items-center gap-1">
      <button
        class="p-1 rounded active:bg-primary active:text-primary-content transition-colors"
        @click="toggleSelectAll"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M7 17V7h10v10zm2-2h6V9H9zm-4 4v2q-.825 0-1.412-.587T3 19zm-2-2v-2h2v2zm0-4v-2h2v2zm0-4V7h2v2zm2-4H3q0-.825.588-1.412T5 3zm2 16v-2h2v2zM7 5V3h2v2zm4 16v-2h2v2zm0-16V3h2v2zm4 16v-2h2v2zm0-16V3h2v2zm4 16v-2h2q0 .825-.587 1.413T19 21m0-4v-2h2v2zm0-4v-2h2v2zm0-4V7h2v2zm0-4V3q.825 0 1.413.588T21 5z"
          />
        </svg>
      </button>
      <button
        class="disabled p-1 rounded active:enabled:bg-primary active:enabled:text-primary-content disabled:text-base-content/40 transition-colors"
        :disabled="selectedPaths.length <= 0"
        @click="updateCopyFilesList"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path
              d="M20.998 10c-.012-2.175-.108-3.353-.877-4.121C19.243 5 17.828 5 15 5h-3c-2.828 0-4.243 0-5.121.879C6 6.757 6 8.172 6 11v5c0 2.828 0 4.243.879 5.121C7.757 22 9.172 22 12 22h3c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16v-1"
            />
            <path
              d="M3 10v6a3 3 0 0 0 3 3M18 5a3 3 0 0 0-3-3h-4C7.229 2 5.343 2 4.172 3.172C3.518 3.825 3.229 4.7 3.102 6"
            />
          </g>
        </svg>
      </button>
      <button
        class="p-1 rounded active:enabled:bg-primary active:enabled:text-primary-content disabled:text-base-content/40 transition-colors"
        :disabled="copyFilesList.length <= 0"
        @click="copyFiles"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m7 18H5V4h2v3h10V4h2z"
          />
        </svg>
      </button>
      <button
        class="p-1 rounded active:enabled:bg-primary active:enabled:text-primary-content disabled:text-base-content/40 transition-colors"
        :disabled="selectedPaths.length <= 0"
        @click="confirmDeleteAlert = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
          />
        </svg>
      </button>
    </div>
    <!-- Alert Confirm -->
    <AlertConfirm
      v-if="confirmDeleteAlert"
      class="fade-in"
      :message="`Do you want to delete ${selectedPaths.length} items?`"
      @onResponse="onResponse"
    />
  </div>
</template>
