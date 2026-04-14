import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BellPlus,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  Clock,
  Droplets,
  ExternalLink,
  FlaskConical,
  Heart,
  IndianRupee,
  Info,
  Layers,
  Phone,
  Pill,
  RefreshCw,
  Stethoscope,
  User,
} from "lucide-react";
import { buildGoogleCalendarUrl, downloadICS, generateICS } from "../lib/calendar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

// ─── Types ───────────────────────────────────────────────────────
interface AlternativeMedicine {
  name: string;
  type: string;
  price_inr?: string | null;
}

interface Medication {
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  purpose?: string | null;
  price_inr?: string | null;
  instructions?: string | null;
  side_effects?: string[];
  contraindications?: string[];
  precautions?: string;
  alternatives?: AlternativeMedicine[];
}

export interface PrescriptionData {
  prescription_id: string;
  date_issued: string;
  chief_complaint?: string | null;
  diagnosis?: string[];
  clinical_notes?: string | null;
  follow_up_date?: string | null;
  follow_up_time?: string | null;
  vitals_at_visit?: { BP?: string; FBS?: string; PPBS?: string } | null;
  patient: {
    name: string;
    age: number;
    gender: string;
    blood_group?: string | null;
    date_of_birth?: string;
    contact_number?: string | null;
    known_allergies?: string[];
    chronic_conditions?: string[];
  };
  doctor: {
    name: string;
    specialization?: string | null;
    qualifications?: string | null;
    license_number?: string | null;
    clinic_name?: string | null;
    clinic_address?: string | null;
    contact_number?: string | null;
  };
  medications: Medication[];
}

