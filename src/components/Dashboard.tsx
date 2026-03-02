import { useState } from "react";
import {
  ActivityIcon,
  AlertIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  CopyIcon,
  DropletsIcon,
  FlaskIcon,
  HeartIcon,
  LayersIcon,
  PillIcon,
  ScopeIcon,
  UploadIcon,
} from "./Icons";

// ─── Sample Data ─────────────────────────────────────────────────
export const SAMPLE_DATA = {
  prescription_id: "RX-2024-07-02-001",
  date_issued: "2024-07-02T00:00:00Z",
  patient: { name: "Rina Paul", age: 44, gender: "Female", blood_group: null },
  doctor: {
    name: "Dr Mounita Debnath",
    license_number: "76565",
    qualifications: "M.B.B.S.(WBUHS), M.D. Respiratory Medicine (PGT)",
    clinic_name: "City Medical Centre",
  },
  medications: [
    {
      name: "Numlo-TM",
      strength: "5mg",
      dosage: "1 tablet",
      frequency: "Once daily after breakfast",
      route: "Oral",
      duration: "Continuous",
    },
    {
      name: "Vylda-DM",
      strength: "100/10/1000",
      dosage: "1 tablet",
      frequency: "Once daily before lunch",
      route: "Oral",
      duration: "Continuous",
    },
    {
      name: "Melmet SR",
      strength: "500mg",
      dosage: "1 tablet",
      frequency: "Once daily before dinner",
      route: "Oral",
      duration: "Continuous",
    },
    {
      name: "Ecaspirin-AV",
      strength: "75mg/10mg",
      dosage: "1 tablet",
      frequency: "Once daily after dinner",
      route: "Oral",
      duration: "Continuous",
    },
    {
      name: "Rabinos-D",
      strength: null,
      dosage: "1 capsule",
      frequency: "Once daily before food",
      route: "Oral",
      duration: "1 month",
    },
    {
      name: "Vibrante",
      strength: null,
      dosage: "1 tablet",
      frequency: "Once daily after food",
      route: "Oral",
      duration: "1 month",
    },
    {
      name: "Zerodol-P",
      strength: null,
      dosage: "1 tablet",
      frequency: "Twice daily after food",
      route: "Oral",
      duration: "5 days",
    },
    {
      name: "Candid-V Ointment",
      strength: null,
      dosage: "Apply locally",
      frequency: "As directed",
      route: "Topical",
      duration: "As directed",
    },
    {
      name: "Alkasol Syrup",
      strength: null,
      dosage: "2 tsp in water",
      frequency: "Three times a day",
      route: "Oral",
      duration: "7 days",
    },
    {
      name: "Lfx",
      strength: "750mg",
      dosage: "1 tablet",
      frequency: "Once daily after food",
      route: "Oral",
      duration: "7 days",
    },
  ],
  chief_complaint: "Burning micturition",
  vitals_at_visit: { BP: "120/70", FBS: "203", PPBS: "293" },
  clinical_notes:
    "Signs of hypoglycaemia — explain to patient. Blood tests (FBS, PPBS, HbA1C) after 3 months.",
  follow_up_date: "2024-10-02",
};

