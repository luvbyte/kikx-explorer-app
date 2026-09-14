import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

import { defaultTheme } from "@/api/config";

export const useSettings = defineStore("settings", () => {
  const state = reactive({
    // grid / list
    iconsView: "list",
    showHiddenFiles: false,
    // Show loading animation
    showLoadCircle: false,
    // Open file / folder on create
    openOnCreate: false,
    highlightCode: true,
    readOnly: false,
    hideExtension: false,
    // string
    theme: defaultTheme,
    // type: [name, size, modified]
    sort: {
      type: "name",
      asc: true
    },
    // bookmarks: [{proto: string, path: string}]
    bookmarks: []
  });

  return {
    state
  };
});