// ─── Sample data ─────────────────────────────────────────────────
export const SAMPLE_DATA: PrescriptionData = {
  prescription_id: "RX-2022-1012-001",
  date_issued: "2022-10-12T00:00:00Z",
  patient: {
    name: "Sachin Sansare",
    date_of_birth: "1994-01-01",
    age: 28,
    gender: "Male",
    blood_group: null,
    contact_number: null,
    known_allergies: [],
    chronic_conditions: [],
  },
  doctor: {
    name: "Dr. Amita",
    specialization: "General Dentistry",
    license_number: null,
    qualifications: null,
    clinic_name: "THE White TUSK",
    clinic_address: "Not specified, contact: +91 8108112511, info@thewhitetusk.com",
    contact_number: "+91 8108112511",
  },
  medications: [
    {
      name: "Augmentin",
      strength: "625mg",
      dosage: "1 tablet",
      frequency: "Twice a day (morning and night)",
      route: "Oral",
      duration: "5 days",
      purpose: "To fight the bacterial infection in your mouth and gums, and to prevent it from spreading after your dental procedure.",
      price_inr: "₹240–280 / strip of 6 tablets",
      instructions: "Take after meals",
      side_effects: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Skin rash", "Candidiasis"],
      contraindications: [
        "Hypersensitivity to penicillin or clavulanic acid",
        "History of cholestatic jaundice/hepatic dysfunction associated with amoxicillin-clavulanate",
      ],
      precautions: "Use with caution in patients with renal or hepatic impairment.",
      alternatives: [
        { name: "Moxikind-CV 625mg", type: "alternative", price_inr: "₹160–185 / strip of 6 tablets" },
        { name: "Clavam 625mg", type: "alternative", price_inr: "₹195–225 / strip of 6 tablets" },
        { name: "Amoxyclav 625mg", type: "alternative", price_inr: "₹170–200 / strip of 6 tablets" },
        { name: "Amoxicillin + Clavulanic Acid 625mg", type: "generic", price_inr: "₹80–120 / strip of 6 tablets" },
      ],
    },
    {
      name: "Enzoflam",
      strength: "Diclofenac 50mg + Paracetamol 325mg + Serratiopeptidase 15mg",
      dosage: "1 tablet",
      frequency: "Twice a day (morning and night)",
      route: "Oral",
      duration: "5 days",
      purpose: "To relieve pain, reduce swelling, and bring down inflammation in your gums and jaw after the dental procedure.",
      price_inr: "₹120–150 / strip of 10 tablets",
      instructions: "Take after meals",
      side_effects: ["Nausea", "Stomach pain", "Indigestion", "Dizziness", "Drowsiness"],
      contraindications: [
        "Hypersensitivity to NSAIDs",
        "Active peptic ulcer",
        "Severe renal or hepatic impairment",
        "Third trimester of pregnancy",
      ],
      precautions: "Avoid alcohol. Use with caution in cardiovascular disease or hypertension.",
      alternatives: [
        { name: "Serata-D Tablet", type: "alternative", price_inr: "₹90–115 / strip of 10 tablets" },
        { name: "Enzoflam-D Tablet", type: "alternative", price_inr: "₹105–135 / strip of 10 tablets" },
        { name: "Diclofenac + Paracetamol + Serratiopeptidase", type: "generic", price_inr: "₹40–65 / strip of 10 tablets" },
      ],
    },
    {
      name: "Pan D",
      strength: "Pantoprazole 40mg + Domperidone 10mg",
      dosage: "1 tablet",
      frequency: "Once a day (morning)",
      route: "Oral",
      duration: "5 days",
      purpose: "To protect your stomach — it reduces acid and prevents the nausea or stomach upset that the other medicines (antibiotic and painkiller) can cause.",
      price_inr: "₹130–160 / strip of 10 tablets",
      instructions: "Take before meals",
      side_effects: ["Headache", "Nausea", "Diarrhea", "Dizziness"],
      contraindications: [
        "Hypersensitivity to pantoprazole or domperidone",
        "Moderate to severe hepatic impairment",
      ],
      precautions: "Long-term use may increase risk of osteoporosis.",
      alternatives: [
        { name: "Pantocid-D", type: "alternative", price_inr: "₹95–120 / strip of 10 tablets" },
        { name: "Pentaloc-D", type: "alternative", price_inr: "₹105–130 / strip of 10 tablets" },
        { name: "Pantoprazole + Domperidone", type: "generic", price_inr: "₹30–55 / strip of 10 tablets" },
      ],
    },
    {
      name: "Hexigel Gum Paint",
      strength: "0.2% Chlorhexidine Gluconate",
      dosage: "Apply a small amount and massage",
      frequency: "Twice a day (morning and night)",
      route: "Topical (oral)",
      duration: "1 week",
      purpose: "To keep your gums clean, kill bacteria, and prevent gum infection at the site of your dental treatment.",
      price_inr: "₹90–120 / 30g tube",
      instructions: "Massage onto gums. Do not swallow.",
      side_effects: ["Temporary staining of teeth", "Altered taste", "Burning sensation"],
      contraindications: ["Hypersensitivity to chlorhexidine"],
      precautions: "For oral use only. Do not swallow. Keep out of reach of children.",
      alternatives: [
        { name: "Rexidin M Forte Gel", type: "alternative", price_inr: "₹70–90 / 30g tube" },
        { name: "Perio-Aid Gel", type: "alternative", price_inr: "₹60–80 / tube" },
        { name: "Chlorhexidine Gluconate Gel", type: "generic", price_inr: "₹35–55 / tube" },
      ],
    },
  ],
  chief_complaint: null,
  diagnosis: [],
  vitals_at_visit: null,
  clinical_notes: null,
  follow_up_date: null,
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

/** "HH:MM" → "9:30 AM" */
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const freqBadge = (freq: string) => {
  const f = (freq || "").toLowerCase();
  if (f.includes("three") || f.includes("3") || f.includes("tid") || f.includes("tds"))
    return { variant: "orange" as const, label: "TDS" };
  if (f.includes("twice") || f.includes("2") || f.includes("bd"))
    return { variant: "info" as const, label: "BD" };
  if (f.includes("once") || f.includes("1") || f.includes("od"))
    return { variant: "success" as const, label: "OD" };
  return { variant: "purple" as const, label: "PRN" };
};

const isTopical = (route: string) =>
  (route || "").toLowerCase().includes("topical");

const buildSummary = (data: PrescriptionData) => {
  const vitalsStr = data.vitals_at_visit
    ? `Vitals: BP ${data.vitals_at_visit.BP} | FBS ${data.vitals_at_visit.FBS} mg/dL | PPBS ${data.vitals_at_visit.PPBS} mg/dL\n\n`
    : "";
  return `PRESCRIPTION: ${data.prescription_id} | Date: ${fmtDate(data.date_issued)}
Patient: ${data.patient.name}, ${data.patient.age} yrs, ${data.patient.gender}
Doctor: ${data.doctor.name}${data.doctor.specialization ? ` (${data.doctor.specialization})` : ""}

${vitalsStr}MEDICATIONS:
${data.medications
  .map((m, i) => {
    let line = `${i + 1}. ${m.name}${m.strength ? ` ${m.strength}` : ""} — ${m.frequency} for ${m.duration}`;
    if (m.purpose) line += `\n   Purpose: ${m.purpose}`;
    if (m.instructions) line += `\n   Instructions: ${m.instructions}`;
    if (m.alternatives?.length)
      line += `\n   Alternatives: ${m.alternatives.map((a) => a.name).join(", ")}`;
    return line;
  })
  .join("\n")}
${data.clinical_notes ? `\nNotes: ${data.clinical_notes}` : ""}
${data.follow_up_date ? `Follow-up: ${data.follow_up_date}` : ""}`.trim();
};

// ─── Sub-components ───────────────────────────────────────────────

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-800 mt-0.5 leading-snug">{value}</p>
    </div>
  </div>
);

