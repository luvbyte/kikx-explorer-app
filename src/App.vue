<script setup>
  import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeMount,
    nextTick
  } from "vue";
  import { watchDebounced } from "@vueuse/core";

  import { app, fs, appConfig } from "@/api";

  import GridView from "@/components/views/GridView.vue";
  import ListView from "@/components/views/ListView.vue";
  import FileView from "@/components/views/FileView.vue";
  import FileContextMenu from "@/components/FileContextMenu.vue";
  import RightSidebar from "@/components/RightSidebar.vue";
  import LeftSidebar from "@/components/LeftSidebar.vue";
  import SelectedPathsInfo from "@/components/SelectedPathsInfo.vue";
  import Loading from "@/components/Loading.vue";
  import FilesUploader from "@/components/FilesUploader.vue";
  import Toolbar from "@/components/Toolbar.vue";
  import Header from "@/components/Header.vue";
  import Menubox from "@/components/Menubox.vue";
  import PasteActions from "@/components/PasteActions.vue";

  import Alert from "@/components/ui/Alert.vue";
  import AlertInput from "@/components/ui/AlertInput.vue";

  import { useSettings } from "@/stores/settings";
  import { useErrorStore } from "@/stores/error";

  const settings = useSettings();
  const errors = useErrorStore();

  // Flags
  let changingProtocolOnly = false;
  // Loading States
  const initLoadState = ref(true);
  const listLoading = ref(false);

  // home / os / root / osr
  const currentProtocol = ref("home");
  const currentPath = ref("");
  // Path
  const pathContainer = ref(null);
  const pathSearchInput = ref("");

  const offset = ref(0);
  const limit = ref(50);
  const hasMore = ref(false);
  // CurrentPath files list
  const filesList = ref([]);
  // Copy files list
  const copyFilesList = ref([]);

  // Multi select
  const multiSelectMode = ref(false);
  const selectedPaths = ref([]);

  // Panels: uploader, sidebar
  const showUploader = ref(false);
  const showRSidebar = ref(false);
  const showLSidebar = ref(false);
  // Menu, Path search
  const showRightMenu = ref(false);
  const showPathSearch = ref(false);

  const currentAlert = ref(null);

  // Active File (preview): path {} / null
  const activeFile = ref(null);
  // Show file context menu
  const fileContextMenu = ref(null);
  // string (file / folder) / null
  const createPath = ref(null);

  // History
  const history = [];
  let historyIndex = -1;
  let isNavigatingHistory = false;

  // Files List scrolling container
  const listContainer = ref(null);

  // On list scrolling
  function onScroll(e) {
    const el = e.target;

    // Load more when within 800px of the bottom
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 800) {
      loadMore();
    }
  }

  // ------------------------- Computed

  // Filter files list with options
  const visibleFiles = computed(() =>
    filesList.value.filter(
      file => settings.state.showHiddenFiles || !file.name?.startsWith(".")
    )
  );

  // Check if currentPath is bookmarked
  const isCurrentPathBookmarked = computed(() => {
    return settings.state.bookmarks.some(
      bookmark =>
        bookmark.proto === currentProtocol.value &&
        bookmark.path === currentPath.value
    );
  });

  // ------------------------- Path

  // Get kikxpath using proto, path
  const getFinalPath = () => {
    let path = currentPath.value;
    let proto = currentProtocol.value;

    return `${proto}://${path.startsWith("/") ? path.slice(1) : path}`;
  };

  // Get merged path with kikx
  const getFilePath = name => {
    const path = currentPath.value?.replace(/^\/|\/$/g, "") ?? "";

    return `${currentProtocol.value}://${path ? `${path}/` : ""}${name}`;
  };

  // Get path object in files list
  function getPathInList(name) {
    return filesList.value.find(item => item.name === name) ?? null;
  }

  // Update current path list
  async function updateCurrentPathList() {
    listLoading.value = true;

    const res = await fs.listFilesLimit(getFinalPath(), {
      offset: offset.value,
      limit: limit.value,
      sort: settings.state.sort.type,
      asc: settings.state.sort.asc
    });

    console.log(res);

    if (res.data) {
      filesList.value = res.data.files.map(item => ({
        ...item,
        kikxpath: getFilePath(item.name)
      }));

      hasMore.value = res.data.has_more;
    } else {
      errors.raiseError(res.error.detail || "Error loading files", "error");
    }

    listLoading.value = false;
  }

  async function reloadDirectory() {
    offset.value = 0;
    filesList.value = [];

    await updateCurrentPathList();

    await nextTick();
    scrollToRight();
  }

  // Load more files if present
  let loadingMore = false;

  async function loadMore() {
    if (loadingMore || !hasMore.value) return;

    loadingMore = true;

    try {
      offset.value += limit.value;

      const res = await fs.listFilesLimit(getFinalPath(), {
        offset: offset.value,
        limit: limit.value,
        sort: settings.state.sort.type,
        asc: settings.state.sort.asc
      });

      if (res.data) {
        filesList.value.push(
          ...res.data.files.map(item => ({
            ...item,
            kikxpath: getFilePath(item.name)
          }))
        );

        hasMore.value = res.data.has_more;
      } else {
        errors.raiseError(res.error.detail || "Error loading files", "error");
      }
    } finally {
      loadingMore = false;
    }
  }

  // Switch Protocol without autochanging path
  function selectProtocol(proto) {
    changingProtocolOnly = true;

    currentProtocol.value = proto;
    currentPath.value = "";

    nextTick(() => {
      changingProtocolOnly = false;
    });
  }

  // Navigate to path
  function navigate(proto, path = "") {
    selectProtocol(proto);
    currentPath.value = path;
  }

  function changeProtocol(proto) {
    currentProtocol.value = proto;
  }

  // Reset path
  function resetPath() {
    currentPath.value = "";
  }

  function toggleCreatePath(name) {
    if (!["file", "folder"].includes(name)) return;

    createPath.value = name;
  }

  // Set sorting
  async function setSort(type) {
    if (settings.state.sort.type === type) {
      settings.state.sort.asc = !settings.state.sort.asc;
    } else {
      settings.state.sort.type = type;
      settings.state.sort.asc = true;
    }

    await reloadDirectory();
  }

  // Replace path click
  async function replacePath(name) {
    if (listLoading.value) return;

    const parts = currentPath.value.split("/");

    const index = parts.indexOf(name);

    if (index !== -1) {
      currentPath.value = parts.slice(0, index + 1).join("/");
    }
  }

  // Create Path
  async function onCreatePath(name) {
    const pathType = createPath.value;
    createPath.value = null;

    if (!name) return;

    const res =
      pathType === "file"
        ? await fs.createFile(getFilePath(name))
        : await fs.createDirectory(getFilePath(name));

    if (res.error) {
      errors.raiseError(res.error.detail || "Error creating path", "error");
      return;
    }
    await reloadDirectory();

    // Option if option enabled
    if (!settings.state.openOnCreate) return;

    const path = getPathInList(name);

    if (path) onPathClick(path);
  }

  // Navigate to path using pathInput
  async function navigateToPath() {
    if (listLoading.value) return;

    const value = pathSearchInput.value.trim();
    const match = value.match(/^([a-zA-Z0-9_-]+):\/\/(.*)$/);

    if (!match) return;

    currentProtocol.value = match[1];
    currentPath.value = match[2].replace(/^\/+/, "");
  }

  // ------------------------- File

  // Download file
  async function downloadFile(path) {
    if (path.directory) return;

    const res = await fs.readFile(getFilePath(path.name));

    if (res.error) {
      errors.raiseError(
        res.error.detail || "Error downloading file",
        "error"
      );
      return;
    }

    const blob = res.data;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${path.name}${path.suffix}`; // filename shown to user

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  // Rename file
  async function renameFile(path, new_name) {
    const src = getFilePath(path.name);
    const dest = new_name.split("/").pop();

    if (path.name === dest) return;

    const res = await fs.rename(src, dest);
    if (res.error) {
      errors.raiseError(res.error.detail || "Error renaming", "error");
      return;
    }

    await reloadDirectory();
  }

  // Share file path
  async function shareFile(path) {
    await app.system.invoke("action", {
      name: "share",
      options: {
        item: getFilePath(path.name)
      }
    });
  }

  async function setWallpaper(file) {
    if (!file.image_type && file.suffix !== ".mp4") {
      errors.raiseError("Unsupported wallpaper", "error");
      return;
    }

    const tempDir = "images/bg/.active_bg";
    const tempFile = `${tempDir}/${file.name}`;

    // Clear previous active wallpaper
    await fs.deleteDirectory(`home://share/${tempDir}`).catch(() => {});

    const { error } = await fs.copyFile(
      getFilePath(file.name),
      `home://share/${tempFile}`,
      true // overwrite
    );

    if (error) {
      errors.raiseError("Error setting wallpaper", "error");
      return;
    }

    await app.system.invoke("action", {
      name: "set-wallpaper",
      options: {
        url: `/files/${tempFile}`
      }
    });
  }

  // ------------------------- Bookmark

  // Toggle current path bookmark
  function toggleBookmarkCurrentPath() {
    if (isCurrentPathBookmarked.value) {
      removeCurrentPathBookmark();
    } else {
      settings.state.bookmarks.push({
        proto: currentProtocol.value,
        path: currentPath.value
      });
    }
  }

  // Open bookmark path
  function selectBookmarkPath(bookmark) {
    if (listLoading.value) return;

    showRSidebar.value = false;

    navigate(bookmark.proto, bookmark.path);

    //currentProtocol.value = bookmark.proto;
    //currentPath.value = bookmark.path;

    // console.log(bookmark, currentPath.value);
  }

  // Remove bookmark path
  function removeBookmark(bookmark) {
    const index = settings.state.bookmarks.findIndex(
      b => b.proto === bookmark.proto && b.path === bookmark.path
    );

    if (index !== -1) {
      settings.state.bookmarks.splice(index, 1);
    }
  }

  // Remove current bookmark path
  function removeCurrentPathBookmark() {
    removeBookmark({
      proto: currentProtocol.value,
      path: currentPath.value
    });
  }

  // ------------------------- UI

  // Scroll Bar to right
  function scrollToRight() {
    pathContainer.value?.scrollTo({
      left: pathContainer.value.scrollWidth,
      behavior: "smooth"
    });
  }

  // ------------------------- Multi Path

  // Toggle multi select
  function toggleMultiSelectMode() {
    multiSelectMode.value = !multiSelectMode.value;
    selectedPaths.value.length = 0;
  }

  // Toggle select all
  function toggleSelectAll() {
    if (!multiSelectMode.value) return;

    const allSelected =
      selectedPaths.value.length === visibleFiles.value.length;

    selectedPaths.value = allSelected ? [] : [...visibleFiles.value];
  }

  // Delete selected files
  async function deleteSelectedFiles() {
    const paths = selectedPaths.value.map(path => getFilePath(path.name));
    selectedPaths.value.length = 0;

    // Paths
    const res = await fs.deleteList(paths);

    if (res.error) {
      errors.raiseError(res.error.detail || "Error deleting files", "error");
    } else {
      await reloadDirectory();
    }
  }

  // Copy selected files to currentPath
  async function copyFiles() {
    const paths = copyFilesList.value.map(item => item.kikxpath);
    const dest = getFinalPath();

    console.log(paths, dest);

    const res = await fs.copy(paths, dest);
    if (res.error) {
      errors.raiseError(res.error.detail || "Error copying files", "error");
    } else {
      await reloadDirectory();
    }

    copyFilesList.value.length = 0;
  }

  // Copy selectedPaths to copyFilesList
  function updateCopyFilesList() {
    copyFilesList.value = selectedPaths.value.slice();

    selectedPaths.value = [];
    multiSelectMode.value = false;
  }

  // ------------------------- Click events

  // On path click
  function onPathClick(path) {
    if (multiSelectMode.value) {
      const index = selectedPaths.value.indexOf(path);

      if (index === -1) {
        selectedPaths.value.push(path);
      } else {
        selectedPaths.value.splice(index, 1);
      }

      return;
    }

    if (path.directory) {
      // history.push(currentPath.value);
      currentPath.value = `${currentPath.value}/${path.name}`;
    } else {
      activeFile.value = path;
    }
  }

  // On path long press
  function onPathLongPress(path) {
    if (multiSelectMode.value) {
      return; // multi select options
    }
    fileContextMenu.value = path;
  }

  // Path search toggle button
  async function onPathSearchClick() {
    if (showPathSearch.value) {
      await navigateToPath();
    } else {
      pathSearchInput.value = getFinalPath();
    }
    showPathSearch.value = !showPathSearch.value;
  }

  // Delete path
  async function deletePath(path, force = false) {
    const fpath = getFilePath(path.name);
    console.log("DELETE: ", fpath);

    // Future guard (TODO)
    // if (["root", "osr"].includes(currentProtocol.value)) return;

    const res = path.directory
      ? await fs.deleteDirectory(fpath)
      : await fs.deleteFile(fpath);

    if (res.error) {
      errors.raiseError(res.error.detail || "Error deleting file", "error");
      return;
    }
    await reloadDirectory();
  }

  // ------------------------- Watchers

  // Watch and update currentPath
  watch(currentProtocol, (newProto, oldProto) => {
    if (isNavigatingHistory || changingProtocolOnly) return;
    currentPath.value = "";
  });

  // Watch and update files
  watch([currentProtocol, currentPath], async () => {
    const current = {
      proto: currentProtocol.value,
      path: currentPath.value
    };

    if (!isNavigatingHistory) {
      const last = history[historyIndex];

      if (!last || last.proto !== current.proto || last.path !== current.path) {
        history.splice(historyIndex + 1);
        history.push(current);
        historyIndex = history.length - 1;
      }
    }

    await reloadDirectory();
  });
  // ------------------------- Navigation
  // Move step ex: some/hello -> some
  async function goUp() {
    if (listLoading.value) return;

    const path = currentPath.value.replace(/^\/|\/$/g, "");

    if (!path) return;

    const parts = path.split("/");
    parts.pop();

    currentPath.value = parts.join("/");
  }

  // Undo based on history
  async function goBack() {
    if (listLoading.value) return;

    if (historyIndex <= 0) return;

    historyIndex--;

    const entry = history[historyIndex];

    isNavigatingHistory = true;

    currentProtocol.value = entry.proto;
    currentPath.value = entry.path;

    await nextTick();

    isNavigatingHistory = false;
  }

  // Redo based on history
  async function goForward() {
    if (listLoading.value) return;

    if (historyIndex >= history.length - 1) return;

    historyIndex++;

    const entry = history[historyIndex];

    isNavigatingHistory = true;

    currentProtocol.value = entry.proto;
    currentPath.value = entry.path;

    await nextTick();

    isNavigatingHistory = false;
  }

  // Load app config and watch changes and save
  async function loadConfigAndWatch() {
    await appConfig.load();

    watchDebounced(
      () => ({ ...settings.state }),
      async () => {
        await appConfig.save();
      },
      {
        deep: true,
        debounce: 500, // wait 500ms after last change
        maxWait: 2000 // optional: force run after 2s max
      }
    );
  }

  // ------------------------- INIT

  async function init() {
    // Load app info
    const info = await app.fetchAppInfo();

    const initPath = info.options.query.path;

    if (typeof initPath === "string") {
      const [proto, path] = initPath.split("://");

      currentProtocol.value = ["home", "root", "os", "osr"].includes(proto)
        ? proto
        : "!";
      currentPath.value = path;
    }

    history.push({
      proto: currentProtocol.value,
      path: currentPath.value
    });

    historyIndex = 0;

    document.addEventListener("contextmenu", e => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    });

    await loadConfigAndWatch();
    await reloadDirectory();

    initLoadState.value = false;
  }

  // Initial load
  onMounted(init);
