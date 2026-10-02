<template>
  <img :src="getFileIcon(name, suffix, mime)" />
</template>

<script setup>
  import { getFileIcon } from "@/api/config";

  defineProps({
    name: {
      type: String,
      required: true
    },
    suffix: {
      type: String,
      required: true
    },
    mime: {
      type: String,
      required: false
    }
  });
</script>
