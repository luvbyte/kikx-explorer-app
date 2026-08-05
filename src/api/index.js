import { z } from "zod";
import { toRaw } from "vue";

import { FileSystemService, createApp } from "kikx-sdk";
import { apiUrl, DEV } from "./config.js";
import { useSettings } from "@/stores/settings";
import { blobToText } from "./utils";

import THEMES from "@/api/themes";

// Validation scheme
const appConfigSchema = z.object({
  // "grid" | "list"
  iconsView: z.enum(["grid", "list"]),

  // bool fileds
  showHiddenFiles: z.boolean(),
  showLoadCircle: z.boolean(),
  openOnCreate: z.boolean(),
  highlightCode: z.boolean(),
  readOnly: z.boolean(),

  // theme: string
  theme: z.string(),

  // sort object
  sort: z.object({
    // name: [name, size, modified]
    type: z.enum(["name", "size", "modified"]),
    asc: z.boolean()
  }),

  // bookmarks: [{ proto: string, path: string }]
  bookmarks: z.array(
    z.object({
      proto: z.string(),
      path: z.string()
    })
  )
});

// App instance
const app = createApp();

// If DEV use local
if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "30893b694abc4187940333466a3589e2"
  });
}

// FS
class FSApi extends FileSystemService {
  constructor(app) {
    super(app);
  }
  uploadFiles(files, dest) {
    const formData = new FormData();

    files.forEach(item => {
      formData.append("files", item.file);
    });

    return this.request(
      `upload?dest=${encodeURIComponent(dest)}`,
      "POST",
      formData,
      false
    );
  }
  copyFile(source, dest, override = false) {
    return this.request("copy-file", "POST", {
      source,
      dest,
      override
    });
  }
  listFilesLimit(
    directory,
    { offset = 0, limit = 100, sort = "name", asc = true } = {}
  ) {
    const params = new URLSearchParams({
      directory,
      offset: String(offset),
      limit: String(limit),
      sort,
      asc: String(asc)
    });

    const url = `list?${params.toString()}`;

    return this.request(url);
  }
  createFile(filename) {
    return this.request("create_file", "POST", {
      filename
    });
  }
}

// FS instance
const fs = new FSApi(app);

// App config
export const appConfig = {
  // Data config path
  configFilePath: "data://config.json",

  // Get object from store values
  getConfig() {
    const settings = useSettings();
    return toRaw(settings.state);
  },

  // Assign object values to store values
  parseConfig(data) {
    const settings = useSettings();
    const validated = appConfigSchema.parse(data);

    if (!THEMES.includes(validated.theme)) {
      throw new Error(`Invalid theme: ${validated.theme}`);
    }

    settings.$patch(store => {
      Object.assign(store.state, validated);
    });
  },

  // Load config
  async load() {
    try {
      const res = await fs.readFile(this.configFilePath);
      if (!res.data) {
        throw Error("Data not found");
      }
      const data = JSON.parse(await blobToText(res.data));
      this.parseConfig(data);
    } catch (err) {
      console.log("Error loading config: ", err);
      await this.save();
    }
  },

  // Save config
  async save() {
    const config = await this.getConfig();
    await fs.writeFile(this.configFilePath, JSON.stringify(config));

    console.log("Config saved: ", config);
  }
};

// FS api

export { app, fs };
