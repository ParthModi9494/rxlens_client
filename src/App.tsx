import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import UploadScreen from "./components/UploadScreen";

// ─── App ──────────────────────────────────────────────────────────
const App = () => {
  const [screen, setScreen] = useState("upload"); // "upload" | "loading" | "dashboard"
  const [data, setData] = useState(null);

  const handleUpload = async (blob: Blob) => {
    setScreen("loading");
    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", blob, "prescription.jpg");

      // Send to API
      const apiUrl = import.meta.env.VITE_API_ENDPOINT_URL;
      const res = await fetch(`${apiUrl}/api/v1/parse-prescription`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setData(data);
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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg,#EEF3FF 0%,#F8FAFF 60%,#fff 100%)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex items-center px-5 py-2.5 bg-blue-50/90 backdrop-blur-lg border-b border-black/5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[13px] font-black mr-2"
          style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
        >
          ℞
        </div>
        <span className="text-[15px] font-black text-slate-800 tracking-tight">
          RxLens
        </span>
        {screen === "dashboard" && (
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-green-600">
            <div className="w-1.75 h-1.75 bg-green-500 rounded-full animate-dot-pulse" />
            Verified
          </div>
        )}
      </div>

      {screen === "upload" && <UploadScreen onUpload={handleUpload} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "dashboard" && data && (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;
