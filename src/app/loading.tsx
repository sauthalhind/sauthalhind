export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 dir-rtl">
      <div className="flex flex-col items-center justify-center text-center max-w-sm w-full">
        {/* Animated Brand Logo Container */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute inset-0 rounded-2xl bg-[#bb1919]/10 animate-ping opacity-75" />
          
          {/* Logo Card */}
          <div className="relative z-10 w-24 h-24 bg-white border-2 border-[#bb1919] rounded-2xl p-3 shadow-lg shadow-[#bb1919]/10 flex items-center justify-center">
            <img 
              src="/sauthalhind.png" 
              alt="صوت الهند - Sauthalhind Logo" 
              className="w-full h-full object-contain animate-pulse" 
            />
          </div>

          {/* Sleek Spinner Ring around logo */}
          <div className="absolute -inset-2 rounded-3xl border-2 border-transparent border-t-[#bb1919] border-r-[#bb1919]/40 animate-spin" />
        </div>

        {/* Arabic Brand Title */}
        <h1 className="text-2xl font-black text-gray-900 tracking-tight font-cairo mb-1">
          جريدة صوت الهند
        </h1>
        <p className="text-xs font-bold text-[#bb1919] tracking-wider uppercase mb-6">
          Sauthalhind
        </p>

        {/* Loading Indicator Pill */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-[#bb1919] animate-ping" />
          <span className="text-xs font-bold text-gray-700 font-cairo">جاري تحميل الأخبار...</span>
        </div>

        {/* Sleek Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
          <div className="h-full bg-[#bb1919] rounded-full w-2/3 animate-[pulse_1s_infinite] transition-all" />
        </div>
      </div>
    </main>
  );
}
