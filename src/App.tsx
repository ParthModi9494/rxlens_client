import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import UploadScreen from "./components/UploadScreen";
import { Badge } from "./components/ui/badge";

const App = () => {
  const [screen, setScreen] = useState<"upload" | "loading" | "dashboard">("upload");
  const [data, setData] = useState<unknown>(null);

  const handleUpload = async (blob: Blob) => {
    setScreen("loading");
    try {
      const formData = new FormData();
      formData.append("file", blob, "prescription.jpg");

      const apiUrl = import.meta.env.VITE_API_ENDPOINT_URL;
      const res = await fetch(`${apiUrl}/api/v1/parse-prescription`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
      setScreen("dashboard");
    } catch (err) {
      console.error("Error parsing prescription:", err);
      setScreen("upload");
    }
  };

  const handleReset = () => {
    setData(null);
    setScreen("upload");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 text-white text-sm font-black select-none">
                ℞
              </div>
              <span className="text-[15px] font-bold text-slate-900 tracking-tight">
                RxLens
              </span>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3">
              {screen === "dashboard" && (
                <Badge variant="success" className="flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[dot-pulse_1.6s_ease-in-out_infinite]" />
                  Verified
                </Badge>
              )}
              {screen === "loading" && (
                <Badge variant="info" className="font-semibold">
                  Processing…
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Screen content ──────────────────────────────────── */}
      {screen === "upload" && <UploadScreen onUpload={handleUpload} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "dashboard" && data != null && (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;
