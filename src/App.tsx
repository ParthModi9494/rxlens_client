import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { SAMPLE_DATA } from "./components/Dashboard";
import type { PrescriptionData } from "./components/Dashboard";
import MissingInfoModal from "./components/MissingInfoModal";
import type { MissingFields, MissingInfoPatch } from "./components/MissingInfoModal";
import LoadingScreen from "./components/LoadingScreen";
import UploadScreen from "./components/UploadScreen";
import { Badge } from "./components/ui/badge";
import { FlaskConical } from "lucide-react";

// ─── Missing-field detection ──────────────────────────────────────
const GENERIC_NAMES = ["not specified", "unknown", "n/a", "na", "-", "not available"];

const isBlank = (v: unknown): boolean =>
  v == null || (typeof v === "string" && v.trim() === "");

const isGenericPlaceholder = (v: string): boolean =>
  GENERIC_NAMES.includes(v.toLowerCase().trim());

function detectMissingFields(prescription: unknown): MissingFields {
  const p = prescription as Partial<PrescriptionData>;
  const doctorName = p?.doctor?.name;
  return {
    doctorName:
      isBlank(doctorName) ||
      (typeof doctorName === "string" && isGenericPlaceholder(doctorName)),
    clinicName: isBlank(p?.doctor?.clinic_name),
    doctorContact: isBlank(p?.doctor?.contact_number),
    followUpDate: isBlank(p?.follow_up_date),
  };
}

function shouldShowModal(missing: MissingFields): boolean {
  return missing.doctorName || missing.clinicName || missing.followUpDate;
}

// ─── App ──────────────────────────────────────────────────────────
const App = () => {
  const [screen, setScreen] = useState<"upload" | "loading" | "dashboard">("upload");
  const [data, setData] = useState<unknown>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);

  const handleUpload = async (blob: Blob) => {
    setScreen("loading");
    setDemoMode(false);

    try {
      const formData = new FormData();
      formData.append("file", blob, "prescription.jpg");

      const apiUrl = import.meta.env.VITE_API_ENDPOINT_URL;
      const res = await fetch(`${apiUrl}/api/v1/parse-prescription`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      // Backend returned an error object (e.g. uncaught exception)
      if (result?.error) {
        console.warn("[RxLens] API returned error — switching to demo mode:", result.error);
        setData(SAMPLE_DATA);
        setDemoMode(true);
        setScreen("dashboard");
        if (shouldShowModal(detectMissingFields(SAMPLE_DATA))) setShowMissingModal(true);
        return;
      }

      // Backend served mock data due to quota exhaustion
      if (result?._demo_mode) {
        setDemoMode(true);
      }

      setData(result);
      setScreen("dashboard");
      if (shouldShowModal(detectMissingFields(result))) setShowMissingModal(true);

    } catch (err) {
      // Network error, backend unreachable, or JSON parse failure
      console.warn("[RxLens] Network/fetch error — switching to demo mode:", err);
      setData(SAMPLE_DATA);
      setDemoMode(true);
      setScreen("dashboard");
      if (shouldShowModal(detectMissingFields(SAMPLE_DATA))) setShowMissingModal(true);
    }
  };

  const handleReset = () => {
    setData(null);
    setDemoMode(false);
    setScreen("upload");
    setShowMissingModal(false);
  };

  const handleModalSubmit = (patch: MissingInfoPatch) => {
    setData((prev) => {
      const p = prev as PrescriptionData;
      return {
        ...p,
        follow_up_date: patch.followUpDate ?? p.follow_up_date,
        follow_up_time: patch.followUpTime ?? p.follow_up_time,
        doctor: {
          ...p.doctor,
          ...(patch.doctorName    ? { name: patch.doctorName }               : {}),
          ...(patch.clinicName    ? { clinic_name: patch.clinicName }         : {}),
          ...(patch.doctorContact ? { contact_number: patch.doctorContact }   : {}),
        },
      };
    });
    setShowMissingModal(false);
  };

  const handleModalSkip = () => setShowMissingModal(false);

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
              {screen === "dashboard" && !demoMode && (
                <Badge variant="success" className="flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[dot-pulse_1.6s_ease-in-out_infinite]" />
                  Verified
                </Badge>
              )}
              {screen === "dashboard" && demoMode && (
                <Badge variant="warning" className="flex items-center gap-1.5 font-semibold">
                  <FlaskConical className="w-3 h-3" />
                  Demo Mode
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
        <>
          <Dashboard data={data} onReset={handleReset} demoMode={demoMode} />
          {showMissingModal && (
            <MissingInfoModal
              missingFields={detectMissingFields(data)}
              onSubmit={handleModalSubmit}
              onSkip={handleModalSkip}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
