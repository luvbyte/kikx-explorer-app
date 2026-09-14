<template>
  <div class="p-2 gap-1 flex flex-col">
    <div
      v-for="path in visibleFiles"
      :key="path.name + (path.directory ? '_dir' : '')"
      class="flex gap-2 items-center select-none rounded active:bg-base-content/10 transition-colors"
      :class="{
        'bg-base-content/10': multiSelectMode && selectedPaths.includes(path)
      }"
      v-longpress="() => emit('long', path)"
      @click="() => emit('select', path)"
    >
      <img
        v-if="path.directory"
        src="/icons/folder-icon.svg"
        class="w-12 h-12"
      />
      <Thumbnail
        v-else-if="path.image_type"
        class="w-12 h-12 rounded overflow-hidden"
        :path="getFilePath(path.name)"
      />
      <FileIcon
        v-else
        class="w-12 h-12"
        :suffix="path.suffix"
        :mime="path.mime_type"
      />

      <div class="flex-1 min-w-0 p-1">
        <ScrollingText :text="stem ? path.stem : path.name" />
        <div
          v-if="path.directory"
          class="text-xs flex justify-between opacity-60"
        >
          <p>
            {{
              path.items_count && path.items_count > 0
                ? `${path.items_count} item`
                : "Empty"
            }}
          </p>
          <p>{{ formatDate(path.modified) }}</p>
        </div>
        <div v-else class="text-xs flex justify-between opacity-60">
          <p>
            {{ formatBytes(path.size_bytes) }}
          </p>
          <p>{{ formatDate(path.modified) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { formatDate, formatBytes } from "@/api/utils";
  import Thumbnail from "@/components/Thumbnail.vue";
  import FileIcon from "@/components/FileIcon.vue";
  import ScrollingText from "@/components/ui/ScrollingText.vue";

  defineProps({
    visibleFiles: {
      type: Array,
      required: true
    },
    selectedPaths: {
      type: Array,
      required: true
    },
    getFilePath: {
      type: Function,
      required: true
    },
    multiSelectMode: {
      type: Boolean,
      required: true
    },
    stem: {
      type: Boolean,
      required: true
    }
  });
  const emit = defineEmits(["select", "long"]);
</script>
