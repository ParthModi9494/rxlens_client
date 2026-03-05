import { useEffect, useState } from "react";
import { AlertIcon, CheckIcon, FlaskIcon, PillIcon } from "./Icons";

const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      text: "Analyzing prescription image...",
      icon: <PillIcon />,
      color: "from-blue-400 to-blue-600",
    },
    {
      text: "Validating medication details...",
      icon: <CheckIcon />,
      color: "from-green-400 to-green-600",
    },
    {
      text: "Checking for interactions...",
      icon: <FlaskIcon />,
      color: "from-purple-400 to-purple-600",
    },
    {
      text: "Verifying dosage information...",
      icon: <AlertIcon />,
      color: "from-amber-400 to-amber-600",
    },
    {
      text: "Extracting prescription data...",
      icon: <PillIcon />,
      color: "from-blue-400 to-blue-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="px-4 mx-auto max-w-180">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 pt-12 pb-8">
        {/* Animated circular progress */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-blue-500 animate-spin"
            style={{ animation: "spin 2s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {currentStepData.icon}
          </div>
        </div>

        {/* Main loading text */}
        <div className="text-center">
          <h2 className="text-[18px] font-black text-slate-900 mb-2">
            Processing your prescription
          </h2>
          <div className="relative h-6">
            <p
              className="text-[12px] font-bold text-slate-500 transition-opacity duration-300"
              key={currentStep}
            >
              {currentStepData.text}
            </p>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${currentStepData.color} rounded-full animate-pulse`}
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              transition: "width 0.3s ease-out",
            }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "bg-blue-500 w-6"
                  : i < currentStep
                    ? "bg-green-500"
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Fun facts section */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-[16px] w-full max-w-xs">
          <p className="text-[11px] font-extrabold text-blue-600 tracking-[0.1em] uppercase mb-2">
            💡 Quick Tip
          </p>
          <p className="text-[12px] text-blue-800 leading-relaxed">
            {
              [
                "Always inform your pharmacist about any allergies before taking medications.",
                "Take medications with food if they cause stomach upset.",
                "Never skip doses - consistency is key to treatment effectiveness.",
                "Store medications in a cool, dry place away from direct sunlight.",
                "Ask your doctor if it's safe to take your medicines with other products.",
              ][currentStep]
            }
          </p>
        </div>
      </div>

      {/* Shimmer skeletons */}
      <div
        className="mb-4 h-28 rounded-3xl"
        style={{
          background:
            "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl"
            style={{
              background:
                "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.4s ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[90px] rounded-2xl mb-3"
          style={{
            background:
              "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.4s ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingScreen;
