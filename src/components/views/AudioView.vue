<template>
  <div class="h-full flex items-center justify-center p-6">
    <div class="w-full max-w-xl">
      <audio ref="audio">
        <source :src="src" />
      </audio>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import Plyr from "plyr";
  import "plyr/dist/plyr.css";

  defineProps({
    src: {
      type: String,
      required: true
    }
  });

  const audio = ref(null);
  let player = null;

  onMounted(() => {
    player = new Plyr(audio.value, {
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings"
      ]
    });
  });

  onBeforeUnmount(() => {
    player?.destroy();
  });
</script>

<style>
  .plyr {
    width: 100%;
  }
</style>
