import { z } from "zod";
import { toRaw } from "vue";

import { FileSystemService, createApp, Invoker } from "kikx-sdk";
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

  hideExtension: z.boolean(),

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
const fs = new FileSystemService(app);
const invoker = new Invoker(app);

// If DEV use local
if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "0528bfde19f84b2fa1914293dfb52ef4"
  });
}

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

export { app, fs, invoker };
