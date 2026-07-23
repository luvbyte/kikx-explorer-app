<template>
  <div class="hex-view">
    <pre class="font-mono text-sm p-2 overflow-auto">{{ formattedHex }}</pre>
  </div>
</template>

<script setup>
  import { ref, watchEffect } from "vue";

  const props = defineProps({
    blob: {
      type: Blob,
      required: true
    }
  });

  const formattedHex = ref("");

  watchEffect(async () => {
    if (!props.blob) {
      formattedHex.value = "";
      return;
    }

    const buffer = await props.blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const lines = [];
    const bytesPerLine = 16;

    for (let offset = 0; offset < bytes.length; offset += bytesPerLine) {
      const chunk = bytes.slice(offset, offset + bytesPerLine);

      const hex = Array.from(chunk)
        .map(b => b.toString(16).padStart(2, "0"))
        .join(" ");

      const paddedHex = hex.padEnd(bytesPerLine * 3 - 1, " ");

      const ascii = Array.from(chunk)
        .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
        .join("");

      lines.push(
        `${offset.toString(16).padStart(8, "0")}  ${paddedHex}  |${ascii}|`
      );
    }

    formattedHex.value = lines.join("\n");
  });
</script>

<style scoped>
  .hex-view {
    height: 100%;
    overflow: auto;
  }
</style>
