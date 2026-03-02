import { useRef } from "react";
import { ChevronIcon, FileIcon, SparkleIcon, UploadIcon } from "./Icons";

interface UploadScreenProps {
  onUpload: (blob: Blob) => void;
}

const UploadScreen = ({ onUpload }: UploadScreenProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    onUpload(file);
  };

  return (
    <div className="max-w-180 mx-auto px-4 animate-fade-up">
      {/* Hero copy */}
      <div className="text-center pt-9 pb-7">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-extrabold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full mb-4">
          <SparkleIcon /> AI-Powered OCR
        </div>
        <h1 className="text-[32px] font-black text-slate-900 leading-[1.1] tracking-tight">
          Prescription
          <br />
          <span className="text-blue-600">Insight</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2.5 leading-relaxed">
          Upload a photo of any prescription to
          <br />
          instantly parse and visualize it.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="border-2 border-dashed border-slate-200 rounded-[28px] bg-white cursor-pointer relative overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:border-blue-300 hover:shadow-[0_0_0_5px_rgba(59,130,246,0.1)] transition-all duration-200"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50 rounded-full translate-x-1/3 -translate-y-2/5 opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-green-50 rounded-full -translate-x-1/3 translate-y-2/5 opacity-70 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4 py-14 px-6">
          {/* Pulsing upload icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-[-6px] bg-blue-400 rounded-[20px] animate-pulse-ring" />
            <div
              className="relative z-10 w-16 h-16 rounded-[18px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
                boxShadow: "0 8px 24px rgba(37,99,235,.35)",
              }}
            >
              <UploadIcon />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[15px] font-bold text-slate-800">
              Drop prescription here
            </p>
            <p className="text-[13px] text-slate-400 mt-1">
              or tap to choose from gallery
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["JPG", "PNG", "PDF", "HEIC"].map((f, i) => (
              <span
                key={f}
                className={`text-[11px] font-bold ${i % 2 === 0 ? "text-blue-500" : "text-slate-400"}`}
              >
                {f}
                {i < 3 ? " ·" : ""}
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
            if (file) handleFileUpload(file);
          }}
        />
      </div>

      {/* Demo button */}
      <div className="text-center mt-5">
        <button
          onClick={async () => {
            // Create a sample prescription blob for demo
            const sampleBlobString =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            const response = await fetch(sampleBlobString);
            const blob = await response.blob();
            onUpload(blob);
          }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-[13px] px-5 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <FileIcon /> Try with sample prescription <ChevronIcon />
        </button>
      </div>
    </div>
  );
};

export default UploadScreen;