// ─── Helpers ─────────────────────────────────────────────────────
const fmtDate = (iso: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const freqStyle = (freq: string) => {
  const f = (freq || "").toLowerCase();
  if (f.includes("three") || f.includes("3"))
    return {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-400",
    };
  if (f.includes("twice") || f.includes("2"))
    return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" };
  if (f.includes("once") || f.includes("1"))
    return { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" };
  return { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" };
};

const buildSummary = (data: any) =>
  `
PRESCRIPTION: ${data.prescription_id}  |  Date: ${fmtDate(data.date_issued)}
Patient: ${data.patient.name}, ${data.patient.age} yrs, ${data.patient.gender}
Doctor:  ${data.doctor.name}  |  Lic: ${data.doctor.license_number}
Vitals:  BP ${data.vitals_at_visit.BP}  |  FBS ${data.vitals_at_visit.FBS} mg/dL  |  PPBS ${data.vitals_at_visit.PPBS} mg/dL

MEDICATIONS:
${data.medications.map((m: any, i: number) => `${i + 1}. ${m.name}${m.strength ? ` ${m.strength}` : ""} — ${m.frequency} (${m.duration})`).join("\n")}

Notes: ${data.clinical_notes}
Follow-up: ${data.follow_up_date}
`.trim();

// ─── Section Header ───────────────────────────────────────────────
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  iconBg?: string;
}

const SectionHeader = ({
  icon,
  title,
  iconBg = "bg-slate-50",
}: SectionHeaderProps) => (
  <div className="flex items-center gap-2.5 mb-3 mt-6">
    <div
      className={`w-[30px] h-[30px] ${iconBg} rounded-[10px] flex items-center justify-center`}
    >
      {icon}
    </div>
    <span className="text-[11px] font-black text-slate-400 tracking-[0.16em] uppercase">
      {title}
    </span>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────
interface DashboardProps {
  data: any;
  onReset: () => void;
}

const Dashboard = ({ data, onReset }: DashboardProps) => {
  const [copied, setCopied] = useState(false);
  const {
    patient,
    doctor,
    vitals_at_visit: vitals,
    medications,
    clinical_notes,
    follow_up_date,
    chief_complaint,
    prescription_id,
    date_issued,
  } = data;

  const handleCopy = () => {
    navigator.clipboard?.writeText(buildSummary(data)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const followDate = follow_up_date ? new Date(follow_up_date) : null;

  return (
    <div className="max-w-180 mx-auto px-4 pb-16">
      {/* ── Hero Patient Card ───────────────────────────────── */}
      <div
        className="rounded-[28px] overflow-hidden px-5 pt-7 pb-6 relative mt-4 animate-fade-up"
        style={{
          background:
            "linear-gradient(135deg,#1D4ED8 0%,#2563EB 55%,#0EA5E9 100%)",
          boxShadow: "0 12px 48px rgba(37,99,235,.38)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-white/[0.09] rounded-full translate-x-1/3 -translate-y-2/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.07] rounded-full -translate-x-1/3 translate-y-2/5 pointer-events-none" />
        <div className="absolute top-2.5 right-4 text-[80px] font-black text-white/[0.08] leading-none select-none pointer-events-none">
          ℞
        </div>

        <div className="relative z-10">
          {/* RX ID pill */}
          <div className="inline-flex items-center gap-2 bg-white/[0.16] backdrop-blur px-3 py-1.5 rounded-full mb-3.5">
            <div className="w-[7px] h-[7px] bg-green-400 rounded-full animate-dot-pulse" />
            <span className="text-[11px] font-bold text-white/80 tracking-[0.1em]">
              {prescription_id}
            </span>
          </div>

          <p className="text-[26px] font-black text-white tracking-tight leading-tight">
            {patient.name}
          </p>
          <p className="text-[13px] text-blue-200 mt-1">
            {patient.age} yrs · {patient.gender}
            {patient.blood_group ? ` · ${patient.blood_group}` : ""}
          </p>

          {chief_complaint && (
            <div className="mt-4 bg-white/[0.12] backdrop-blur rounded-[14px] px-3.5 py-2.5">
              <p className="text-[10px] font-extrabold text-blue-300 tracking-[0.12em] uppercase mb-0.5">
                Chief Complaint
              </p>
              <p className="text-[13px] font-bold text-white">
                {chief_complaint}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-1.5 text-[12px] text-blue-200/90">
              <CalendarIcon />
              {fmtDate(date_issued)}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/[0.18] hover:bg-white/[0.28] text-white text-[12px] font-bold px-3.5 py-2 rounded-full border-none cursor-pointer transition-colors"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Doctor ──────────────────────────────────────────── */}
      <SectionHeader
        icon={<ScopeIcon />}
        title="Prescribing Physician"
        iconBg="bg-green-50"
      />
      <div className="bg-white rounded-[22px] p-5 shadow-[0_2px_18px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full translate-x-1/3 -translate-y-1/3 opacity-70" />
        <div className="flex gap-4 items-start relative z-10">
          <div
            className="w-13 h-13 rounded-[18px] flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#34D399,#0D9488)",
              boxShadow: "0 6px 16px rgba(20,184,166,.3)",
            }}
          >
            <ScopeIcon />
          </div>
          <div>
            <p className="text-[16px] font-extrabold text-slate-900 leading-tight">
              {doctor.name}
            </p>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
              {doctor.qualifications}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                <ClipboardIcon /> Lic. #{doctor.license_number}
              </span>
              {doctor.clinic_name &&
                doctor.clinic_name !== "Unknown Clinic" && (
                  <span className="text-[11px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full">
                    {doctor.clinic_name}
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Vitals ─────────────────────────────────────────── */}
      <SectionHeader icon={<ActivityIcon />} title="Vitals at Visit" />
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: <HeartIcon />,
            label: "Blood Pressure",
            value: vitals?.BP,
            unit: "mmHg",
            blob: "bg-red-500",
            iconBg: "bg-red-50",
          },
          {
            icon: <DropletsIcon />,
            label: "FBS",
            value: vitals?.FBS,
            unit: "mg/dL",
            blob: "bg-orange-500",
            iconBg: "bg-orange-50",
          },
          {
            icon: <FlaskIcon />,
            label: "PPBS",
            value: vitals?.PPBS,
            unit: "mg/dL",
            blob: "bg-violet-500",
            iconBg: "bg-violet-50",
          },
        ].map(({ icon, label, value, unit, blob, iconBg }) => (
          <div
            key={label}
            className="bg-white rounded-[20px] p-4 relative overflow-hidden shadow-[0_2px_18px_rgba(0,0,0,0.06)]"
          >
            <div
              className={`absolute top-0 right-0 w-16 h-16 ${blob} opacity-[0.08] rounded-full translate-x-1/3 -translate-y-1/3`}
            />
            <div
              className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center mb-2.5`}
            >
              {icon}
            </div>
            <p className="text-[18px] font-black text-slate-900 leading-none">
              {value ?? "—"}
              {value && (
                <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                  {unit}
                </span>
              )}
            </p>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.1em] uppercase mt-1.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Medications ─────────────────────────────────────── */}
      <SectionHeader
        icon={<PillIcon />}
        title={`Medications · ${medications.length}`}
      />
      <div className="flex flex-col gap-3">
        {medications.map((med: any, i: number) => {
          const fs = freqStyle(med.frequency);
          const isTopical = (med.route || "").toLowerCase() === "topical";
          const validStrength =
            med.strength && med.strength !== "Not specified";
          return (
            <div
              key={i}
              className="bg-white rounded-[20px] pl-5 pr-4 py-4 relative overflow-hidden shadow-[0_2px_14px_rgba(0,0,0,0.05)] animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${isTopical ? "bg-emerald-500" : "bg-blue-500"}`}
              />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-extrabold text-slate-900 leading-tight">
                      {med.name}
                    </span>
                    {validStrength && (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        {med.strength}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1">
                    {med.dosage}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 mt-0.5">
                  <ClockIcon />
                  {med.duration || "—"}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mt-3">
                {/* Frequency badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${fs.bg} ${fs.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${fs.dot}`} />
                  {med.frequency}
                </span>
                {/* Route badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    isTopical
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {isTopical ? <LayersIcon /> : <PillIcon />}
                  {med.route}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Clinical Notes ───────────────────────────────────── */}
      {clinical_notes && (
        <>
          <SectionHeader
            icon={<AlertIcon />}
            title="Clinical Notes"
            iconBg="bg-amber-50"
          />
          <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-amber-200 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5">
                <AlertIcon />
              </div>
              <p className="text-[13px] font-medium text-amber-900 leading-relaxed">
                {clinical_notes}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Follow-up ────────────────────────────────────────── */}
      {followDate && (
        <>
          <SectionHeader
            icon={<CalendarIcon />}
            title="Follow-up Appointment"
          />
          <div className="bg-white rounded-[20px] p-4 flex items-center gap-4 shadow-[0_2px_18px_rgba(0,0,0,0.06)]">
            <div className="rounded-2xl overflow-hidden border border-indigo-100 shrink-0 w-16">
              <div className="bg-indigo-600 text-white text-[10px] font-extrabold text-center py-1.5 tracking-[0.12em] uppercase">
                {followDate.toLocaleString("en-IN", { month: "short" })}
              </div>
              <div className="bg-white text-indigo-900 text-[26px] font-black text-center py-1.5 leading-none">
                {followDate.getDate()}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-slate-900">
                {followDate.toLocaleDateString("en-IN", { weekday: "long" })}
              </p>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {followDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mt-1.5">
                <ClockIcon /> Scheduled Review
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Reset ────────────────────────────────────────────── */}
      <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 my-6">
        <div className="flex gap-3">
          <div className="w-7 h-7 bg-red-200 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5">
            <AlertIcon />
          </div>
          <div>
            <p className="text-[13px] font-bold text-red-900 mb-1">
              ⚠️ Important Disclaimer
            </p>
            <p className="text-[12px] font-medium text-red-800 leading-relaxed">
              This prescription information has been transcribed from an image
              using AI technology. While we strive for accuracy, transcription
              errors can occur.{" "}
              <span className="font-bold">
                Do not rely solely on this information for medical decisions.
              </span>{" "}
              Always consult with your doctor or pharmacist to verify the
              prescription details and get professional guidance before taking
              any medication.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-6 py-3.5 rounded-[20px] border-2 border-dashed border-slate-200 bg-transparent text-slate-400 font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        <UploadIcon /> Upload another prescription
      </button>
    </div>
  );
};

export default Dashboard;
