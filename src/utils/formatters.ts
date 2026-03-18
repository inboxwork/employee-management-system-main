import { getCurrencySymbol } from "./currency";

export function formatPriceWithCurrency(price: number, currency: string) {
  if (!price) return "Not set";
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${price.toFixed(2)}`;
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) return "file";

  // PDF
  if (["pdf"].includes(ext)) return "file-pdf";

  // Word
  if (["doc", "docx"].includes(ext)) return "file-word";

  // Images
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext))
    return "file-image";

  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "file-archive";

  // Excel
  if (["xls", "xlsx", "csv"].includes(ext)) return "file-excel";

  // PowerPoint
  if (["ppt", "pptx"].includes(ext)) return "file-powerpoint";

  // Text Files
  if (["txt", "rtf", "md"].includes(ext)) return "file-alt";

  // Code Files
  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "scss",
      "sass",
      "json",
      "xml",
      "yaml",
      "yml",
      "php",
      "py",
      "java",
      "cpp",
      "c",
      "cs",
      "go",
      "rb",
      "sql",
    ].includes(ext)
  )
    return "file-code";

  // Audio
  if (["mp3", "wav", "aac", "ogg", "flac"].includes(ext)) return "file-audio";

  // Video
  if (["mp4", "mkv", "avi", "mov", "wmv", "webm"].includes(ext))
    return "file-video";

  // AutoCAD Files
  if (["dwg", "dxf", "dwf"].includes(ext)) return "file-contract";

  // Default
  return "file";
}
