<template>
  <img :src="getFileIcon(suffix, mime)" />
</template>

<script setup>
  import { getFileIcon } from "@/api/config";

  defineProps({
    suffix: {
      type: String,
      required: true
    },
    mime: {
      type: String,
      required: true
    }
  });
</script>
