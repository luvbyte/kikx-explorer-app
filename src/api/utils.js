// Blob to text
export async function blobToText(blob) {
  return await blob.text();
}

// ex: 22/06/26
export function formatDate(dateString) {
  const d = new Date(dateString);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

// Get size from Bytes
export function formatBytes(sizeBytes) {
  if (sizeBytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(1024));

  return `${(sizeBytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}
