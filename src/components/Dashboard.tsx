import { useState } from "react";
import {
  ActivityIcon,
  AlertIcon,
  CalendarIcon,
  CheckIcon,
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
  prescription_id: "RX-2022-1012-001",
  date_issued: "2022-10-12T00:00:00Z",
  patient: {
    name: "Sachin Sansare",
    date_of_birth: "1994-01-01",
    age: 28,
    gender: "Male",
    blood_group: null,
    contact_number: null,
    emergency_contact: null,
    known_allergies: [],
    chronic_conditions: [],
  },
  doctor: {
    id: null,
    name: "Dr. Amita",
    specialization: "General Dentistry",
    license_number: null,
    qualifications: null,
    clinic_name: "THE White TUSK",
    clinic_address:
      "Not specified, contact: +91 8108112511, info@thewhitetusk.com",
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
      instructions: "Take after meals",
      side_effects: [
        "Nausea",
        "Vomiting",
        "Diarrhea",
        "Abdominal pain",
        "Skin rash",
        "Candidiasis",
      ],
      contraindications: [
        "Hypersensitivity to penicillin or clavulanic acid",
        "History of cholestatic jaundice/hepatic dysfunction associated with amoxicillin-clavulanate",
      ],
      precautions:
        "Use with caution in patients with renal or hepatic impairment. Inform your doctor if you have mononucleosis. Consult doctor if pregnant or breastfeeding.",
      alternatives: [
        { name: "Moxikind-CV 625mg", type: "alternative" },
        { name: "Clavam 625mg", type: "alternative" },
        { name: "Amoxyclav 625mg", type: "alternative" },
        { name: "Amoxicillin + Clavulanic Acid 625mg", type: "generic" },
      ],
    },
    {
      name: "Enzoflam",
      strength:
        "Diclofenac Potassium 50mg + Paracetamol 325mg + Serratiopeptidase 15mg",
      dosage: "1 tablet",
      frequency: "Twice a day (morning and night)",
      route: "Oral",
      duration: "5 days",
      instructions: "Take after meals",
      side_effects: [
        "Nausea",
        "Vomiting",
        "Stomach pain",
        "Indigestion",
        "Heartburn",
        "Diarrhea",
        "Dizziness",
        "Drowsiness",
      ],
      contraindications: [
        "Hypersensitivity to NSAIDs, aspirin, or paracetamol",
        "Active peptic ulcer",
        "Severe renal or hepatic impairment",
        "Severe heart failure",
        "Third trimester of pregnancy",
      ],
      precautions:
        "Use with caution in patients with asthma, bleeding disorders, cardiovascular disease, or hypertension. Avoid alcohol consumption. Consult doctor if pregnant or breastfeeding.",
      alternatives: [
        { name: "Serata-D Tablet", type: "alternative" },
        { name: "Enzoflam-D Tablet", type: "alternative" },
        {
          name: "Diclofenac Potassium + Paracetamol + Serratiopeptidase",
          type: "generic",
        },
      ],
    },
    {
      name: "Pan D",
      strength: "Pantoprazole 40mg + Domperidone 10mg",
      dosage: "1 tablet",
      frequency: "Once a day (morning)",
      route: "Oral",
      duration: "5 days",
      instructions: "Take before meals",
      side_effects: [
        "Headache",
        "Nausea",
        "Diarrhea",
        "Abdominal pain",
        "Flatulence",
        "Dry mouth",
        "Dizziness",
      ],
      contraindications: [
        "Hypersensitivity to pantoprazole or domperidone",
        "Moderate to severe hepatic impairment",
        "Conditions where gastric motility stimulation is harmful (e.g., GI hemorrhage, mechanical obstruction, perforation)",
        "Prolactin-releasing pituitary tumor",
        "Cardiac conduction abnormalities (QT prolongation)",
      ],
      precautions:
        "Long-term use may increase the risk of osteoporosis and C. difficile infection. Use with caution in patients with severe renal impairment. Consult doctor if pregnant or breastfeeding.",
      alternatives: [
        { name: "Pantocid-D", type: "alternative" },
        { name: "Pentaloc-D", type: "alternative" },
        { name: "Nupenta-D", type: "alternative" },
        { name: "Pantoprazole + Domperidone", type: "generic" },
      ],
    },
    {
      name: "Hexigel gum paint",
      strength: "0.2% Chlorhexidine Gluconate",
      dosage: "Apply a small amount and massage",
      frequency: "Twice a day (morning and night)",
      route: "Topical (oral)",
      duration: "1 week",
      instructions: "Massage onto gums. Do not swallow.",
      side_effects: [
        "Temporary staining of teeth and tongue",
        "Altered taste sensation",
        "Burning sensation",
      ],
      contraindications: ["Hypersensitivity to chlorhexidine"],
      precautions:
        "For oral use only. Do not swallow. Avoid contact with eyes and ears. Keep out of reach of children.",
      alternatives: [
        { name: "Rexidin M Forte Gel", type: "alternative" },
        { name: "Perio-Aid Gel", type: "alternative" },
        { name: "Chlorhexidine Gluconate Gel/Mouthwash", type: "generic" },
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

const buildSummary = (data: any) => {
  const vitalsStr = data.vitals_at_visit
    ? `Vitals:  BP ${data.vitals_at_visit.BP}  |  FBS ${data.vitals_at_visit.FBS} mg/dL  |  PPBS ${data.vitals_at_visit.PPBS} mg/dL\n\n`
    : "";
  const notesStr = data.clinical_notes ? `Notes: ${data.clinical_notes}\n` : "";
  const followStr = data.follow_up_date
    ? `Follow-up: ${data.follow_up_date}\n`
    : "";

  return `
PRESCRIPTION: ${data.prescription_id}  |  Date: ${fmtDate(data.date_issued)}
Patient: ${data.patient.name}, ${data.patient.age} yrs, ${data.patient.gender}
Doctor:  ${data.doctor.name}${data.doctor.specialization ? ` (${data.doctor.specialization})` : ""}

${vitalsStr}MEDICATIONS:
${data.medications
  .map((m: any, i: number) => {
    let details = `${i + 1}. ${m.name}${m.strength ? ` ${m.strength}` : ""} — ${m.frequency} (${m.duration})`;
    if (m.instructions) details += `\n   Instructions: ${m.instructions}`;
    if (m.side_effects && m.side_effects.length > 0) {
      details += `\n   Side Effects: ${m.side_effects.join(", ")}`;
    }
    if (m.contraindications && m.contraindications.length > 0) {
      details += `\n   Contraindications: ${m.contraindications.join(", ")}`;
    }
    if (m.precautions) {
      details += `\n   Precautions: ${m.precautions}`;
    }
    if (m.alternatives && m.alternatives.length > 0) {
      const altNames = m.alternatives
        .map((alt: any) => (typeof alt === "string" ? alt : alt.name))
        .join(", ");
      details += `\n   Alternatives: ${altNames}`;
    }
    return details;
  })
  .join("\n")}

${notesStr}${followStr}
`.trim();
};

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
  const [expandedMeds, setExpandedMeds] = useState<Set<number>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(
    new Set(),
  );
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

  const toggleAlternatives = (index: number) => {
    const newSet = new Set(expandedMeds);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedMeds(newSet);
  };

  const toggleDetails = (index: number) => {
    const newSet = new Set(expandedDetails);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedDetails(newSet);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(buildSummary(data)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const followDate = follow_up_date ? new Date(follow_up_date) : null;

  return (
    <div className="px-4 pb-16 mx-auto max-w-180">
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
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-green-50 translate-x-1/3 -translate-y-1/3 opacity-70" />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="w-13 h-13 rounded-[18px] flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#34D399,#0D9488)",
              boxShadow: "0 6px 16px rgba(20,184,166,.3)",
            }}
          >
            <ScopeIcon />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-extrabold text-slate-900 leading-tight">
              {doctor.name}
            </p>
            {doctor.specialization && (
              <p className="text-[12px] text-slate-500 mt-0.5 font-semibold">
                {doctor.specialization}
              </p>
            )}
            {doctor.qualifications && (
              <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                {doctor.qualifications}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.clinic_name && (
                <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                  {doctor.clinic_name}
                </span>
              )}
              {doctor.contact_number && (
                <span className="text-[11px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full">
                  {doctor.contact_number}
                </span>
              )}
            </div>
            {doctor.clinic_address && (
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {doctor.clinic_address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Vitals ─────────────────────────────────────────── */}
      {vitals && (
        <>
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
        </>
      )}

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
          const hasAlternatives =
            med.alternatives && med.alternatives.length > 0;
          const hasSideEffects =
            med.side_effects && med.side_effects.length > 0;
          const hasContraindications =
            med.contraindications && med.contraindications.length > 0;
          const hasPrecautions = med.precautions && med.precautions.length > 0;
          const hasDetails =
            hasSideEffects || hasContraindications || hasPrecautions;
          const isExpanded = expandedMeds.has(i);
          const detailsExpanded = expandedDetails.has(i);
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
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
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
                  {med.instructions && (
                    <p className="text-[11px] text-slate-600 mt-1.5 italic">
                      💡 {med.instructions}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 mt-0.5">
                  <ClockIcon />
                  {med.duration || "—"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
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
                {/* Details toggle */}
                {hasDetails && (
                  <button
                    onClick={() => toggleDetails(i)}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      detailsExpanded
                        ? "bg-red-50 text-red-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <AlertIcon />
                    {detailsExpanded ? "Hide details" : "Details"}
                  </button>
                )}
                {/* Alternatives toggle */}
                {hasAlternatives && (
                  <button
                    onClick={() => toggleAlternatives(i)}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      isExpanded
                        ? "bg-purple-50 text-purple-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FlaskIcon />
                    {isExpanded ? "Hide alternatives" : "Alternatives"}
                  </button>
                )}
              </div>

              {/* Details section */}
              {hasDetails && detailsExpanded && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-3.5">
                  {hasSideEffects && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.1em] uppercase mb-2">
                        Side Effects
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {med.side_effects.map((effect: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2.5 py-1.5 rounded-[10px] bg-red-50 text-red-700 border border-red-200"
                          >
                            • {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasContraindications && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.1em] uppercase mb-2">
                        Contraindications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {med.contraindications.map(
                          (contra: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2.5 py-1.5 rounded-[10px] bg-amber-50 text-amber-700 border border-amber-200"
                            >
                              ⚠️ {contra}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {hasPrecautions && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.1em] uppercase mb-2">
                        Precautions
                      </p>
                      <p className="text-[11px] text-slate-700 leading-relaxed px-2.5 py-1.5 rounded-[10px] bg-blue-50 border border-blue-200">
                        {med.precautions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Alternatives section */}
              {hasAlternatives && isExpanded && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.1em] uppercase mb-2.5">
                    Alternative Medicines
                  </p>
                  <div className="flex flex-col gap-2">
                    {med.alternatives.map((alt: any, altIdx: number) => {
                      const altName = typeof alt === "string" ? alt : alt.name;
                      const altType =
                        typeof alt === "string" ? "alternative" : alt.type;
                      const isGeneric = altType === "generic";
                      return (
                        <span
                          key={altIdx}
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[12px] border ${
                            isGeneric
                              ? "text-blue-700 bg-blue-100 border-blue-200"
                              : "text-purple-700 bg-purple-100 border-purple-200"
                          }`}
                        >
                          {isGeneric ? "◈" : "◆"} {altName}
                          {isGeneric && (
                            <span className="text-[9px] font-bold ml-1 opacity-70">
                              (Generic)
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
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
            <div className="w-16 overflow-hidden border border-indigo-100 rounded-2xl shrink-0">
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
