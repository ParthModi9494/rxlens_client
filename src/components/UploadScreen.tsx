import { useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  FileImage,
  Microscope,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import sampleImage from "../assets/Sample.jpeg";

interface UploadScreenProps {
  onUpload: (blob: Blob) => void;
}

const FEATURES = [
  "Extracts every medication, dose & frequency",
  "Surfaces alternatives and generic options",
  "Highlights side effects & contraindications",
];

const UploadScreen = ({ onUpload }: UploadScreenProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDemo = async () => {
    try {
      const response = await fetch(sampleImage);
      const blob = await response.blob();
      onUpload(blob);
    } catch (err) {
      console.error("Error loading sample:", err);
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-10 lg:py-16 items-center">

        {/* ── Left: Hero copy ─────────────────────────────────── */}
        <div className="animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
          <Badge variant="info" className="mb-5 font-semibold">
            <Sparkles className="w-3 h-3" />
            AI-Powered OCR
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
            Read any prescription
            <br />
            <span className="text-blue-600">in seconds.</span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md">
            Upload a photo of any handwritten or printed prescription and get a complete,
            structured breakdown — instantly.
          </p>

          {/* Feature list */}
          <ul className="space-y-3.5 mb-10">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Check className="h-3 w-3 text-blue-600 stroke-[2.5]" />
                </span>
                <span className="text-slate-600 text-sm leading-snug">{f}</span>
              </li>
            ))}
          </ul>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant results" },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Secure & private" },
              { icon: <Microscope className="w-3.5 h-3.5" />, label: "Gemini 2.5 Flash" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {icon}
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Upload zone ───────────────────────────────── */}
        <div
          className="animate-[fadeUp_0.5s_0.1s_cubic-bezier(0.22,1,0.36,1)_both] space-y-4"
        >
          {/* Drop zone */}
          <Card
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={[
              "cursor-pointer border-2 border-dashed transition-all duration-200",
              isDragging
                ? "border-blue-400 bg-blue-50 shadow-lg shadow-blue-100"
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50",
            ].join(" ")}
          >
            <div className="flex flex-col items-center gap-5 py-14 px-8">
              {/* Animated upload icon */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 scale-[1.4] rounded-2xl bg-blue-400/20 animate-[pulse-ring_2.2s_ease-in-out_infinite]" />
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <Upload className="h-7 w-7 text-white stroke-[2]" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-base font-semibold text-slate-800">
                  {isDragging ? "Drop it here" : "Drop prescription here"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  or{" "}
                  <span className="text-blue-600 font-semibold">browse files</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {["JPG", "PNG", "WEBP", "HEIC"].map((fmt, i) => (
                  <span
                    key={fmt}
                    className={`text-[11px] font-semibold ${i % 2 === 0 ? "text-blue-500" : "text-slate-400"}`}
                  >
                    {fmt}{i < 3 ? " ·" : ""}
                  </span>
                ))}
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </Card>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">or try a demo</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Demo button + preview */}
          <Button
            onClick={handleDemo}
            variant="outline"
            size="lg"
            className="w-full justify-between text-slate-700 border-slate-200"
          >
            <span className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-blue-500" />
              Try with sample prescription
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Button>

          {/* Sample image preview */}
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">sample_prescription.jpeg</span>
            </div>
            <img
              src={sampleImage}
              alt="Sample prescription"
              className="w-full block max-h-72 object-cover object-top"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadScreen;
