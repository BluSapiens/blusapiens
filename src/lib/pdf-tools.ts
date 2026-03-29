import JSZip from "jszip";

const DEFAULT_PAGE_WIDTH = 595.28;

export type RotationAngle = 90 | 180 | 270;

export type ToolResult = {
  blob: Blob;
  filename: string;
};

type PdfLibModule = typeof import("pdf-lib");
type DocxModule = typeof import("docx");
type PdfJsModule = typeof import("pdfjs-dist");

type PdfJsRuntime = PdfJsModule & {
  GlobalWorkerOptions: PdfJsModule["GlobalWorkerOptions"];
};

let pdfLibPromise: Promise<PdfLibModule> | null = null;
let docxPromise: Promise<DocxModule> | null = null;
let pdfJsPromise: Promise<PdfJsRuntime> | null = null;

function stripExtension(filename: string) {
  const lastDot = filename.lastIndexOf(".");
  return lastDot === -1 ? filename : filename.slice(0, lastDot);
}

function safeFilenamePart(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "file";
}

async function fileToBytes(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

async function getPdfLib() {
  if (!pdfLibPromise) {
    pdfLibPromise = import("pdf-lib");
  }

  return pdfLibPromise;
}

async function getDocx() {
  if (!docxPromise) {
    docxPromise = import("docx");
  }

  return docxPromise;
}

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]).then(([pdfjs, worker]) => {
      const runtime = pdfjs as PdfJsRuntime;
      runtime.GlobalWorkerOptions.workerSrc = worker.default;
      return runtime;
    });
  }

  return pdfJsPromise;
}

type RenderablePdfPage = {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<unknown> };
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Unable to create output file."));
      }
    }, type, quality);
  });
}

async function renderPdfPage(page: RenderablePdfPage, scale: number) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available in this browser.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({ canvasContext: context, viewport }).promise;
  return { canvas, viewport };
}

export function downloadResult(result: ToolResult) {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function mergePdfs(files: File[]): Promise<ToolResult> {
  const { PDFDocument } = await getPdfLib();
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const sourcePdf = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const bytes = await mergedPdf.save({ useObjectStreams: true });
  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    filename: "merged.pdf",
  };
}

export async function splitPdf(file: File): Promise<ToolResult> {
  const { PDFDocument } = await getPdfLib();
  const sourcePdf = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
  const zip = new JSZip();
  const baseName = safeFilenamePart(stripExtension(file.name));

  for (let index = 0; index < sourcePdf.getPageCount(); index += 1) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(sourcePdf, [index]);
    newPdf.addPage(page);
    const bytes = await newPdf.save({ useObjectStreams: true });
    zip.file(`${baseName}-page-${index + 1}.pdf`, bytes);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    filename: `${baseName}-split.zip`,
  };
}

export async function compressPdf(file: File): Promise<ToolResult> {
  const { PDFDocument } = await getPdfLib();
  const { getDocument } = await getPdfJs();
  const data = await fileToBytes(file);
  const pdf = await getDocument({ data }).promise;
  const outputPdf = await PDFDocument.create();
  const baseName = safeFilenamePart(stripExtension(file.name));

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const { canvas } = await renderPdfPage(page, 1);
    const imageBlob = await canvasToBlob(canvas, "image/jpeg", 0.68);
    const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
    const image = await outputPdf.embedJpg(imageBytes);

    const pageWidth = DEFAULT_PAGE_WIDTH;
    const pageHeight = Math.max((canvas.height / canvas.width) * pageWidth, 200);
    const outputPage = outputPdf.addPage([pageWidth, pageHeight]);

    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  const bytes = await outputPdf.save({ useObjectStreams: true });
  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    filename: `${baseName}-compressed.pdf`,
  };
}

export async function pdfToWord(file: File): Promise<ToolResult> {
  const { Document, Packer, Paragraph, TextRun } = await getDocx();
  const { getDocument } = await getPdfJs();
  const data = await fileToBytes(file);
  const pdf = await getDocument({ data }).promise;
  const children: InstanceType<typeof Paragraph>[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;

    const lines: string[] = [];
    let currentLine = "";

    items.forEach((item) => {
      const value = item.str?.trim();
      if (value) {
        currentLine = currentLine ? `${currentLine} ${value}` : value;
      }

      if (item.hasEOL && currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Page ${pageNumber}`, bold: true, size: 24 })],
        spacing: { after: 200 },
      })
    );

    if (lines.length === 0) {
      children.push(new Paragraph({ text: "No extractable text found on this page.", spacing: { after: 180 } }));
    } else {
      lines.forEach((line) => {
        children.push(new Paragraph({ text: line, spacing: { after: 140 } }));
      });
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);

  return {
    blob,
    filename: `${safeFilenamePart(stripExtension(file.name))}.docx`,
  };
}

export async function jpgToPdf(files: File[]): Promise<ToolResult> {
  const { PDFDocument } = await getPdfLib();
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await fileToBytes(file);
    const lowerName = file.name.toLowerCase();
    const image = lowerName.endsWith(".png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const { width, height } = image.scale(1);
    const page = pdf.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  const bytes = await pdf.save({ useObjectStreams: true });
  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    filename: "images-to-pdf.pdf",
  };
}

export async function pdfToJpg(file: File): Promise<ToolResult> {
  const { getDocument } = await getPdfJs();
  const data = await fileToBytes(file);
  const pdf = await getDocument({ data }).promise;
  const zip = new JSZip();
  const baseName = safeFilenamePart(stripExtension(file.name));

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const { canvas } = await renderPdfPage(page, 2);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
    zip.file(`${baseName}-page-${pageNumber}.jpg`, blob);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    filename: `${baseName}-jpg.zip`,
  };
}

export async function rotatePdf(file: File, angle: RotationAngle): Promise<ToolResult> {
  const { PDFDocument, degrees } = await getPdfLib();
  const pdf = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });

  pdf.getPages().forEach((page) => {
    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees((currentAngle + angle) % 360));
  });

  const bytes = await pdf.save({ useObjectStreams: true });
  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    filename: `${safeFilenamePart(stripExtension(file.name))}-rotated.pdf`,
  };
}

export async function unlockPdf(file: File): Promise<ToolResult> {
  const { PDFDocument } = await getPdfLib();

  try {
    const pdf = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
    const bytes = await pdf.save({ useObjectStreams: true });

    return {
      blob: new Blob([bytes], { type: "application/pdf" }),
      filename: `${safeFilenamePart(stripExtension(file.name))}-unlocked.pdf`,
    };
  } catch {
    throw new Error("This PDF appears to require a password or uses protection this browser-side tool cannot remove.");
  }
}

export async function readPdfPageCount(file: File) {
  const { PDFDocument } = await getPdfLib();
  const pdf = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
  return pdf.getPageCount();
}

export function formatFilesSummary(files: File[]) {
  if (files.length === 0) return "No files selected";
  if (files.length === 1) return files[0].name;
  return `${files.length} files selected`;
}

export function ensurePdfFiles(files: File[]) {
  if (files.length === 0) {
    throw new Error("Please select at least one PDF file.");
  }

  files.forEach((file) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error(`Only PDF files are allowed. Problem file: ${file.name}`);
    }
  });
}

export function ensureImageFiles(files: File[]) {
  if (files.length === 0) {
    throw new Error("Please select at least one JPG or PNG image.");
  }

  files.forEach((file) => {
    const lowerName = file.name.toLowerCase();
    if (!(lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".png"))) {
      throw new Error(`Only JPG, JPEG, or PNG images are allowed. Problem file: ${file.name}`);
    }
  });
}

export function humanizeBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
