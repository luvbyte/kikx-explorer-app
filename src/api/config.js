export const DEV = process.env.NODE_ENV !== "production";

const { protocol, hostname, port } = window.location;

// App version
export const VERSION = "0.1.8";

// App Default theme
export const defaultTheme = "dark";

export const apiUrl = DEV
  ? "http://localhost:8000"
  : `${protocol}//${hostname}${port ? `:${port}` : ""}`;

// export const wsUrl = DEV
//   ? "ws://localhost:8000"
//   : `${protocol === "https:" ? "wss:" : "ws:"}//${hostname}${port ? `:${port}` : ""}`;

// ----------------

// // Get url
export const getUrl = end => {
  let endUrl = end.startsWith("/") ? end : "/" + end;

  return apiUrl + endUrl;
};

// export const getImageUrl = url => {
//   if (url.startsWith("/")) {
//     return apiUrl + url;
//   } else if (url.startsWith("http")) {
//     return url;
//   }
//   return DEV ? "/" + url : url;
// };

// /public/icon // https:// works
// export const getAppIcon = (icon, appName = null) => {
//   if (icon.startsWith("http") || !appName) {
//     return icon;
//   }
//   return getUrl(`/public/app/${appName}/${icon}`);
// };

// Icons for filenames
export const FILE_ICONS_BY_NAME = {
  README: "markdown.svg"
};

// Fileicons suffix: icon
export const FILE_ICONS = {
  ".bin": "binary.svg",

  // Programming
  ".c": "c.svg",
  ".cpp": "cpp.svg",
  ".go": "go.svg",
  ".py": "python.svg",
  ".js": "javascript.svg",
  ".rs": "rust.svg",
  ".html": "html.svg",
  ".css": "css.svg",
  ".lua": "lua.svg",

  // Video
  ".mp4": "video.svg",

  // Images
  ".png": "image.svg",
  ".jpg": "image.svg",
  ".jpeg": "image.svg",
  ".gif": "image.svg",
  ".bmp": "image.svg",
  ".webp": "image.svg",
  ".svg": "image.svg",
  ".ico": "image.svg",
  ".tif": "image.svg",
  ".tiff": "image.svg",
  ".heic": "image.svg",
  ".heif": "image.svg",
  ".avif": "image.svg",
  ".jfif": "image.svg",
  ".raw": "image.svg",
  ".cr2": "image.svg",
  ".nef": "image.svg",
  ".arw": "image.svg",
  ".dng": "image.svg",

  //
  ".md": "markdown.svg",

  // Roms
  ".iso": "disc.svg",
  ".cue": "disc.svg",
  ".img": "disc.svg",
  ".chd": "disc.svg",

  // Nintendo
  ".nes": "disc.svg",
  ".fds": "disc.svg",
  ".sfc": "disc.svg",
  ".smc": "disc.svg",
  ".gb": "disc.svg",
  ".gbc": "disc.svg",
  ".gba": "disc.svg",
  ".nds": "disc.svg",
  ".3ds": "disc.svg",
  ".cia": "disc.svg",
  ".n64": "disc.svg",
  ".z64": "disc.svg",
  ".v64": "disc.svg",
  ".wbfs": "disc.svg",
  ".wad": "disc.svg",

  // Sega
  ".gen": "disc.svg",
  ".sms": "disc.svg",
  ".gg": "disc.svg",
  ".32x": "disc.svg",
  ".cdi": "disc.svg",

  // PlayStation
  ".ecm": "disc.svg",
  ".pbp": "disc.svg",
  ".vcd": "disc.svg",

  // Atari
  ".a26": "disc.svg",
  ".a52": "disc.svg",
  ".a78": "disc.svg",
  ".lnx": "disc.svg",

  // Commodore / Amiga
  ".d64": "disc.svg",
  ".d71": "disc.svg",
  ".d81": "disc.svg",
  ".adf": "disc.svg",

  // PC / DOS
  ".rom": "disc.svg",
  ".ima": "disc.svg",

  // Arcade
  ".zip": "zip.svg",
  ".7z": "disc.svg",

  // Audio / ROM-related
  ".nsf": "disc.svg",
  ".spc": "disc.svg",
  ".gbs": "disc.svg",
  ".gym": "disc.svg",

  //
  ".kikx": "kikx.png"
};

// Get icon with suffix
export const getFileIcon = (name, suffix, mime = null) => {
  const base = `${DEV ? "/icons" : "icons"}/ext`;

  const icon = FILE_ICONS_BY_NAME[name] || FILE_ICONS[suffix] || "default.svg";

  // Fall back to extension
  return `${base}/${icon}`;
};

// For file opening

export const imageExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".ico"
];

export const binaryExtensions = [
  "",
  ".bin",
  ".dat",
  ".dll",
  ".so",
  ".o",
  ".class",
  ".wasm"
];

export const unSupportedExtensions = [
  // Archives
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".bz2",

  // Executables
  ".exe",
  ".msi",
  ".apk",
  ".dmg",
  ".pkg",
  ".app",
  ".deb",
  ".rpm"
];

export const codeExtensions = [
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".vue",
  ".json",
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".xml",
  ".py",
  ".sh"
];

export const videoExtensions = [
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
  ".m4v"
];

export const audioExtensions = [
  ".mp3",
  ".wav",
  ".ogg",
  ".aac",
  ".flac",
  ".m4a"
];
