import { useState } from "react";
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  Clock,
  Phone,
  User,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

// ─── Types ───────────────────────────────────────────────────────

export interface MissingFields {
  doctorName: boolean;
  clinicName: boolean;
  doctorContact: boolean;
  followUpDate: boolean;
}

export interface MissingInfoPatch {
  doctorName?: string;
  clinicName?: string;
  doctorContact?: string;
  followUpDate?: string;
  followUpTime?: string;
}

interface MissingInfoModalProps {
  missingFields: MissingFields;
  onSubmit: (patch: MissingInfoPatch) => void;
  onSkip: () => void;
}

// ─── Field config ────────────────────────────────────────────────

const DOCTOR_FIELDS = [
  {
    key: "doctorName" as const,
    inputKey: "doctorName",
    label: "Doctor's Full Name",
    type: "text",
    placeholder: "e.g. Dr. Sharma",
    icon: <User className="w-4 h-4 text-slate-400" />,
    required: true,
  },
  {
    key: "clinicName" as const,
    inputKey: "clinicName",
    label: "Clinic / Hospital Name",
    type: "text",
    placeholder: "e.g. City Medical Center",
    icon: <Building2 className="w-4 h-4 text-slate-400" />,
    required: true,
  },
  {
    key: "doctorContact" as const,
    inputKey: "doctorContact",
    label: "Doctor's Contact Number",
    type: "tel",
    placeholder: "e.g. +91 98765 43210",
    icon: <Phone className="w-4 h-4 text-slate-400" />,
    required: false,
  },
] as const;

// ─── Component ───────────────────────────────────────────────────

export const MissingInfoModal = ({
  missingFields,
  onSubmit,
  onSkip,
}: MissingInfoModalProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());

  // Which doctor fields to show (those that are actually missing)
  const visibleDoctorFields = DOCTOR_FIELDS.filter(
    (f) => missingFields[f.key]
  );

  const hasDoctorSection = visibleDoctorFields.length > 0;
  const hasFollowUpSection = missingFields.followUpDate;

  // Always show the time input if there's something to fill in
  const showFollowUpSection = hasFollowUpSection;

  const set = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSubmit = () => {
    const newErrors = new Set<string>();

    // Validate required doctor fields
    visibleDoctorFields.forEach((f) => {
      if (f.required && !values[f.inputKey]?.trim()) {
        newErrors.add(f.inputKey);
      }
    });

    // Validate required follow-up date
    if (missingFields.followUpDate && !values.followUpDate?.trim()) {
      newErrors.add("followUpDate");
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    const patch: MissingInfoPatch = {};
    if (values.doctorName?.trim()) patch.doctorName = values.doctorName.trim();
    if (values.clinicName?.trim()) patch.clinicName = values.clinicName.trim();
    if (values.doctorContact?.trim()) patch.doctorContact = values.doctorContact.trim();
    if (values.followUpDate?.trim()) patch.followUpDate = values.followUpDate.trim();
    if (values.followUpTime?.trim()) patch.followUpTime = values.followUpTime.trim();

    onSubmit(patch);
  };

  const requiredCount =
    visibleDoctorFields.filter((f) => f.required).length +
    (missingFields.followUpDate ? 1 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease_both]"
      onKeyDown={(e) => e.key === "Escape" && onSkip()}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[460px] animate-[slideUp_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Header ────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 px-6 pt-5 pb-6 relative">
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 p-1.5 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>

            <div className="flex items-start gap-3">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-snug">
                  Complete Prescription Details
                </h2>
                <p className="mt-1 text-sm text-blue-100 leading-snug">
                  {requiredCount > 0
                    ? `${requiredCount} important detail${requiredCount !== 1 ? "s" : ""} couldn't be read from the scan. Please fill them in.`
                    : "Add optional details to unlock calendar reminders."}
                </p>
              </div>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────────── */}
          <div className="px-6 py-5 space-y-6 max-h-[55vh] overflow-y-auto">

            {/* Doctor / Clinic section */}
            {hasDoctorSection && (
              <section>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Doctor & Clinic
                  </span>
                </div>
                <div className="space-y-3">
                  {visibleDoctorFields.map((field) => (
                    <FieldInput
                      key={field.inputKey}
                      fieldKey={field.inputKey}
                      label={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      icon={field.icon}
                      required={field.required}
                      value={values[field.inputKey] ?? ""}
                      error={errors.has(field.inputKey)}
                      onChange={(v) => set(field.inputKey, v)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Follow-up / Visit section */}
            {showFollowUpSection && (
              <section>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Next Doctor Visit
                  </span>
                </div>
                <div className="space-y-3">
                  <FieldInput
                    fieldKey="followUpDate"
                    label="Visit Date"
                    type="date"
                    placeholder=""
                    icon={<Calendar className="w-4 h-4 text-slate-400" />}
                    required={true}
                    value={values.followUpDate ?? ""}
                    error={errors.has("followUpDate")}
                    onChange={(v) => set("followUpDate", v)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <FieldInput
                    fieldKey="followUpTime"
                    label="Visit Time"
                    type="time"
                    placeholder=""
                    icon={<Clock className="w-4 h-4 text-slate-400" />}
                    required={false}
                    value={values.followUpTime ?? ""}
                    error={false}
                    onChange={(v) => set("followUpTime", v)}
                    hint="Used to set a calendar reminder"
                  />
                </div>
              </section>
            )}

            {/* Time-only section (when date is known but time is wanted for calendar) */}
            {!showFollowUpSection && (
              <section>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Calendar Reminder
                  </span>
                </div>
                <FieldInput
                  fieldKey="followUpTime"
                  label="What time is your visit?"
                  type="time"
                  placeholder=""
                  icon={<Clock className="w-4 h-4 text-slate-400" />}
                  required={false}
                  value={values.followUpTime ?? ""}
                  error={false}
                  onChange={(v) => set("followUpTime", v)}
                  hint="Optional — lets us set a precise reminder time"
                />
              </section>
            )}
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
            <Button onClick={handleSubmit} className="flex-1 gap-2">
              <Check className="w-4 h-4" />
              Save Details
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-slate-500 hover:text-slate-700 shrink-0"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FieldInput sub-component ────────────────────────────────────

interface FieldInputProps {
  fieldKey: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required: boolean;
  value: string;
  error: boolean;
  onChange: (v: string) => void;
  min?: string;
  hint?: string;
}

const FieldInput = ({
  label,
  type,
  placeholder,
  icon,
  required,
  value,
  error,
  onChange,
  min,
  hint,
}: FieldInputProps) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
      {label}
      {required ? (
        <span className="text-red-500 ml-0.5">*</span>
      ) : (
        <span className="text-slate-400 font-normal ml-1">(optional)</span>
      )}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={cn(
          "w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all",
          error
            ? "border-red-400 bg-red-50 ring-2 ring-red-500/20 focus:border-red-500"
            : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        )}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 font-medium">This field is required.</p>
    )}
    {hint && !error && (
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    )}
  </div>
);

export default MissingInfoModal;
