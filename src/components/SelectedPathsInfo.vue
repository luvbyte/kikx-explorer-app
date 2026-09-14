<script setup>
  import { ref, computed } from "vue";

  import AlertConfirm from "@/components/ui/AlertConfirm.vue";

  import { formatBytes } from "@/api/utils";

  const props = defineProps({
    selectedPaths: {
      type: Array,
      required: true
    },
    visibleFiles: {
      type: Array,
      required: true
    },
    toggleSelectAll: {
      type: Function,
      required: true
    },
    deleteSelectedFiles: {
      type: Function,
      required: true
    },
    updateCopyFilesList: {
      type: Function,
      required: true
    },
    copyFilesList: {
      type: Array,
      required: true
    }
  });
  const emits = defineEmits(["move", "copy"]);

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
          viewBox="0 0 32 32"
        >
          <path d="M0 0h32v32H0z" fill="none" />
          <path
            fill="currentColor"
            d="M7 7h3v3h12V7h3v11h2V7a2.006 2.006 0 0 0-2-2h-3V4a2.006 2.006 0 0 0-2-2h-8a2.006 2.006 0 0 0-2 2v1H7a2.006 2.006 0 0 0-2 2v21a2.006 2.006 0 0 0 2 2h9v-2H7zm5-3h8v4h-8zm18 20h-8.172l2.586-2.586L23 20l-5 5l5 5l1.414-1.414L21.828 26H30zM12 13h-2v2h2zm10 0h-8v2h8zm-10 5h-2v2h2zm-2 7h2v-2h-2zm4-5h4v-2h-4z"
          />
        </svg>
      </button>
      <button
        class="p-1 rounded active:enabled:bg-primary active:enabled:text-primary-content disabled:text-base-content/40 transition-colors"
        :disabled="copyFilesList.length <= 0"
        @click="emit('copy')"
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
        :disabled="copyFilesList.length <= 0"
        @click="emit('move')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path d="M0 0h32v32H0z" fill="none" />
          <path
            fill="currentColor"
            d="m25 11l-1.41 1.41L26.17 15H17V5.83l2.59 2.58L21 7l-5-5l-5 5l1.41 1.41L15 5.83V15H5.83l2.58-2.59L7 11l-5 5l5 5l1.41-1.41L5.83 17H15v9.17l-2.59-2.58L11 25l5 5l5-5l-1.41-1.41L17 26.17V17h9.17l-2.58 2.59L25 21l5-5z"
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
