<template>
  <video ref="video" playsinline :poster="blackPoster" class="fscreen">
    <source :src="src" />
  </video>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, ref } from "vue";
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
  let isLandscape = false;

  const handleMetadata = () => {
    isLandscape = video.value.videoWidth > video.value.videoHeight;
  };

  const enterFullscreen = async () => {
    if (!isLandscape) return;

    try {
      await screen.orientation.lock("landscape");
    } catch (error) {
      // Orientation locking is not supported by this browser
      console.log("Orientation lock not supported:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (screen.orientation?.unlock) {
        screen.orientation.unlock();
      }
    } catch (error) {
      console.log("Could not unlock orientation:", error);
    }
  };

  onMounted(() => {
    video.value.addEventListener("loadedmetadata", handleMetadata);

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
        "captions",
        "settings",
        "pip",
        "fullscreen"
      ]
    });

    player.on("enterfullscreen", enterFullscreen);
    player.on("exitfullscreen", exitFullscreen);

    player.play().catch(() => {});
  });

  onBeforeUnmount(() => {
    video.value?.removeEventListener("loadedmetadata", handleMetadata);

    try {
      screen.orientation?.unlock();
    } catch {}

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
