<template>
  <div
    class="p-2 grid gap-2"
    style="grid-template-columns: repeat(auto-fit, minmax(80px, 1fr))"
  >
    <div
      v-for="path in visibleFiles"
      :key="path.name + (path.directory ? '_dir' : '')"
      @click="onClick(path)"
      class="flex flex-col items-center justify-center active:bg-base-content/10 p-1 rounded"
      :class="{
        'bg-base-content/10': multiSelectMode && selectedPaths.includes(path)
      }"
      v-longpress="() => onLongPress(path)"
    >
      <img
        v-if="path.directory"
        class="w-22 h-22 aspect-square"
        src="/icons/folder-icon.svg"
      />
      <Thumbnail
        v-else-if="path.image_type"
        class="w-22 h-22"
        :path="getFilePath(path.name)"
      />
      <FileIcon
        v-else
        class="w-22 h-22 aspect-square"
        :suffix="path.suffix"
        :mime="path.mime_type"
      />
      <h1 class="w-18 text-center truncate">{{ path.name }}</h1>
    </div>
  </div>
</template>

<script setup>
  import Thumbnail from "@/components/Thumbnail.vue";
  import FileIcon from "@/components/FileIcon.vue";

  defineProps([
    "visibleFiles",
    "onClick",
    "onLongPress",
    "getFilePath",
    "multiSelectMode",
    "selectedPaths"
  ]);
</script>
