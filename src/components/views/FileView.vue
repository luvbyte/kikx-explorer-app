<template>
  <div
    class="fixed inset-0 fscreen bg-base-100 text-base-content z-60 flex flex-col overflow-hidden"
  >
    <div
      class="p-2 border-y bg-base-200 text-base-content border-base-content/20 flex items-center justify-between"
    >
      <div class="flex items-center gap-1 min-w-0 flex-1">
        <FileIcon
          :suffix="file.suffix"
          :mime="file.mime_type"
          class="w-6 h-6 shrink-0"
        />

        <h1 class="text-lg pb-0.5 truncate min-w-0">
          {{ file.name }}
        </h1>
      </div>

      <button @click="emit('close')" class="shrink-0 ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"
          />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-auto">
      <Loading v-if="loading" />

      <!-- Image -->
      <ImageView
        v-else-if="fileType === 'image'"
        :src="objectUrl"
        :alt="file.name"
      />

      <!-- Hex -->
      <HexView v-else-if="fileType === 'binary'" :blob="fileBlob" />

      <!-- Audio -->
      <VideoView v-else-if="fileType === 'video'" :src="objectUrl" />

      <!-- Video -->
      <AudioView v-else-if="fileType === 'audio'" :src="objectUrl" />

      <!-- Code -->
      <CodeView
        v-else-if="fileType === 'code' && settings.state.highlightCode"
        :content="textContent"
        :language="codeLanguage"
      />

      <!-- Text -->
      <TextView v-else :textContent="textContent" :defaultReadOnly="settings.state.readOnly" @save="save" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
  import { fs } from "@/api";

  import Loading from "@/components/Loading.vue";
  import FileIcon from "@/components/FileIcon.vue";

  import ImageView from "@/components/views/ImageView.vue";
  import VideoView from "@/components/views/VideoView.vue";
  import AudioView from "@/components/views/AudioView.vue";
  import HexView from "@/components/views/HexView.vue";
  import CodeView from "@/components/views/CodeView.vue";
  import TextView from "@/components/views/TextView.vue";

  import { useSettings } from "@/stores/settings";
  const settings = useSettings();

  const emit = defineEmits(["close"]);
  const props = defineProps(["file", "filePath"]);

  const loading = ref(true);
  const textContent = ref("");

  const objectUrl = ref("");
  const fileBlob = ref(null);

  const MAX_SIZE = 18;

  const unSupportedExtensions = [
    // Archives
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
    ".bz2",

    // Executables
    ".exe",
    ".msi",
    ".apk",
    ".dmg",
    ".pkg",
    ".app",
    ".deb",
    ".rpm"
  ];

  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
    ".ico"
  ];

  const binaryExtensions = [
    "",
    ".bin",
    ".dat",
    ".dll",
    ".so",
    ".o",
    ".class",
    ".wasm"
  ];

  const codeExtensions = [
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".vue",
    ".json",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".xml",
    ".py",
    ".sh"
  ];

  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];

  const audioExtensions = [".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a"];

  const extension = computed(() => (props.file.suffix || "").toLowerCase());

  const fileType = computed(() => {
    // if no extension
    if (imageExtensions.includes(extension.value)) return "image";
    if (videoExtensions.includes(extension.value)) return "video";
    if (audioExtensions.includes(extension.value)) return "audio";
    if (binaryExtensions.includes(extension.value)) return "binary";
    if (codeExtensions.includes(extension.value)) return "code";
    return "text";
  });

  async function save(content) {
    const { data, error } = await fs.writeFile(props.filePath, content);

    if (error) {
      settings.alert("Error saving file :", error);
      return;
    }

    fetchFile();
  }

  async function fetchFile() {
    // check if file is bigger than 13 MB
    const bytes_size = props.file.size_bytes;

    if (bytes_size > MAX_SIZE * 1024 * 1024) {
      settings.alert(`File is too large. Maximum size is ${MAX_SIZE} MB.`);
      emit("close");
      return;
    }

    if (unSupportedExtensions.includes(props.file.suffix || "")) {
      // Unsupported format
      settings.alert(`Unsupported file format '${props.file.suffix}'`);
      emit("close");
      return;
    }

    try {
      const res = await fs.readFile(props.filePath);
      const blob = await res.data;

      fileBlob.value = blob;

      if (
        fileType.value === "image" ||
        fileType.value === "video" ||
        fileType.value === "audio"
      ) {
        objectUrl.value = URL.createObjectURL(blob);
      } else {
        textContent.value = await blob.text();
      }
    } finally {
      loading.value = false;
    }
  }

  onBeforeMount(fetchFile);

  onBeforeUnmount(() => {
    if (objectUrl.value) {
      URL.revokeObjectURL(objectUrl.value);
    }
  });
</script>
