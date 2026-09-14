<template>
  <div class="fixed inset-0 fscreen flex flex-col bg-base-100">
    <!-- Top Bar -->
    <div
      class="p-2 shadow-lg flex items-center justify-between bg-primary text-primary-content"
    >
      <h1 class="font-semibold">
        Selected {{ files.length }} file{{ files.length !== 1 ? "s" : "" }}
      </h1>

      <button @click="emit('close')" class="p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"
          />
        </svg>
      </button>
    </div>
    <!-- Upload Button -->
    <div class="flex items-center gap-2 p-2">
      <!-- Images -->
      <label
        for="image-upload"
        class="btn btn-primary btn-sm flex-1 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm1-2h12l-3.75-5l-3 4L9 13zm-1 2V5z"
          />
        </svg>
        Images
      </label>

      <!-- Documents -->
      <label
        for="doc-upload"
        class="btn btn-secondary btn-sm flex-1 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z"
            />
            <path stroke-linecap="round" d="M8 10h8m-8 4h5" />
          </g>
        </svg>
        Doc
      </label>

      <button
        @click="showConfirm = true"
        :disabled="files.length <= 0"
        class="btn btn-sm btn-info flex-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path
              d="M17 9.002c2.175.012 3.353.109 4.121.877C22 10.758 22 12.172 22 15v1c0 2.829 0 4.243-.879 5.122C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.878C2 20.242 2 18.829 2 16v-1c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877"
              opacity=".5"
            />
            <path stroke-linejoin="round" d="M12 15V2m0 0l3 3.5M12 2L9 5.5" />
          </g>
        </svg>

        Upload
      </button>
      <button
        @click="removeAll"
        :disabled="files.length <= 0"
        class="btn btn-sm btn-error flex-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M4 17q-.425 0-.712-.288T3 16t.288-.712T4 15h12q.425 0 .713.288T17 16t-.288.713T16 17zm2-4q-.425 0-.712-.288T5 12t.288-.712T6 11h12q.425 0 .713.288T19 12t-.288.713T18 13zm2-4q-.425 0-.712-.288T7 8t.288-.712T8 7h12q.425 0 .713.288T21 8t-.288.713T20 9z"
          />
        </svg>
        Clear
      </button>

      <input
        id="image-upload"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleImages"
      />

      <input
        id="doc-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        class="hidden"
        @change="handleDocuments"
      />
    </div>

    <!-- Image Grid -->
    <div class="p-2 flex-1 overflow-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="relative border border-base-content/20 rounded-lg overflow-hidden bg-base-200"
        >
          <button
            class="btn btn-xs btn-circle btn-error absolute top-1 right-1 z-10"
            @click="removeFile(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"
              />
            </svg>
          </button>

          <!-- Image Preview -->
          <template v-if="file.type === 'image'">
            <img
              :src="file.preview"
              :alt="file.name"
              class="w-full h-32 object-cover"
            />
          </template>

          <!-- Document Preview -->
          <template v-else>
            <div class="h-32 flex flex-col items-center justify-center p-2">
              <span class="text-4xl">📄</span>
            </div>
          </template>

          <div class="p-2">
            <p class="text-xs truncate">{{ file.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="uploading" class="fixed inset-0 fscreen z-90">
        <Loading label="Uploading" />
      </div>
    </Transition>

    <!-- Confirm -->
    <Transition name="fade-scale">
      <AlertConfirm
        v-if="showConfirm"
        :message="`Do u want to upload ${files.length} files`"
        @onResponse="uploadFiles"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onBeforeUnmount } from "vue";

  import AlertConfirm from "@/components/ui/AlertConfirm.vue";
  import Loading from "@/components/Loading.vue";

  import { app, fs } from "@/api";
  import { useErrorStore } from "@/stores/error";

  const errors = useErrorStore();

  const showConfirm = ref(false);
  
  const props = defineProps({
    currentPath: String,
    required: true
  })
  const emit = defineEmits(["close", "update"]);

  const files = ref([]);
  const uploading = ref(false);

  const handleImages = e => {
    const items = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      type: "image",
      preview: URL.createObjectURL(file)
    }));

    files.value.push(...items);
    e.target.value = "";
  };

  const handleDocuments = e => {
    const items = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      type: "document",
      size: file.size
    }));

    files.value.push(...items);
    e.target.value = "";
  };

  const removeFile = index => {
    if (files.value[index].preview) {
      URL.revokeObjectURL(files.value[index].preview);
    }

    files.value.splice(index, 1);
  };

  const removeAll = () => {
    files.value.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    files.value = [];
  };

  async function uploadFiles(yes) {
    showConfirm.value = false;

    if (files.value.length <= 0) return;

    if (!yes) return;

    // Upload files
    uploading.value = true;

    const { data, error } = await fs.uploadFiles(
      files.value.map(item => item.file),
      props.currentPath
    );
    removeAll();

    uploading.value = false;

    if (error) {
      app.system.alert("Error uploading files", { type: "error" });
      errors.raiseError(error.detail || "Error uploading files", "error");
      return;
    }

    app.system.alert("Files uploaded succesfully");

    emit("update");
    emit("close");
  }
</script>
