<script setup>
  const emit = defineEmits(["l", "r"]);
</script>

<template>
  <!-- Header -->
  <div
    class="flex justify-between p-2 items-center bg-primary text-primary-content"
  >
    <!-- Title -->
    <div @click="emit('l')" class="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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

      <h1 class="text-lg">Explorer</h1>
    </div>
    <!-- Right Sidebar toggle button -->
    <button @click="emit('r')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
        />
      </svg>
    </button>
  </div>
</template>
