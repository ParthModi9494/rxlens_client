const LoadingScreen = () => (
  <div className="max-w-180 mx-auto px-4">
    {/* Spinner + progress */}
    <div className="flex flex-col items-center gap-5 pt-10 pb-5">
      <div className="w-12 h-12 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-[12px] font-extrabold text-slate-400 tracking-[0.15em] uppercase">
        Analysing Prescription
      </p>
      <div className="w-44 h-[5px] bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-progress" />
      </div>
    </div>

    {/* Shimmer skeletons */}
    <div
      className="h-28 rounded-3xl mb-4"
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

export default LoadingScreen;
