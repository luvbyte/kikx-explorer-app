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
    openOnCreate: true,
    highlightCode: true,
    readOnly: false,
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

  // Alert messages list
  const alertsStack = ref([]);

  // Show alert
  function alert(message, type = "info") {
    alertsStack.value.push({
      message,
      type
    });
  }

  // Get top alert message
  function getAlertMessage() {
    return alertsStack.value.at(0);
  }

  // Close top alert
  function closeAlert(index) {
    alertsStack.value.splice(index, 1);
  }

  return {
    state,
    alertsStack,
    getAlertMessage,
    alert,
    closeAlert
  };
});
