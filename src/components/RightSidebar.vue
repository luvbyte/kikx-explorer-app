<script setup>
  import { ref } from "vue";
  import { useSettings } from "@/stores/settings";

  const props = defineProps(["selectBookmarkPath", "removeBookmark"]);
  const emit = defineEmits(["close"]);

  const settings = useSettings();

  function onSwipe(direction, bookmark) {
    if (direction === "left") {
      props.removeBookmark(bookmark);
    }
  }
</script>

<template>
  <div
    @click.self="emit('close')"
    class="fixed inset-0 fscreen z-60 flex justify-end"
  >
    <div
      class="w-[70%] h-full shadow-lg border-l border-base-content/20 flex bg-base-100"
    >
      <!-- Body -->

      <div class="p-2 fscreen flex flex-col gap-3">
        <!-- Settings -->
        <h1
          class="p-2 text-center bg-primary/10 text-primary border border-primary-content/20 rounded-lg"
        >
          Settings
        </h1>

        <div class="flex flex-col gap-2">
          <div class="divider m-0">Files</div>
          <!-- Show hidden files -->
          <label class="flex justify-between items-center">
            Hidden Files
            <input
              v-model="settings.state.showHiddenFiles"
              type="checkbox"
              class="toggle"
            />
          </label>
          <!-- Highlight Code -->
          <label class="flex justify-between items-center">
            Highlight Code
            <input
              v-model="settings.state.highlightCode"
              type="checkbox"
              class="toggle"
            />
          </label>

          <div class="divider m-0">Misc</div>
          <!-- Show load circle -->
          <label class="flex justify-between items-center">
            Open on create
            <input
              v-model="settings.state.openOnCreate"
              type="checkbox"
              class="toggle"
            />
          </label>
          <!-- Show load circle -->
          <label class="flex justify-between items-center">
            Loading Circle
            <input
              v-model="settings.state.showLoadCircle"
              type="checkbox"
              class="toggle"
            />
          </label>
        </div>
        <!-- Bookmarks -->
        <h1
          class="p-2 text-center bg-primary/10 text-primary border border-primary-content/20 rounded-lg"
        >
          Bookmarks
        </h1>

        <div class="flex-1 flex flex-col overflow-y-auto">
          <div
            v-for="bookmark in settings.state.bookmarks"
            :key="`${bookmark.proto}:${bookmark.path}`"
            class="flex items-center justify-between active:bg-base-content/10 p-1 rounded"
            @click="selectBookmarkPath(bookmark)"
            v-swipe="d => onSwipe(d, bookmark)"
          >
            <div class="w-full">
              <h1 class="text-sm text-base-content/60">
                {{ bookmark.proto }}
              </h1>

              <div class="text-sm font-medium break-all pl-2">
                {{ bookmark.path || "/" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
