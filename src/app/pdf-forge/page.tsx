"use client";

import { useState } from "react";
import ThemeToggle from "../theme-toggle";
import { PageTitle } from "../page-title";
import { Disclaimer } from "../disclaimer";
import { ALL_TOOLS, type ToolKey } from "./types";

import MergePdf from "./components/MergePdf";
import SplitPdf from "./components/SplitPdf";
import CompressPdf from "./components/CompressPdf";
import RotatePdf from "./components/RotatePdf";
import DeletePages from "./components/DeletePages";
import ReorderPages from "./components/ReorderPages";
import ReversePages from "./components/ReversePages";
import AddBlankPage from "./components/AddBlankPage";
import EncryptPdf from "./components/EncryptPdf";
import DecryptPdf from "./components/DecryptPdf";
import EditMetadata from "./components/EditMetadata";
import PageNumbers from "./components/PageNumbers";
import AddWatermark from "./components/AddWatermark";
import StandardizePageSize from "./components/StandardizePageSize";
import HeaderFooter from "./components/HeaderFooter";
import NUp from "./components/NUp";
import GreyscaleInvert from "./components/GreyscaleInvert";
import ImageToPdf from "./components/ImageToPdf";
import TextToPdf from "./components/TextToPdf";
import MarkdownToPdf from "./components/MarkdownToPdf";
import CsvToPdf from "./components/CsvToPdf";
import CropPdf from "./components/CropPdf";
import RemoveAnnotations from "./components/RemoveAnnotations";
import RemoveFormFields from "./components/RemoveFormFields";
import FillForms from "./components/FillForms";
import UnlockForms from "./components/UnlockForms";
import OverlayPdfs from "./components/OverlayPdfs";
import AddStamp from "./components/AddStamp";
import PdfToSinglePage from "./components/PdfToSinglePage";
import BookletImposition from "./components/BookletImposition";
import PosterSplit from "./components/PosterSplit";

const TOOL_MAP: Record<ToolKey, React.ReactNode> = {
  merge: <MergePdf />,
  split: <SplitPdf />,
  compress: <CompressPdf />,
  rotate: <RotatePdf />,
  delete: <DeletePages />,
  reorder: <ReorderPages />,
  reverse: <ReversePages />,
  blank: <AddBlankPage />,
  encrypt: <EncryptPdf />,
  decrypt: <DecryptPdf />,
  metadata: <EditMetadata />,
  numbers: <PageNumbers />,
  watermark: <AddWatermark />,
  pagesize: <StandardizePageSize />,
  headerfooter: <HeaderFooter />,
  nup: <NUp />,
  greyscale: <GreyscaleInvert />,
  image: <ImageToPdf />,
  text: <TextToPdf />,
  markdown: <MarkdownToPdf />,
  csv: <CsvToPdf />,
  crop: <CropPdf />,
  removeannot: <RemoveAnnotations />,
  removeform: <RemoveFormFields />,
  fillform: <FillForms />,
  unlockform: <UnlockForms />,
  overlay: <OverlayPdfs />,
  stamp: <AddStamp />,
  singlepage: <PdfToSinglePage />,
  booklet: <BookletImposition />,
  poster: <PosterSplit />,
};

export default function PdfForgePage() {
  const [tab, setTab] = useState<ToolKey>("merge");

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="PDF Forge" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        PDF Forge
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Client-side PDF tools: compress, merge, split, convert, and more. Nothing leaves your device.
      </p>

      <div className="w-full max-w-2xl flex flex-wrap gap-1 mb-5 justify-center">
        {ALL_TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded-[11px] text-[12px] font-semibold transition-all ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {TOOL_MAP[tab]}

      <div className="w-full max-w-2xl mt-6 cosmic-card px-6 py-4 space-y-2">
        <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center">
          Inspired by{" "}
          <a href="https://bentopdf.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-semibold hover:underline">
            BentoPDF
          </a>
          {" "}and{" "}
          <a href="https://github.com/Frooodle/Stirling-PDF" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-semibold hover:underline">
            Stirling-PDF
          </a>
          , open-source privacy-first PDF toolkits.
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
