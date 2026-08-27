<script setup>
  const emit = defineEmits(["reset", "copy", "move"]);
</script>

<template>
  <div class="fixed right-4 bottom-4 p-2 flex flex-col items-center gap-2">
    <button
      class="w-12 h-12 bg-error rounded-full flex justify-center items-center"
      @click="emit('reset')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
        />
      </svg>
    </button>
    <button
      class="w-16 h-16 bg-primary rounded-full flex justify-center items-center"
      @click="emit('copy')"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m7 18H5V4h2v3h10V4h2z"
          />
        </svg>
    </button>
    <button
      class="w-16 h-16 bg-primary rounded-full flex justify-center items-center"
      @click="emit('move')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 32 32"
      >
        <path d="M0 0h32v32H0z" fill="none" />
        <path
          fill="currentColor"
          d="m25 11l-1.41 1.41L26.17 15H17V5.83l2.59 2.58L21 7l-5-5l-5 5l1.41 1.41L15 5.83V15H5.83l2.58-2.59L7 11l-5 5l5 5l1.41-1.41L5.83 17H15v9.17l-2.59-2.58L11 25l5 5l5-5l-1.41-1.41L17 26.17V17h9.17l-2.58 2.59L25 21l5-5z"
        />
      </svg>
    </button>
  </div>
</template>