// ─── Dashboard ───────────────────────────────────────────────────
interface DashboardProps {
  data: unknown;
  onReset: () => void;
  demoMode?: boolean;
}

const Dashboard = ({ data: rawData, onReset, demoMode = false }: DashboardProps) => {
  const data = rawData as PrescriptionData;
  const [copied, setCopied] = useState(false);
  const [expandedMeds, setExpandedMeds] = useState<Set<number>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(new Set());

  const {
    patient, doctor,
    vitals_at_visit: vitals,
    medications,
    clinical_notes,
    follow_up_date,
    follow_up_time,
    chief_complaint,
    prescription_id,
    date_issued,
    diagnosis,
  } = data;

  const toggleAlts = (i: number) => {
    const s = new Set(expandedMeds);
    s.has(i) ? s.delete(i) : s.add(i);
    setExpandedMeds(s);
  };

  const toggleDetails = (i: number) => {
    const s = new Set(expandedDetails);
    s.has(i) ? s.delete(i) : s.add(i);
    setExpandedDetails(s);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(buildSummary(data)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const followDate = follow_up_date ? new Date(follow_up_date) : null;

  return (
    <div className="animate-[fadeIn_0.4s_ease_both]">
      {/* ── Demo Mode Banner ─────────────────────────────────── */}
      {demoMode && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
            <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Demo Mode</span>
              {" — "}Sample prescription data is displayed because the AI service is temporarily unavailable (quota limit). All features and UI are fully functional.
            </p>
          </div>
        </div>
      )}

      {/* ── Prescription Header Banner ───────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {/* Rx ID + Verified */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[dot-pulse_1.6s_ease-in-out_infinite]" />
                  {prescription_id}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 border border-green-400/30 px-2.5 py-1 text-xs font-semibold text-green-300">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {patient.name}
              </h1>
              <p className="mt-1 text-blue-200 text-sm">
                {patient.age} yrs · {patient.gender}
                {patient.blood_group ? ` · ${patient.blood_group}` : ""}
              </p>

              {chief_complaint && (
                <div className="mt-3 inline-block rounded-lg bg-white/10 border border-white/15 px-3.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-0.5">
                    Chief Complaint
                  </p>
                  <p className="text-sm font-semibold text-white">{chief_complaint}</p>
                </div>
              )}

              {diagnosis && diagnosis.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {diagnosis.map((d, i) => (
                    <span key={i} className="rounded-full bg-white/15 border border-white/20 px-2.5 py-0.5 text-xs text-white/90">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: date + copy */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-sm text-blue-200">
                <Calendar className="w-4 h-4" />
                {fmtDate(date_issued)}
              </div>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-none"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Summary"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content grid ────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          {/* ════════════════════════════════════════
              Left Column — Patient, Doctor, Vitals
          ════════════════════════════════════════ */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

            {/* Patient Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </span>
                  <CardTitle>Patient</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-slate-100">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Full Name" value={patient.name} />
                <InfoRow
                  icon={<Activity className="w-3.5 h-3.5" />}
                  label="Age & Gender"
                  value={`${patient.age} years · ${patient.gender}`}
                />
                {patient.blood_group && (
                  <InfoRow icon={<Heart className="w-3.5 h-3.5" />} label="Blood Group" value={patient.blood_group} />
                )}
                {patient.contact_number && (
                  <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Contact" value={patient.contact_number} />
                )}
                {patient.known_allergies && patient.known_allergies.length > 0 && (
                  <div className="py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Known Allergies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {patient.known_allergies.map((a) => (
                        <Badge key={a} variant="destructive" size="sm">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                  <div className="py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Chronic Conditions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {patient.chronic_conditions.map((c) => (
                        <Badge key={c} variant="warning" size="sm">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                  </span>
                  <CardTitle>Prescribing Physician</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-slate-100">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Doctor" value={doctor.name} />
                {doctor.specialization && (
                  <InfoRow icon={<Stethoscope className="w-3.5 h-3.5" />} label="Specialization" value={doctor.specialization} />
                )}
                {doctor.qualifications && (
                  <InfoRow icon={<BadgeCheck className="w-3.5 h-3.5" />} label="Qualifications" value={doctor.qualifications} />
                )}
                {doctor.clinic_name && (
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Clinic" value={doctor.clinic_name} />
                )}
                {doctor.contact_number && (
                  <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Contact" value={doctor.contact_number} />
                )}
                {doctor.clinic_address && (
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Address" value={doctor.clinic_address} />
                )}
              </CardContent>
            </Card>

            {/* Vitals Card */}
            {vitals && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                      <Activity className="h-5 w-5 text-red-600" />
                    </span>
                    <CardTitle>Vitals at Visit</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <Heart className="w-4 h-4 text-red-500" />, label: "Blood Pressure", value: vitals?.BP, unit: "mmHg", accent: "bg-red-50 border-red-100" },
                      { icon: <Droplets className="w-4 h-4 text-orange-500" />, label: "FBS", value: vitals?.FBS, unit: "mg/dL", accent: "bg-orange-50 border-orange-100" },
                      { icon: <FlaskConical className="w-4 h-4 text-violet-500" />, label: "PPBS", value: vitals?.PPBS, unit: "mg/dL", accent: "bg-violet-50 border-violet-100" },
                    ].map(({ icon, label, value, unit, accent }) => (
                      <div key={label} className={`rounded-xl border p-3 ${accent}`}>
                        {icon}
                        <p className="mt-2 text-base font-bold text-slate-900 leading-none">
                          {value ?? "—"}
                          {value && <span className="text-[10px] font-semibold text-slate-400 ml-0.5">{unit}</span>}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Follow-up Card */}
            {followDate && (
              <Card className="border-indigo-100">
                <CardContent className="p-4 space-y-3">
                  {/* Date widget row */}
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 overflow-hidden rounded-xl border border-indigo-100 w-14 text-center">
                      <div className="bg-indigo-600 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        {followDate.toLocaleString("en-IN", { month: "short" })}
                      </div>
                      <div className="bg-white py-2 text-2xl font-black text-indigo-900 leading-none">
                        {followDate.getDate()}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {followDate.toLocaleDateString("en-IN", { weekday: "long" })}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {followDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      {follow_up_time && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-indigo-700">
                          <Clock className="w-3 h-3" />
                          {fmtTime(follow_up_time)}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-500">
                        <CalendarClock className="w-3.5 h-3.5" />
                        Scheduled Review
                      </p>
                    </div>
                  </div>

                  {/* Calendar action buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        const content = generateICS({
                          title: `Follow-up: ${patient.name}`,
                          date: follow_up_date!,
                          time: follow_up_time,
                          description: [
                            `Follow-up with ${doctor.name}`,
                            doctor.specialization && `Specialty: ${doctor.specialization}`,
                            doctor.clinic_name && `Clinic: ${doctor.clinic_name}`,
                            doctor.contact_number && `Contact: ${doctor.contact_number}`,
                            "Generated by RxLens",
                          ].filter(Boolean).join("\n"),
                          location: doctor.clinic_address ?? doctor.clinic_name ?? undefined,
                        });
                        downloadICS("rxlens-followup.ics", content);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition-colors"
                    >
                      <BellPlus className="w-3.5 h-3.5" />
                      Set Reminder
                    </button>
                    <a
                      href={buildGoogleCalendarUrl({
                        title: `Follow-up: ${patient.name}`,
                        date: follow_up_date!,
                        time: follow_up_time,
                        description: [
                          `Follow-up with ${doctor.name}`,
                          doctor.clinic_name && `Clinic: ${doctor.clinic_name}`,
                        ].filter(Boolean).join("\n"),
                        location: doctor.clinic_name ?? undefined,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Google Cal
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ════════════════════════════════════════
              Right Column — Medications + Notes
          ════════════════════════════════════════ */}
          <div className="space-y-4">

            {/* Medications section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-slate-500" />
                <h2 className="text-base font-semibold text-slate-900">
                  Medications
                </h2>
                <Badge variant="secondary" className="font-semibold">
                  {medications.length}
                </Badge>
              </div>
            </div>

            {/* Medication Cards */}
            {medications.map((med, i) => {
              const freq = freqBadge(med.frequency);
              const topical = isTopical(med.route);
              const validStrength = med.strength && med.strength !== "Not specified";
              const hasAlts = (med.alternatives?.length ?? 0) > 0;
              const hasSideEffects = (med.side_effects?.length ?? 0) > 0;
              const hasContra = (med.contraindications?.length ?? 0) > 0;
              const hasPrecautions = !!med.precautions;
              const hasDetails = hasSideEffects || hasContra || hasPrecautions;
              const altsOpen = expandedMeds.has(i);
              const detailsOpen = expandedDetails.has(i);

              return (
                <Card
                  key={i}
                  className="overflow-hidden animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Accent top border */}
                  <div className={`h-1 w-full ${topical ? "bg-teal-500" : "bg-blue-500"}`} />

                  <CardContent className="p-5">
                    {/* Top row: name + duration */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-bold text-slate-900 leading-tight">
                            {med.name}
                          </span>
                          {validStrength && (
                            <Badge variant="secondary" size="sm">
                              {med.strength}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{med.dosage}</p>

                        {/* Purpose — why the patient is taking this */}
                        {med.purpose && (
                          <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-violet-50 border border-violet-100 px-3 py-2.5">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-200">
                              <span className="text-[10px] font-black text-violet-700">?</span>
                            </span>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-500 mb-0.5">
                                Why you're taking this
                              </p>
                              <p className="text-sm text-violet-900 leading-snug">
                                {med.purpose}
                              </p>
                            </div>
                          </div>
                        )}

                        {med.instructions && (
                          <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                            {med.instructions}
                          </p>
                        )}

                        {med.price_inr && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-sm">
                            <IndianRupee className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="font-semibold text-green-800">{med.price_inr}</span>
                            <span className="text-xs text-green-600">(approx.)</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {med.duration || "—"}
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {/* Frequency */}
                      <Badge variant={freq.variant}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {med.frequency}
                      </Badge>

                      {/* Route */}
                      <Badge variant={topical ? "teal" : "info"}>
                        {topical ? <Layers className="w-3 h-3" /> : <Pill className="w-3 h-3" />}
                        {med.route}
                      </Badge>

                      {/* Details toggle */}
                      {hasDetails && (
                        <button
                          onClick={() => toggleDetails(i)}
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer border",
                            detailsOpen
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                          ].join(" ")}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Details
                          {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}

                      {/* Alternatives toggle */}
                      {hasAlts && (
                        <button
                          onClick={() => toggleAlts(i)}
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer border",
                            altsOpen
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                          ].join(" ")}
                        >
                          <FlaskConical className="w-3 h-3" />
                          Alternatives
                          {altsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* ── Details panel ─────────────────────────── */}
                    {hasDetails && detailsOpen && (
                      <div className="mt-4 animate-[slideDown_0.25s_ease]">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {hasSideEffects && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                                Side Effects
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {med.side_effects!.map((e, idx) => (
                                  <Badge key={idx} variant="destructive" size="sm">
                                    {e}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasContra && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                                Contraindications
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {med.contraindications!.map((c, idx) => (
                                  <Badge key={idx} variant="warning" size="sm">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasPrecautions && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                                Precautions
                              </p>
                              <p className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-sm text-blue-900 leading-relaxed">
                                {med.precautions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Alternatives panel ────────────────────── */}
                    {hasAlts && altsOpen && (
                      <div className="mt-4 animate-[slideDown_0.25s_ease]">
                        <Separator className="mb-4" />
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Alternative Medicines
                          </p>
                          <p className="text-[10px] text-slate-400 italic">prices approx. — Indian pharmacy</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {med.alternatives!.map((alt, altIdx) => {
                            const name = typeof alt === "string" ? alt : alt.name;
                            const type = typeof alt === "string" ? "alternative" : alt.type;
                            const price = typeof alt === "string" ? null : alt.price_inr;
                            const isGeneric = type === "generic";
                            return (
                              <div
                                key={altIdx}
                                className={[
                                  "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium",
                                  isGeneric
                                    ? "bg-blue-50 border-blue-200 text-blue-800"
                                    : "bg-purple-50 border-purple-200 text-purple-800",
                                ].join(" ")}
                              >
                                <FlaskConical className={`w-3.5 h-3.5 shrink-0 ${isGeneric ? "text-blue-500" : "text-purple-500"}`} />
                                <span className="flex-1 min-w-0">{name}</span>
                                {price && (
                                  <span className={`text-xs font-semibold shrink-0 ${isGeneric ? "text-blue-600" : "text-purple-600"}`}>
                                    {price}
                                  </span>
                                )}
                                {isGeneric && (
                                  <Badge variant="info" size="sm">Generic</Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Clinical Notes */}
            {clinical_notes && (
              <Alert variant="warning">
                <AlertTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Clinical Notes
                </AlertTitle>
                <AlertDescription className="mt-1">{clinical_notes}</AlertDescription>
              </Alert>
            )}

            {/* Disclaimer */}
            <Alert variant="destructive">
              <AlertTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Important Disclaimer
              </AlertTitle>
              <AlertDescription className="mt-1 text-red-800">
                This prescription has been transcribed from an image using AI. While we strive for
                accuracy, transcription errors can occur.{" "}
                <strong>Do not rely solely on this information for medical decisions.</strong> Always
                consult your doctor or pharmacist to verify details before taking any medication.
              </AlertDescription>
            </Alert>

            {/* Reset */}
            <Button
              variant="outline"
              size="lg"
              onClick={onReset}
              className="w-full border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4" />
              Upload another prescription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
