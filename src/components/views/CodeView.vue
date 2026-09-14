<template>
  <div class="h-full overflow-auto bg-base-100 text-base-content">
    <pre class="m-0 p-3 text-sm"><code
        ref="codeEl"
        :class="language ? `language-${language}` : ''"
      >{{ content }}</code>
    </pre>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, nextTick, computed } from "vue";
  import hljs from "highlight.js/lib/core";

  import javascript from "highlight.js/lib/languages/javascript";
  import typescript from "highlight.js/lib/languages/typescript";
  import json from "highlight.js/lib/languages/json";
  import xml from "highlight.js/lib/languages/xml";
  import css from "highlight.js/lib/languages/css";
  import bash from "highlight.js/lib/languages/bash";
  import python from "highlight.js/lib/languages/python";

  import "highlight.js/styles/github-dark.css";

  // Register only languages you need
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("html", xml);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("python", python);

  const props = defineProps({
    content: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: ""
    }
  });

  const languageMap = {
    ".js": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",

    ".ts": "typescript",

    ".json": "json",

    ".html": "html",
    ".htm": "html",
    ".vue": "html",

    ".xml": "xml",

    ".css": "css",
    ".scss": "css",

    ".sh": "bash",

    ".py": "python"
  };

  // const codeLanguage = computed(() => languageMap[extension.value] || "");

  const codeEl = ref();

  async function highlight() {
    await nextTick();

    if (!codeEl.value) return;

    if (props.language) {
      codeEl.value.innerHTML = hljs.highlight(props.content, {
        language: languageMap[props.language] || "",
        ignoreIllegals: true
      }).value;
    } else {
      codeEl.value.innerHTML = hljs.highlightAuto(props.content).value;
    }
  }

  onMounted(highlight);

  watch(() => [props.content, props.language], highlight);
</script>
