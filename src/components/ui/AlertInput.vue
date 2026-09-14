<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    default: {
      type: String,
      required: false
    },
    autoSelect: {
      type: Boolean,
      required: false
    }
  });
  const emit = defineEmits(["onResponse"]);

  const inputRef = ref(null);
  const name = ref(props.default || "Untitled");


  onMounted(() => {
    inputRef.value?.focus();
    if (props.autoSelect) inputRef.value?.select();
  });
</script>

<template>
  <div class="fixed inset-0 z-80 flex items-center justify-center text-white">
    <div
      class="bg-base-100 text-base-content rounded-lg shadow-lg w-[90vw] max-w-md"
    >
      <h1
        class="p-2 text-lg font-semibold bg-primary text-primary-content rounded-t-lg"
      >
        {{ title }}
      </h1>

      <div class="border-x border-b border-base-content/20">
        <div class="p-4">
          <input
            ref="inputRef"
            v-model="name"
            class="w-full input input-sm focus:outline-none"
          />
        </div>

        <div class="p-4 flex justify-end gap-2 bg-base-100 rounded-b-lg">
          <button class="btn btn-sm" @click="emit('onResponse', false)">
            Cancel
          </button>

          <button
            class="btn btn-sm btn-success min-w-18"
            @click="emit('onResponse', name)"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
