<script setup>
  import { ref } from "vue";
  import { fs } from "@/api";

  import Thumbnail from "@/components/Thumbnail.vue";
  import AlertConfirm from "@/components/ui/AlertConfirm.vue";
  import AlertInput from "@/components/ui/AlertInput.vue";

  import FileIcon from "@/components/FileIcon.vue";
  import ScrollingText from "@/components/ui/ScrollingText.vue";

  const props = defineProps({
    path: {
      type: Object,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    deletePath: {
      type: Function,
      required: true
    },
    downloadFile: {
      type: Function,
      required: true
    },
    renameFile: {
      type: Function,
      required: true
    },
    shareFile: {
      type: Function,
      required: true
    },
    setWallpaper: {
      type: Function,
      required: true
    }
  });
  const emit = defineEmits(["close"]);

  const showKikxPath = ref(true);

  const confirmDeleteAlert = ref(false);
  const showRenameDialouge = ref(false);

  function shareFile(path) {
    props.shareFile(path);
    emit("close");
  }

  function setWallpaper(path) {
    props.setWallpaper(path);
    emit("close");
  }

  function downloadFile(path) {
    props.downloadFile(path);
    emit("close");
  }

  function onDeleteResponse(del) {
    confirmDeleteAlert.value = false;
    if (!del) return;

    props.deletePath(props.path);
    emit("close");
  }

  function renameFile(new_name) {
    showRenameDialouge.value = false;
    if (!new_name) return;

    props.renameFile(props.path, new_name);
    emit("close");
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }
</script>

<template>
  <div
    @click.self="emit('close')"
    class="fixed p-8 inset-0 fscreen z-60 bg-black/60 text-white flex flex-col items-center gap-4"
  >
    <!-- Close Button -->
    <div class="rounded bg-base-100/20 p-4 border border-base-content/20">
      <img
        v-if="path.directory"
        class="w-22 h-22 aspect-square"
        src="/icons/folder-icon.svg"
      />
      <Thumbnail
        v-else-if="path.image_type"
        class="w-22 h-22"
        :path="filePath"
      />
      <FileIcon
        v-else
        :suffix="path.suffix"
        :mime="path.mime_type"
        class="w-22 h-22 shrink-0"
      />
    </div>

    <ScrollingText :text="path.name" class="text-center text-lg" />

    <!-- Abs path -->

    <div
      class="rounded border border-base-content/10 bg-base-100/20 p-2 max-w-[95%] overflow-x-auto scrollbar-hide"
      @click="showKikxPath = !showKikxPath"
    >
      <code class="whitespace-nowrap text-xs">
        {{ showKikxPath ? path.kikxpath : path.absolute_path }}
      </code>
    </div>

    <div
      class="flex-1 flex flex-col gap-3 items-center justify-center overflow-hidden"
    >
      <div
        class="border border-base-content/20 bg-base-100/20 max-w-md py-4 rounded p-2 w-full flex flex-wrap gap-2 items-center justify-center overflow-y-auto"
      >
        <button
          v-if="!path.directory"
          @click="downloadFile(path)"
          class="btn btn-sm btn-primary min-w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
                d="M17 9.002c2.175.012 3.353.109 4.121.877C22 10.758 22 12.172 22 15v1c0 2.829 0 4.243-.879 5.122C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.878C2 20.242 2 18.829 2 16v-1c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877"
                opacity=".5"
              />
              <path
                stroke-linejoin="round"
                d="M12 2v13m0 0l-3-3.5m3 3.5l3-3.5"
              />
            </g>
          </svg>

          Download
        </button>
        <button
          @click="setWallpaper(path)"
          v-if="path.image_type || path.suffix === '.mp4'"
          class="btn btn-sm btn-secondary min-w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="M5 21q-.825 0-1.412-.587T3 19v-6h2v6h6v2zm8 0v-2h6v-6h2v6q0 .825-.587 1.413T19 21zm-7-4l3-4l2.25 3l3-4L18 17zm-3-6V5q0-.825.588-1.412T5 3h6v2H5v6zm16 0V5h-6V3h6q.825 0 1.413.588T21 5v6zm-4.575-1.425Q14 9.15 14 8.5t.425-1.075T15.5 7t1.075.425T17 8.5t-.425 1.075T15.5 10t-1.075-.425"
            />
          </svg>

          Wallpaper
        </button>
        <button
          @click="showRenameDialouge = true"
          class="btn btn-sm btn-info min-w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zM5.92 18H5v-.92L12.06 10l.94.94zm12.79-9.96c.39-.39.39-1.04 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
            />
          </svg>

          Rename
        </button>
        <button
          @click="shareFile(path)"
          class="btn btn-sm btn-success min-w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 11.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
              <path
                stroke-linecap="round"
                d="M14.32 16.802L9 13.29m5.42-6.45L9.1 10.352"
                opacity=".5"
              />
              <path
                d="M19 18.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm0-13a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"
              />
            </g>
          </svg>

          Share
        </button>
        <button
          @click="confirmDeleteAlert = true"
          class="btn btn-sm btn-error min-w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-6.287 10.713Q11 16.425 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288M7 6v13z"
            />
          </svg>

          Delete
        </button>
      </div>
      <!-- Info -->
      <div
        class="max-w-md w-full rounded border border-base-content/20 bg-base-100/20 p-4 flex flex-col gap-3 items-stretch"
        @click="emit('close')"
      >
        <div class="flex justify-between">
          <span class="font-semibold">Type</span>
          <span>{{ path.directory ? "Directory" : "File" }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Extension</span>
          <span>{{ path.suffix || "-" }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Size</span>
          <span>{{ formatBytes(path.size_bytes) }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Permissions</span>
          <span>{{ path.permissions }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Owner</span>
          <span>{{ path.owner || "-" }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Modified</span>
          <span>{{ formatDate(path.modified) }}</span>
        </div>

        <div v-if="path.is_symlink" class="pt-2">
          <span
            class="inline-block rounded bg-warning/10 px-2 py-1 text-warning text-sm"
          >
            Symlink
          </span>
        </div>
      </div>
    </div>
    <!-- alert -->
    <AlertConfirm
      v-if="confirmDeleteAlert"
      class="fade-in"
      :message="`Do you want to delete '${path.name}'?`"
      @onResponse="onDeleteResponse"
    />
    <!-- Rename Input -->
    <AlertInput
      v-if="showRenameDialouge"
      class="fade-in"
      :title="`Rename file`"
      :default="path.name"
      @onResponse="renameFile"
    />
  </div>
</template>
