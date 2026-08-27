<template>
  <div class="fscreen flex flex-col">
    <div class="bg-base-200 flex justify-between gap-2 p-2">
      <div class="flex gap-2">
        <button
          class="btn btn-secondary btn-soft btn-xs"
          :disabled="!canUndo"
          @click="undo"
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
              d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L3.71 8.71C3.08 8.08 2 8.52 2 9.41V15c0 .55.45 1 1 1h5.59c.89 0 1.34-1.08.71-1.71l-1.91-1.91c1.39-1.16 3.16-1.88 5.12-1.88c3.16 0 5.89 1.84 7.19 4.5c.27.56.91.84 1.5.64c.71-.23 1.07-1.04.75-1.72C20.23 10.42 16.65 8 12.5 8"
            />
          </svg>
        </button>
        <button
          class="btn btn-info btn-soft btn-xs"
          :disabled="!canRedo"
          @click="redo"
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
              d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.16 0-7.74 2.42-9.44 5.93c-.32.67.04 1.47.75 1.71c.59.2 1.23-.08 1.5-.64c1.3-2.66 4.03-4.5 7.19-4.5c1.95 0 3.73.72 5.12 1.88l-1.91 1.91c-.63.63-.19 1.71.7 1.71H21c.55 0 1-.45 1-1V9.41c0-.89-1.08-1.34-1.71-.71z"
            />
          </svg>
        </button>
      </div>

      <div class="flex gap-2">
        <button
          class="btn btn-xs"
          :class="readOnly ? 'btn-primary' : ''"
          @click="readOnly = !readOnly"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
          >
            <path d="M0 0h1024v1024H0z" fill="none" />
            <path
              fill="currentColor"
              d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32M324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3l6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39m563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5l48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5M396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5"
            />
          </svg>
        </button>

        <button
          class="btn btn-primary btn-xs"
          :disabled="!isDirty"
          @click="save"
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
              d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zm9.125-3.875Q15 16.25 15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18t2.125-.875M7 10h7q.425 0 .713-.288T15 9V7q0-.425-.288-.712T14 6H7q-.425 0-.712.288T6 7v2q0 .425.288.713T7 10"
            />
          </svg>
        </button>
      </div>
    </div>

    <textarea
      :value="text"
      @input="onInput"
      class="fscreen textarea focus:outline-none p-2 text-sm resize-none border-0 overflow-auto whitespace-pre rounded-none"
      :readonly="readOnly"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      inputmode="text"
    ></textarea>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from "vue";

  const props = defineProps({
    textContent: {
      type: String,
      default: ""
    },
    defaultReadOnly: {
      type: Boolean
    }
  });

  const emit = defineEmits(["save"]);

  const text = ref(props.textContent);
  const readOnly = ref(props.defaultReadOnly);

  const history = ref([]);
  const future = ref([]);

  const MAX_HISTORY = 100;
  let internalChange = false;

  // Sync when parent changes the content
  watch(
    () => props.textContent,
    value => {
      if (value !== text.value) {
        internalChange = true;
        text.value = value;
        history.value = [];
        future.value = [];
        internalChange = false;
      }
    }
  );

  function onInput(e) {
    if (internalChange) return;

    const newValue = e.target.value;

    if (newValue === text.value) return;

    history.value.push(text.value);

    if (history.value.length > MAX_HISTORY) {
      history.value.shift();
    }

    future.value = [];
    text.value = newValue;
  }

  const isDirty = computed(() => text.value !== props.textContent);
  const canUndo = computed(() => history.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  function undo() {
    if (!history.value.length) return;

    internalChange = true;

    future.value.push(text.value);
    text.value = history.value.pop();

    internalChange = false;
  }

  function redo() {
    if (!future.value.length) return;

    internalChange = true;

    history.value.push(text.value);
    text.value = future.value.pop();

    internalChange = false;
  }

  function save() {
    emit("save", text.value);
  }
</script>
