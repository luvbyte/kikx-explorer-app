<script setup>
  import THEMES from "@/api/themes";
  import { VERSION } from "@/api/config";

  import { useSettings } from "@/stores/settings";

  const settings = useSettings();

  const emit = defineEmits(["close"]);

  const setTheme = name => {
    settings.state.theme = name;
  };
</script>

<template>
  <div
    @click.self="emit('close')"
    class="fixed inset-0 fscreen z-60 flex justify-start"
  >
    <div
      class="w-[70%] h-full shadow-lg border-r border-base-content/20 flex flex-col items-center bg-base-100"
    >
      <!-- Body -->
      <div class="pt-4 pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 16 16"
        >
          <path d="M0 0h16v16H0z" fill="none" />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v3h.5a.5.5 0 0 1 .5.5v6.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H3zM3 5v2.5h10v-1H7.5a.5.5 0 0 1-.354-.146L5.793 5zm9 .5V3H4v1h2a.5.5 0 0 1 .354.146L7.707 5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <h1>KIKX - Explorer</h1>

      <h1 class="divider m-2 uppercase text-sm">
        Theme ☷ {{ settings.state.theme }}
      </h1>

      <!-- themes -->
      <div class="flex flex-col text-xs w-full px-2">
        <div
          class="rounded py-1 grid grid-rows-2 grid-flow-col space-x-1 space-y-1 overflow-x-auto scrollbar-hide"
        >
          <div
            v-for="theme in THEMES"
            :data-theme="theme"
            @click="setTheme(theme)"
            class="w-12 h-12 border-2 shrink-0 rounded-full base-border flex items-center justify-center gap-1 p-1 active:border-base-content"
            :class="
              settings.state.theme === theme
                ? 'border-base-content'
                : 'border-base-content/20'
            "
          >
            <div class="w-1 h-4 bg-primary rounded"></div>
            <div class="w-1 h-4 bg-secondary rounded"></div>
            <div class="w-1 h-4 bg-info rounded"></div>
            <div class="w-1 h-4 bg-primary rounded"></div>
          </div>
        </div>
      </div>

      <div class="divider text-sm m-2">v{{ VERSION }}</div>

      <div class="flex-1"></div>

      <div class="py-4 w-full">
        <div
          class="divider m-0 text-sm flex items-center gap-1 justify-center my-4"
        >
          <span class="badge badge-sm badge-primary font-semibold font-heading"
            >Explorer</span
          >
          ツ
          <span
            class="badge badge-sm badge-secondary font-semibold font-heading"
            >luvbyte ᥫ᭡</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
