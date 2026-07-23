<template>
  <img :src="getFileIcon(suffix, mime)" />
</template>

<script setup>
  import { getFileIcon } from "@/api/config";

  defineProps(["suffix", "mime"]);
</script>
