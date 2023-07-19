export default function serveFile(blob, filename) {
  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;

  // Programmatically trigger the download
  anchor.click();

  // Clean up
  URL.revokeObjectURL(anchor.href);
  anchor.remove();
}