</script>

<template>
  <div
    id="main"
    v-if="!initLoadState"
    :data-theme="settings.state.theme"
    class="h-dvh flex flex-col overflow-hidden font-body transition-colors"
  >
    <!-- Header -->
    <Header @l="showLSidebar = true" @r="showRSidebar = true" />
    <!-- Current Protocol & Path -->
    <div
      class="flex justify-between items-center bg-primary/60 text-primary-content"
    >
      <div class="flex items-center flex-1 min-w-0">
        <div
          @click="resetPath"
          class="min-w-18 mr-1 px-2 p-1 shrink-0 text-center bg-primary/60 text-primary-content font-semibold uppercase"
        >
          {{ currentProtocol }}
        </div>

        <!-- search -->
        <div v-if="showPathSearch" class="w-full px-2">
          <input
            v-model="pathSearchInput"
            class="w-full input input-xs bg-transparent rounded focus:outline-none placeholder:opacity-60 text-primary-content"
            placeholder="ex: home://"
          />
        </div>
        <div
          v-else
          ref="pathContainer"
          class="flex-1 min-w-0 overflow-x-auto scrollbar-hide"
        >
          <div class="flex justify-start items-center w-max">
            <div
              v-for="name in currentPath.split('/')"
              class="text-sm link px-0.5 shrink-0 opacity-60 active:opacity-100 transition-opacity"
              @click="replacePath(name)"
            >
              {{ name }}
            </div>
          </div>
        </div>
      </div>
      <button
        @click="onPathSearchClick"
        class="p-1 px-2 text-primary-content/60"
        :class="{ 'bg-primary/60': showPathSearch }"
      >
        <svg
          v-if="!showPathSearch"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M16.477 3.004c.167.015.24.219.12.338l-8.32 8.32a.75.75 0 0 0-.195.34l-1 3.83a.75.75 0 0 0 .915.915l3.829-1a.75.75 0 0 0 .34-.196l8.438-8.438a.198.198 0 0 1 .339.12a45.7 45.7 0 0 1-.06 10.073c-.223 1.905-1.754 3.4-3.652 3.613a47.5 47.5 0 0 1-10.461 0c-1.899-.213-3.43-1.708-3.653-3.613a45.7 45.7 0 0 1 0-10.611C3.34 4.789 4.871 3.294 6.77 3.082a47.5 47.5 0 0 1 9.707-.078"
          />
          <path
            fill="currentColor"
            d="M17.823 4.237a.25.25 0 0 1 .354 0l1.414 1.415a.25.25 0 0 1 0 .353L11.298 14.3a.25.25 0 0 1-.114.065l-1.914.5a.25.25 0 0 1-.305-.305l.5-1.914a.25.25 0 0 1 .065-.114z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M18 12c0 1.65-1.35 3-3 3H9v-3l-5 4l5 4v-3h6c2.76 0 5-2.24 5-5V4h-2z"
          />
        </svg>
      </button>
    </div>
    <!-- Toolbar -->
    <Toolbar
      :listLoading="listLoading"
      :multiSelectMode="multiSelectMode"
      :showRightMenu="showRightMenu"
      :isCurrentPathBookmarked="isCurrentPathBookmarked"
      @goUp="goUp"
      @goBack="goBack"
      @goForward="goForward"
      @update="updateCurrentPathList"
      @multi="toggleMultiSelectMode"
      @menu="() => (showRightMenu = true)"
      @bookmark="toggleBookmarkCurrentPath"
    />
    <!-- Selected Paths Info -->
    <Transition name="fade">
      <SelectedPathsInfo
        v-if="multiSelectMode"
        :selectedPaths="selectedPaths"
        :visibleFiles="visibleFiles"
        :toggleSelectAll="toggleSelectAll"
        :deleteSelectedFiles="deleteSelectedFiles"
        :updateCopyFilesList="updateCopyFilesList"
        :copyFilesList="copyFilesList"
        :copyFiles="copyFiles"
        @close="toggleMultiSelectMode"
      />
    </Transition>
    <!-- Loading effects -->
    <Loading v-if="settings.state.showLoadCircle && listLoading" />
    <div v-else-if="listLoading" class="flex-1"></div>

    <!-- Panel -->
    <div
      v-else
      ref="listContainer"
      @scroll="onScroll"
      class="flex-1 overflow-y-auto"
    >
      <!-- Grid Icons -->
      <GridView
        v-if="settings.state.iconsView === 'grid'"
        :visibleFiles="visibleFiles"
        :multiSelectMode="multiSelectMode"
        :selectedPaths="selectedPaths"
        :getFilePath="getFilePath"
        :onClick="onPathClick"
        :onLongPress="onPathLongPress"
      />
      <!-- List Icons -->
      <ListView
        v-else-if="settings.state.iconsView === 'list'"
        :visibleFiles="visibleFiles"
        :multiSelectMode="multiSelectMode"
        :selectedPaths="selectedPaths"
        :getFilePath="getFilePath"
        :onClick="onPathClick"
        :onLongPress="onPathLongPress"
      />
    </div>

    <!-- Left SideBar -->
    <Transition name="slide-right">
      <LeftSidebar v-show="showLSidebar" @close="showLSidebar = false" />
    </Transition>

    <!-- Right SideBar -->
    <Transition name="slide-left">
      <RightSidebar
        v-show="showRSidebar"
        @close="showRSidebar = false"
        :selectBookmarkPath="selectBookmarkPath"
        :removeBookmark="removeBookmark"
      />
    </Transition>

    <!-- SideMenu Right -->
    <Transition name="slide-down">
      <Menubox
        v-if="showRightMenu"
        :currentProtocol="currentProtocol"
        :listLoading="listLoading"
        @close="showRightMenu = false"
        @upload="showUploader = true"
        @location="changeProtocol"
        @create="toggleCreatePath"
        @sort="setSort"
      />
    </Transition>

    <!-- PasteActions Fab -->
    <Transition name="fade-scale">
      <PasteActions
        v-if="copyFilesList.length > 0"
        @reset="copyFilesList.length = 0"
        @copy="copyFiles"
      />
    </Transition>

    <!-- File Context Menu View -->
    <Transition name="fade-scale">
      <FileContextMenu
        v-if="fileContextMenu"
        :path="fileContextMenu"
        :filePath="getFilePath(fileContextMenu.name)"
        :protocol="currentProtocol"
        :deletePath="deletePath"
        :downloadFile="downloadFile"
        :renameFile="renameFile"
        :shareFile="shareFile"
        :setWallpaper="setWallpaper"
        @close="fileContextMenu = null"
      />
    </Transition>

    <!-- File View -->
    <Transition name="fade-scale">
      <FileView
        v-if="activeFile"
        :file="activeFile"
        :filePath="getFilePath(activeFile.name)"
        @close="activeFile = null"
      />
    </Transition>

    <!-- Create Path -->
    <Transition name="fade-scale">
      <AlertInput
        v-if="createPath"
        :title="createPath === 'file' ? 'New File' : 'New Folder'"
        :autoSelect="true"
        @onResponse="onCreatePath"
      />
    </Transition>

    <!-- Global Alerts -->
    <Transition name="fade-scale">
      <Alert
        v-if="errors.errorStack.length > 0"
        :message="errors.getErrorMessage()"
        @close="errors.closeError"
      />
    </Transition>

    <!-- Files uploader -->
    <Transition name="fade-scale">
      <FilesUploader
        v-if="showUploader"
        :currentPath="getFinalPath()"
        @close="showUploader = false"
        @update="updateCurrentPathList"
      />
    </Transition>
  </div>
</template>

<style scoped></style>
