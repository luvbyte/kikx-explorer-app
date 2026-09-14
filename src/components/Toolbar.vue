<script setup>
  import { useSettings } from "@/stores/settings";

  const settings = useSettings();
  
  defineProps({
    listLoading: {
      type: Boolean,
      required: true
    },
    multiSelectMode: {
      type: Boolean,
      required: true
    },
    showRightMenu: {
      type: Boolean,
      required: true
    },
    isCurrentPathBookmarked: {
      type: Boolean,
      required: true
    }
  })
  const emit = defineEmits([
    "goUp",
    "goBack",
    "goForward",
    "update",
    "multi",
    "menu",
    "bookmark"
  ]);
</script>

<template>
  <!-- Tools -->
  <div
    class="flex justify-between items-center bg-primary/20 text-primary-content"
  >
    <!-- Nav buttons -->
    <div class="flex items-center bg-primary/40 text-primary-content">
      <button
        @click="emit('goUp')"
        class="p-1 active:bg-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m10 4l.707-.707L10 2.586l-.707.707zm8 17a1 1 0 1 0 0-2zM15.707 8.293l-5-5l-1.414 1.414l5 5zm-6.414-5l-5 5l1.414 1.414l5-5zM9 4v10h2V4zm7 17h2v-2h-2zm-7-7a7 7 0 0 0 7 7v-2a5 5 0 0 1-5-5z"
          />
        </svg>
      </button>
      <button
        @click="emit('goBack')"
        class="p-1 active:bg-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none">
            <path
              fill="currentColor"
              d="M20 12.75a.75.75 0 0 0 0-1.5zm0-1.5H4v1.5h16z"
              opacity=".5"
            />
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m10 6l-6 6l6 6"
            />
          </g>
        </svg>
      </button>
      <button
        @click="emit('goForward')"
        class="p-1 active:bg-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none">
            <path
              fill="currentColor"
              d="M4 11.25a.75.75 0 0 0 0 1.5zm0 1.5h16v-1.5H4z"
              opacity=".5"
            />
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m14 6l6 6l-6 6"
            />
          </g>
        </svg>
      </button>
      <button
        @click="emit('update')"
        :disabled="listLoading"
        :class="{ 'rotate-item': listLoading }"
        class="p-1 active:enabled:bg-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12.079 2.25c-4.794 0-8.734 3.663-9.118 8.333H2a.75.75 0 0 0-.528 1.283l1.68 1.666a.75.75 0 0 0 1.056 0l1.68-1.666a.75.75 0 0 0-.528-1.283h-.893c.38-3.831 3.638-6.833 7.612-6.833a7.66 7.66 0 0 1 6.537 3.643a.75.75 0 1 0 1.277-.786A9.16 9.16 0 0 0 12.08 2.25m8.761 8.217a.75.75 0 0 0-1.054 0L18.1 12.133a.75.75 0 0 0 .527 1.284h.899c-.382 3.83-3.651 6.833-7.644 6.833a7.7 7.7 0 0 1-6.565-3.644a.75.75 0 1 0-1.277.788a9.2 9.2 0 0 0 7.842 4.356c4.808 0 8.765-3.66 9.15-8.333H22a.75.75 0 0 0 .527-1.284z"
          />
        </svg>
      </button>
    </div>
    <!-- right buttons -->
    <div class="flex items-center bg-primary/10 text-primary-content">
      <button
        @click="emit('multi')"
        class="p-1 transition-colors"
        :class="{
          'bg-primary text-primary-content': multiSelectMode
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 16 16"
        >
          <path d="M0 0h16v16H0z" fill="none" />
          <path
            fill="currentColor"
            d="M5.03 1.97a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06 0l-1-1a.75.75 0 0 1 1.06-1.06l.47.47l1.47-1.47a.75.75 0 0 1 1.06 0M6 3.75A.75.75 0 0 1 6.75 3h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 6 3.75M6 8a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 6 8m-.97 2.97a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06 0l-1-1a.75.75 0 1 1 1.06-1.06l.47.47l1.47-1.47a.75.75 0 0 1 1.06 0M6 12.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75"
          />
        </svg>
      </button>

      <button
        class="p-1 transition-colors"
        :class="{
          'bg-primary/60 text-primary-content':
            settings.state.iconsView === 'list'
        }"
        @click="settings.state.iconsView = 'list'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M3.25 7A.75.75 0 0 1 4 6.25h16a.75.75 0 0 1 0 1.5H4A.75.75 0 0 1 3.25 7"
            clip-rule="evenodd"
          />
          <path
            fill="currentColor"
            d="M3.25 12a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75"
            opacity=".7"
          />
          <path
            fill="currentColor"
            d="M3.25 17a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75"
            opacity=".4"
          />
        </svg>
      </button>

      <button
        class="p-1 transition-colors"
        :class="{
          'bg-primary/60 text-primary-content':
            settings.state.iconsView === 'grid'
        }"
        @click="settings.state.iconsView = 'grid'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <rect
            width="8"
            height="8"
            x="3"
            y="3"
            fill="currentColor"
            rx="1.5"
            ry="1.5"
          />
          <rect
            width="8"
            height="8"
            x="13"
            y="3"
            fill="currentColor"
            rx="1.5"
            ry="1.5"
          />
          <rect
            width="8"
            height="8"
            x="3"
            y="13"
            fill="currentColor"
            rx="1.5"
            ry="1.5"
          />
          <rect
            width="8"
            height="8"
            x="13"
            y="13"
            fill="currentColor"
            rx="1.5"
            ry="1.5"
          />
        </svg>
      </button>
      <button
        @click="emit('bookmark')"
        class="p-1 transition-colors"
        :class="{ 'bg-primary': isCurrentPathBookmarked }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              d="M21 16.09v-4.992c0-4.29 0-6.433-1.318-7.766C18.364 2 16.242 2 12 2S5.636 2 4.318 3.332S3 6.81 3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321Z"
            />
            <path stroke-linecap="round" d="M15 6H9" opacity=".5" />
          </g>
        </svg>
      </button>

      <button
        @click="emit('menu')"
        class="p-1 text-primary-content transition-colors"
        :class="{ 'bg-primary': showRightMenu }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path
              d="M18 4H6c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 0 0-1.093 1.093C2 5.9 2 6.6 2 8s0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092C3.9 12 4.6 12 6 12h12c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.092-1.092C22 10.1 22 9.4 22 8s0-2.1-.273-2.635a2.5 2.5 0 0 0-1.092-1.093C20.1 4 19.4 4 18 4"
            />
            <path d="M18 7s-1.473 2-2 2s-2-2-2-2M2 16h12M2 20h12" />
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>
