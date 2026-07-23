<template>
  <video ref="video" playsinline :poster="blackPoster" class="fscreen">
    <source :src="src" />
  </video>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import Plyr from "plyr";
  import "plyr/dist/plyr.css";

  import blackPoster from "@/assets/cover.png";

  defineProps({
    src: {
      type: String,
      required: true
    }
  });

  const video = ref(null);
  let player = null;

  onMounted(() => {
    player = new Plyr(video.value, {
      autoplay: true,
      muted: false,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "fullscreen"
      ]
    });

    player.play().catch(() => {});
  });

  onBeforeUnmount(() => {
    player?.destroy();
  });
</script>

<style>
  .plyr {
    width: 100%;
    height: 100%;
  }

  .plyr video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
