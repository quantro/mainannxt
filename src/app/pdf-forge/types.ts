export type ToolKey =
  | "compress" | "merge" | "split" | "image" | "text"
  | "rotate" | "delete" | "reorder" | "reverse" | "blank"
  | "metadata" | "numbers" | "watermark"
  | "pagesize" | "headerfooter" | "nup" | "greyscale" | "markdown" | "csv"
  | "crop" | "removeannot" | "removeform" | "fillform" | "unlockform"
  | "overlay" | "stamp" | "singlepage" | "booklet" | "poster";

export interface ToolDef {
  key: ToolKey;
  icon: string;
  label: string;
}

export const ALL_TOOLS: ToolDef[] = [
  { key: "merge",     icon: "\uD83D\uDCCB", label: "Merge PDFs" },
  { key: "split",     icon: "\u2702\uFE0F", label: "Split PDF" },
  { key: "compress",  icon: "\uD83D\uDCE6", label: "Compress PDF" },
  { key: "rotate",    icon: "\uD83D\uDD04", label: "Rotate PDF" },
  { key: "delete",    icon: "\u2796",       label: "Delete Pages" },
  { key: "reorder",   icon: "\uD83D\uDDD1\uFE0F", label: "Reorder Pages" },
  { key: "reverse",   icon: "\uD83D\uDD00", label: "Reverse Order" },
  { key: "blank",     icon: "\u2795",       label: "Add Blank Page" },

  { key: "metadata",  icon: "\uD83D\uDCC4", label: "Edit Metadata" },
  { key: "numbers",   icon: "#\uFE0F\u20E3", label: "Page Numbers" },
  { key: "watermark", icon: "\uD83C\uDF2A\uFE0F", label: "Watermark" },
  { key: "pagesize",  icon: "\uD83D\uDCD0", label: "Standardize Size" },
  { key: "headerfooter", icon: "\uD83D\uDCC3", label: "Header & Footer" },
  { key: "nup",       icon: "\uD83D\uDCCA", label: "N-Up Layout" },
  { key: "greyscale", icon: "\uD83C\uDFA8", label: "Greyscale / Invert" },
  { key: "image",     icon: "\uD83D\uDDBC\uFE0F", label: "Image to PDF" },
  { key: "text",      icon: "\u270D\uFE0F", label: "Text to PDF" },
  { key: "markdown",  icon: "\uD83D\uDCDD", label: "Markdown to PDF" },
  { key: "csv",       icon: "\uD83D\uDCCA", label: "CSV to PDF" },
  { key: "crop",      icon: "\u2702\uFE0F", label: "Crop PDF" },
  { key: "removeannot", icon: "\uD83D\uDD0D", label: "Remove Annotations" },
  { key: "removeform",  icon: "\u274C",       label: "Remove Form Fields" },
  { key: "fillform",    icon: "\u270F\uFE0F", label: "Fill Forms" },
  { key: "unlockform",  icon: "\uD83D\uDD13", label: "Unlock Forms" },
  { key: "overlay",     icon: "\uD83D\uDCD1", label: "Overlay PDFs" },
  { key: "stamp",       icon: "\uD83D\uDCE6", label: "Add Stamp" },
  { key: "singlepage",  icon: "\uD83D\uDCC4", label: "PDF to Single Page" },
  { key: "booklet",     icon: "\uD83D\uDCD6", label: "Booklet Imposition" },
  { key: "poster",      icon: "\uD83D\uDDBC\uFE0F", label: "Poster Split" },
];
