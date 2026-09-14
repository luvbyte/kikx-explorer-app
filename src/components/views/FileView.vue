<template>
  <div
    class="fixed inset-0 fscreen bg-black text-base-content z-60 flex flex-col overflow-hidden"
  >
    <Transition name="slide-down">
      <div
        v-if="showTitle"
        class="p-2 text-white flex items-center justify-between"
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
    </Transition>

    <div class="flex-1 overflow-auto">
      <!-- Image -->
      <ImageView
        v-if="fileType === 'image'"
        :src="getExposeFilePath(file)"
        :alt="file.name"
        @click="toggleMenu"
      />

      <!-- Video -->
      <VideoView
        v-else-if="fileType === 'video'"
        :src="getExposeFilePath(file)"
      />

      <!-- Audio -->
      <AudioView
        v-else-if="fileType === 'audio'"
        :src="getExposeFilePath(file)"
      />

      <!-- Code -->
      <CodeView
        v-else-if="fileType === 'code' && settings.state.highlightCode"
        :content="textContent"
        :language="file.suffix"
      />

      <!-- Text -->
      <TextView
        v-else
        :textContent="textContent"
        :defaultReadOnly="settings.state.readOnly"
        @save="saveFile"
      />
    </div>

    <Transition name="slide-up">
      <div
        ref="thumbnailsRef"
        v-show="showMenu && fileType === 'image'"
        class="fixed w-full bottom-0 left-0 flex py-4 px-2 items-center gap-2 bg-black/40 text-white overflow-x-auto scrollbar-hide"
        @scroll="onScroll"
      >
        <div
          v-for="(imgFile, index) in fileType === 'image' ? imageFiles : []"
          :key="imgFile.kikxpath"
          :id="`thumb_index_${index}`"
          class="w-16 aspect-square border rounded shrink-0 transition-all cursor-pointer border-white/20"
          :class="imgFile === file ? '-translate-y-2' : ''"
          @click="selectFile(imgFile)"
          v-longpress="() => selectMenu(imgFile)"
        >
          <Thumbnail class="fscreen" :path="getFilePath(imgFile.name)" />
        </div>
        <div
          v-if="loadingMore"
          class="w-16 aspect-square shrink-0 border-white/40"
        >
          <Loading />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount, onBeforeUnmount, nextTick } from "vue";

  import { fs } from "@/api";
  import {
    imageExtensions,
    binaryExtensions,
    unSupportedExtensions,
    codeExtensions,
    videoExtensions,
    audioExtensions
  } from "@/api/config";

  import Loading from "@/components/Loading.vue";
  import FileIcon from "@/components/FileIcon.vue";
  import Thumbnail from "@/components/Thumbnail.vue";

  import ImageView from "@/components/views/ImageView.vue";
  import VideoView from "@/components/views/VideoView.vue";
  import AudioView from "@/components/views/AudioView.vue";
  import CodeView from "@/components/views/CodeView.vue";
  import TextView from "@/components/views/TextView.vue";

  import { useSettings } from "@/stores/settings";
  import { useErrorStore } from "@/stores/error";

  const settings = useSettings();
  const errors = useErrorStore();

  const props = defineProps({
    file: {
      type: Object,
      required: true
    },
    imageFiles: {
      type: Array,
      required: true
    },
    getFilePath: {
      type: Function,
      required: true
    },
    getExposeFilePath: {
      type: Function,
      required: true
    },
    loadMore: {
      type: Function,
      required: true
    },
    loadingMore: {
      type: Boolean,
      required: true
    }
  });
  const emit = defineEmits(["close", "select", "menu"]);

  const MAX_SIZE = 13;
  const textContent = ref("");

  const showTitle = ref(true);
  const showMenu = ref(true);

  const thumbnailsRef = ref(null);

  const extension = computed(() => (props.file.suffix || "").toLowerCase());
  const filePath = computed(() => props.getFilePath(props.file.name));

  const fileType = computed(() => {
    // if no extension
    if (imageExtensions.includes(extension.value)) return "image";
    if (videoExtensions.includes(extension.value)) return "video";
    if (audioExtensions.includes(extension.value)) return "audio";
    if (binaryExtensions.includes(extension.value)) return "binary";
    if (codeExtensions.includes(extension.value)) return "code";
    return "text";
  });

  // Images thumbnails panel scroll
  function onScroll(e) {
    const el = e.currentTarget;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
      props.loadMore();
    }
  }

  // Scroll to thumbnail
  async function scrollToThumbnail() {
    await nextTick();

    const index = props.imageFiles.indexOf(props.file);

    if (index === -1) return;

    const thumbnail = document.getElementById(`thumb_index_${index}`);
    if (!thumbnail || !thumbnailsRef.value) return;

    thumbnailsRef.value.scrollTo({
      left:
        thumbnail.offsetLeft -
        thumbnailsRef.value.clientWidth / 2 +
        thumbnail.clientWidth / 2,
      behavior: "smooth"
    });
  }

  // Toggle menu
  function toggleMenu() {
    if (showTitle.value) {
      showTitle.value = false;
      showMenu.value = true;
    } else if (showMenu.value) {
      showMenu.value = false;
    } else {
      showTitle.value = true;
      showMenu.value = true;
    }
  }

  function moveIndex(arr, path, next) {
    const index = arr.indexOf(path);

    const total = arr.length;

    if (total === 0) return -1;
    if (index < 0) return 0;

    return next ? (index + 1) % total : (index - 1 + total) % total;
  }

  function nextImage() {
    const index = moveIndex(props.imageFiles, props.file, true);
    emit("select", props.imageFiles[index]);
  }

  function prevImage() {
    const index = moveIndex(props.imageFiles, props.file, false);
    emit("select", props.imageFiles[index]);
  }

  // Change active file
  function selectFile(file) {
    emit("select", file);
  }

  // File menu
  function selectMenu(file = null) {
    emit("menu", file || props.file);
  }

  async function fetchFile() {
    if (!["code", "text", "binary"].includes(fileType.value)) return;

    // check if file is bigger than 13 MB
    const bytes_size = props.file.size_bytes;

    if (bytes_size > MAX_SIZE * 1024 * 1024 && fileType.value === "text") {
      errors.raiseError(`File is too large. Maximum size is ${MAX_SIZE} MB.`);
      emit("close");
      return;
    }

    if (unSupportedExtensions.includes(props.file.suffix || "")) {
      // Unsupported format
      errors.raiseError(`Unsupported file format '${props.file.suffix}'`);
      emit("close");
      return;
    }

    const { data, error } = await fs.readFile(filePath.value);

    if (error) {
      errors.raiseError(error.detail || "Error reading file", "error");
      emit("close");
      return;
    }

    console.log(textContent.value);

    textContent.value = await data.text();
  }

  async function saveFile(content) {
    const { data, error } = await fs.writeFile(filePath.value, content);

    if (error) {
      errors.raiseError(error.detail || "Error saving file", "error");
      return;
    }

    fetchFile();
  }

  onBeforeMount(() => {
    if (fileType.value == "image") {
      showTitle.value = false;
      scrollToThumbnail();
    } else {
      fetchFile();
    }
  });
</script>
