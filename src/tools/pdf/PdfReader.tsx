import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  RotateCw,
  FileText,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { pdfjsLib, formatFileSize } from '../../utils/pdfHelper';

export const PdfReader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF when file changes
  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setPageNum(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(err);
          setError("We couldn't read this PDF. Please make sure the file is a valid PDF and try again.");
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Render active page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale, rotation]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const downloadOriginal = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="max-w-2xl mx-auto">
          <FileDropzone
            accept="application/pdf"
            onFilesSelected={handleFilesSelected}
            label="Upload a PDF to read"
            sublabel="Supports PDFs up to 50MB. Rendered directly in your browser."
            buttonText="Choose PDF"
            icon={<FileText className="w-7 h-7" />}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${
            isFullscreen ? 'p-4 bg-slate-900 fixed inset-0 z-50 rounded-none' : ''
          }`}
        >
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            {/* File info */}
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-xs">
                {file.name}
              </span>
              <span className="text-xs text-slate-400">({formatFileSize(file.size)})</span>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={pageNum <= 1}
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700 dark:text-slate-300"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300 px-2">
                <span>Page </span>
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={pageNum}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= numPages) {
                      setPageNum(val);
                    }
                  }}
                  className="w-12 mx-1 px-1.5 py-0.5 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <span> of {numPages}</span>
              </div>

              <button
                disabled={pageNum >= numPages}
                onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700 dark:text-slate-300"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-300 px-1 font-mono">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(3.0, s + 0.2))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={downloadOriginal}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setPdfDoc(null);
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer font-medium ml-1"
              >
                Close
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="relative min-h-[500px] max-h-[75vh] overflow-auto flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950/70">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-sm font-medium">Rendering PDF pages locally...</span>
              </div>
            )}

            {error && (
              <div className="max-w-md p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Unable to load document</h4>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className={`max-w-full shadow-lg rounded-sm bg-white transition-opacity duration-200 ${
                isLoading || error ? 'hidden' : 'block'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
