import fs from "node:fs";
import path from "node:path";

// Temporary compatibility fix for the npm release. Review when upgrading Kivora.
const directory = path.resolve("node_modules/@kivora/nextjs");
const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
if (pkg.version !== "0.2.0") throw new Error("Review the upload error patch before upgrading @kivora/nextjs.");
const file = path.join(directory, "dist/upload-dashboard-AHXE42UH.js");
const marker = "// kivora-web: safe upload errors v1";
let source = fs.readFileSync(file, "utf8");
if (!source.includes(marker)) {
  const replacements = [
    ['function UploadDashboardControls({ target, label, uppy, messages: t }) {', `function UploadDashboardControls({ target, label, uppy, messages: t, locale }) {
  const uploadFailure = locale?.toLowerCase().startsWith("es")
    ? "No se pudo subir el archivo. Puedes reintentar o eliminarlo."
    : "The file could not be uploaded. You can retry or remove it.";`],
    ['className: "mt-1 text-xs text-destructive", children: String(file.error)', 'role: "alert", className: "mt-1 break-words text-xs text-destructive", children: uploadFailure'],
    ['className: "px-4 pb-3 text-sm text-destructive", children: t.selectionError', 'className: "px-4 pb-3 text-sm text-destructive", children: uploadFailure'],
    ['target, label: t.sources, uppy: engine, messages: t', 'target, label: t.sources, uppy: engine, messages: t, locale'],
    ['const uppy = new Uppy({ autoProceed: false, restrictions:', `const uppy = new Uppy({ autoProceed: false,
    // Handled transport errors are shown in the file card, not Next's error overlay.
    logger: { debug() {}, warn() {}, error() { console.debug("Kivora: upload operation failed; see file status."); } },
    restrictions:`],
    ['  try {\n    uppy.use(Tus,', `  // Uppy puts the raw response body in informer details. Keep its translated
  // user-facing message, never the transport details/HTML.
  const inform = uppy.info.bind(uppy);
  uppy.info = (message, type, duration) => inform(
    type === "error" && typeof message === "object" && message !== null
      ? { message: message.message }
      : message,
    type, duration
  );
  try {
    uppy.use(Tus,`],
  ];
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error(`Upload patch no longer matches: ${before}`);
    source = source.replace(before, after);
  }
  fs.writeFileSync(file, source + `\n${marker}\n`);
  console.log("Applied Kivora upload error presentation fix.");
}
