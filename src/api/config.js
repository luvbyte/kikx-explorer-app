export const DEV = process.env.NODE_ENV !== "production";

const { protocol, hostname, port } = window.location;

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

// App version
export const VERSION = "0.1.2";

// App Default theme
export const defaultTheme = "dark";

// Fileicons suffix: icon
export const FILE_ICONS = {
  "": "binary.svg",
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
  ".dng": "image.svg"
};

// Get icon with suffix
export const getFileIcon = (suffix, mime = null) => {
  const base = `${DEV ? "/icons" : "icons"}/ext`;

  // Fall back to extension
  return `${base}/${FILE_ICONS[suffix] || "default.svg"}`;
};
