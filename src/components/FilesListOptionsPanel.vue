<script setup>
  import { reactive, watch } from "vue";

  const props = defineProps({
    options: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["apply", "reset", "close"]);

  const form = reactive({
    search: "",
    extensions: "",
    filter: ""
  });

  watch(
    () => props.options,
    options => {
      form.search = options.search || "";
      form.extensions = options.extensions || "";
      form.filter = options.filter || "";
    },
    {
      immediate: true,
      deep: true
    }
  );

  function apply() {
    emit("apply", {
      search: form.search.trim(),
      extensions: form.extensions.trim(),
      filter: form.filter
    });

    emit("close");
  }

  function reset() {
    form.search = "";
    form.extensions = "";
    form.filter = "";

    emit("reset");
  }
</script>

<template>
  <div class="px-3 py-2 bg-base-200 border-b border-base-300">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative flex-1">
          <input
            v-model="form.search"
            type="text"
            placeholder="Search..."
            class="input input-sm input-bordered w-full pr-8 focus:outline-none placeholder:opacity-60"
          />

          <button
            v-if="form.search"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 opacity-50"
            @click="form.search = ''"
          >
            ×
          </button>
        </div>

        <!-- Filter -->
        <select
          v-model="form.filter"
          class="select select-sm select-bordered w-auto focus:outline-none placeholder:opacity-60"
        >
          <option value="">All</option>
          <option value="files">Files</option>
          <option value="directories">Folders</option>
          <option value="images">Images</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <!-- Extensions -->
        <input
          v-model="form.extensions"
          type="text"
          placeholder="ex: png,jpg"
          class="w-full input input-sm input-bordered focus:outline-none placeholder:opacity-60"
        />

        <!-- Reset -->
        <button
          v-if="form.search || form.extensions || form.filter"
          class="btn btn-sm btn-error"
          @click="reset"
        >
          Reset
        </button>

        <!-- Apply -->
        <button class="btn btn-sm btn-primary" @click="apply">Apply</button>
      </div>
    </div>
  </div>
</template>
