<script setup>
  import { useSettings } from "@/stores/settings";

  const settings = useSettings();

  defineProps(["currentProtocol", "listLoading"]);
  const emit = defineEmits(["close", "upload", "location", "create", "sort"]);
</script>

<template>
  <div
    class="fixed inset-0 fscreen z-60 flex justify-end pt-28 pr-2"
    @click.self="emit('close')"
  >
    <div
      class="w-[60%] h-[60%] bg-base-100 border border-base-content/20 overflow-y-auto"
    >
      <div @click="emit('close')" class="p-2 flex justify-center">
        <button
          @click="emit('upload')"
          class="w-full btn btn-sm btn-primary btn-soft"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path stroke-linejoin="round" d="M12 15V2m0 0l3 3.5M12 2L9 5.5" />
              <path
                d="M8 22h8c2.828 0 4.243 0 5.121-.878C22 20.242 22 18.829 22 16v-1c0-2.828 0-4.242-.879-5.121c-.768-.768-1.946-.865-4.121-.877m-10 0c-2.175.012-3.353.109-4.121.877C2 10.758 2 12.172 2 15v1c0 2.829 0 4.243.879 5.122c.3.3.662.497 1.121.627"
              />
            </g>
          </svg>
          Upload
        </button>
      </div>

      <h1
        class="px-3 py-2 text-sm font-medium bg-primary/10 text-primary border-b border-base-content/10"
      >
        Location
      </h1>

      <div @click="emit('close')" class="p-2 flex flex-wrap justify-center">
        <button
          class="p-1 px-2 border border-primary-content/10 transition-colors"
          @click="emit('location', 'home')"
          :disabled="listLoading"
          :class="
            currentProtocol === 'home'
              ? 'bg-primary text-primary-content'
              : 'bg-primary/20 text-primary'
          "
        >
          HOME
        </button>
        <button
          class="p-1 px-2 border border-primary-content/10 transition-colors"
          @click="emit('location', 'os')"
          :disabled="listLoading"
          :class="
            currentProtocol === 'os'
              ? 'bg-primary text-primary-content'
              : 'bg-primary/20 text-primary'
          "
        >
          OS
        </button>
        <button
          class="p-1 px-2 border border-primary-content/10 transition-colors"
          @click="emit('location', 'root')"
          :disabled="listLoading"
          :class="
            currentProtocol === 'root'
              ? 'bg-error text-error-content'
              : 'bg-primary/20 text-primary'
          "
        >
          ROOT
        </button>
        <button
          class="p-1 px-2 border border-primary-content/10 transition-colors"
          @click="emit('location', 'osr')"
          :disabled="listLoading"
          :class="
            currentProtocol === 'osr'
              ? 'bg-error text-error-content'
              : 'bg-primary/20 text-primary'
          "
        >
          OSR
        </button>
      </div>

      <h1
        class="px-3 py-2 text-sm font-medium bg-primary/10 text-primary border-y border-base-content/10"
      >
        Create
      </h1>

      <div @click="emit('close')" class="p-2 flex justify-center gap-2">
        <button
          class="p-1 px-2 flex gap-1 items-center border border-primary-content/10 active:bg-primary transition-colors rounded"
          @click="emit('create', 'folder')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" d="M18 10h-5" opacity=".5" />
              <path
                d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"
              />
            </g>
          </svg>
          Folder
        </button>
        <button
          class="flex items-center gap-1 p-1 px-2 border border-primary-content/10 active:bg-primary transition-colors rounded"
          @click="emit('create', 'file')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="none">
              <path
                fill="currentColor"
                d="m15.393 4.054l-.502.557zm3.959 3.563l-.502.557zm2.302 2.537l-.685.305zM3.172 20.828l.53-.53zm17.656 0l-.53-.53zM14 21.25h-4v1.5h4zM2.75 14v-4h-1.5v4zm18.5-.437V14h1.5v-.437zM14.891 4.61l3.959 3.563l1.003-1.115l-3.958-3.563zm7.859 8.952c0-1.689.015-2.758-.41-3.714l-1.371.61c.266.598.281 1.283.281 3.104zm-3.9-5.389c1.353 1.218 1.853 1.688 2.119 2.285l1.37-.61c-.426-.957-1.23-1.66-2.486-2.79zM10.03 2.75c1.582 0 2.179.012 2.71.216l.538-1.4c-.852-.328-1.78-.316-3.248-.316zm5.865.746c-1.086-.977-1.765-1.604-2.617-1.93l-.537 1.4c.532.204.98.592 2.15 1.645zM10 21.25c-1.907 0-3.261-.002-4.29-.14c-1.005-.135-1.585-.389-2.008-.812l-1.06 1.06c.748.75 1.697 1.081 2.869 1.239c1.15.155 2.625.153 4.489.153zM1.25 14c0 1.864-.002 3.338.153 4.489c.158 1.172.49 2.121 1.238 2.87l1.06-1.06c-.422-.424-.676-1.004-.811-2.01c-.138-1.027-.14-2.382-.14-4.289zM14 22.75c1.864 0 3.338.002 4.489-.153c1.172-.158 2.121-.49 2.87-1.238l-1.06-1.06c-.424.422-1.004.676-2.01.811c-1.027.138-2.382.14-4.289.14zM21.25 14c0 1.907-.002 3.262-.14 4.29c-.135 1.005-.389 1.585-.812 2.008l1.06 1.06c.75-.748 1.081-1.697 1.239-2.869c.155-1.15.153-2.625.153-4.489zm-18.5-4c0-1.907.002-3.261.14-4.29c.135-1.005.389-1.585.812-2.008l-1.06-1.06c-.75.748-1.081 1.697-1.239 2.869C1.248 6.661 1.25 8.136 1.25 10zm7.28-8.75c-1.875 0-3.356-.002-4.511.153c-1.177.158-2.129.49-2.878 1.238l1.06 1.06c.424-.422 1.005-.676 2.017-.811c1.033-.138 2.395-.14 4.312-.14z"
              />
              <path
                stroke="currentColor"
                stroke-width="1.5"
                d="M13 2.5V5c0 2.357 0 3.536.732 4.268S15.643 10 18 10h4"
                opacity=".5"
              />
            </g>
          </svg>
          File
        </button>
      </div>

      <h1
        class="px-3 py-2 text-sm font-medium bg-primary/10 text-primary border-y border-base-content/10"
      >
        Sort
      </h1>

      <div class="p-2 flex flex-col gap-1 text-sm">
        <button
          class="flex items-center justify-between px-2 py-1.5 rounded"
          @click="emit('sort', 'name')"
          :class="{
            'bg-primary text-primary-content':
              settings.state.sort.type === 'name'
          }"
        >
          <span>Name</span>
          <div v-if="settings.state.sort.type === 'name'">
            <span v-if="settings.state.sort.asc">↑</span>
            <span v-else>↓</span>
          </div>
        </button>

        <button
          class="flex items-center justify-between px-2 py-1.5 rounded"
          @click="emit('sort', 'modified')"
          :class="{
            'bg-primary text-primary-content':
              settings.state.sort.type === 'modified'
          }"
        >
          <span>Modified</span>
          <div v-if="settings.state.sort.type === 'modified'">
            <span v-if="settings.state.sort.asc">↑</span>
            <span v-else>↓</span>
          </div>
        </button>

        <button
          class="flex items-center justify-between px-2 py-1.5 rounded"
          @click="emit('sort', 'size')"
          :class="{
            'bg-primary text-primary-content':
              settings.state.sort.type === 'size'
          }"
        >
          <span>Size</span>
          <div v-if="settings.state.sort.type === 'size'">
            <span v-if="settings.state.sort.asc">↑</span>
            <span v-else>↓</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
