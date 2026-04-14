import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  FlaskConical,
  Pill,
  ShieldAlert,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

const STEPS = [
  {
    text: "Analyzing prescription image…",
    sub: "Reading handwriting and layout",
    icon: Pill,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    text: "Extracting medication details…",
    sub: "Identifying drugs, dosages, frequencies",
    icon: FlaskConical,
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    text: "Validating clinical data…",
    sub: "Cross-checking names and strengths",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    text: "Checking for interactions…",
    sub: "Reviewing contraindications",
    icon: ShieldAlert,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    text: "Finalising prescription…",
    sub: "Structuring output and alternatives",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
] as const;

const TIPS = [
  "Always inform your pharmacist about any allergies before taking medications.",
  "Take medications with food if they cause stomach upset.",
  "Never skip doses — consistency is key to treatment effectiveness.",
  "Store medications in a cool, dry place away from direct sunlight.",
  "Ask your doctor if it's safe to combine your medicines with other products.",
];

const LoadingScreen = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => (s + 1) % STEPS.length),
      2000
    );
    return () => clearInterval(id);
  }, []);

  const current = STEPS[step];
  const StepIcon = current.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg mx-auto space-y-8 animate-[fadeIn_0.4s_ease_both]">

        {/* ── Spinner + step ──────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Circular spinner with icon */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-blue-300 animate-spin" />
            <div className={`absolute inset-3 rounded-full ${current.bg} flex items-center justify-center transition-colors duration-300`}>
              <StepIcon className={`w-5 h-5 ${current.color} transition-colors duration-300`} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Processing your prescription
            </h2>
            <p
              key={step}
              className="mt-1.5 text-sm text-slate-500 animate-[fadeIn_0.3s_ease_both]"
            >
              {current.text}
            </p>
            <p
              key={`sub-${step}`}
              className="mt-0.5 text-xs text-slate-400 animate-[fadeIn_0.3s_0.1s_ease_both]"
            >
              {current.sub}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-1.5" />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={[
                  "rounded-full transition-all duration-300",
                  i === step
                    ? "w-5 h-2 bg-blue-500"
                    : i < step
                      ? "w-2 h-2 bg-green-400"
                      : "w-2 h-2 bg-slate-200",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        {/* ── Quick tip ───────────────────────────────────────── */}
        <Card className="border-blue-100 bg-blue-50/60">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
              💡 Quick Tip
            </p>
            <p
              key={step}
              className="text-sm text-blue-900 leading-relaxed animate-[fadeIn_0.4s_ease_both]"
            >
              {TIPS[step]}
            </p>
          </CardContent>
        </Card>

        {/* ── Skeleton preview ────────────────────────────────── */}
        <div className="space-y-3">
          {/* Hero skeleton */}
          <div className="h-32 rounded-xl shimmer-bg" />

          {/* Two-column skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl shimmer-bg"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Medication skeletons */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl shimmer-bg"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default LoadingScreen;
