export type ToolKey =
  | "compress" | "merge" | "split" | "image" | "text"
  | "rotate" | "delete" | "reorder" | "reverse" | "blank"
  | "encrypt" | "decrypt" | "metadata" | "numbers" | "watermark"
  | "pagesize" | "headerfooter" | "nup" | "greyscale" | "markdown" | "csv";

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
  { key: "encrypt",   icon: "\uD83D\uDD12", label: "Encrypt PDF" },
  { key: "decrypt",   icon: "\uD83D\uDD13", label: "Decrypt PDF" },
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
];
