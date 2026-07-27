import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function LogoAnim() {
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnim(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center z-10 py-16">
      {/* Wordmark Container */}
      <div className="relative inline-flex items-baseline font-sans font-bold tracking-tight mb-4 z-10">
        <span className="text-[#433A36] text-6xl md:text-[92px] -tracking-[1.5px]">threndle</span>
        <span className="text-[#B8562B] text-4xl md:text-[64px] -tracking-[1px] relative">
          .ai
          
          {/* The Gnome */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              startAnim
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 1,
              type: "spring",
              bounce: 0.5
            }}
            className="absolute bottom-[35%] left-[-10%] md:bottom-[40%] md:left-[-15%] z-20 w-[60px] h-[80px] md:w-[80px] md:h-[100px] pointer-events-none"
          >
            <img 
               src="/gnome.svg" 
               alt="Gnome" 
               className="absolute inset-0 w-full h-full object-contain"
            />
          </motion.div>
        </span>
      </div>

      {/* Terracotta Thread Divider Line */}
      <div className="flex items-center justify-center w-full max-w-[600px] mb-4 gap-3 text-[#B8562B]">
        <div className="w-2.5 h-2.5 bg-[#B8562B] rotate-45 shrink-0" />
        <div className="flex-1 h-0.5 border-t-[2.5px] border-dashed border-[#B8562B]" />
        <div className="w-2.5 h-2.5 bg-[#B8562B] rotate-45 shrink-0" />
      </div>

      {/* Subtitle / Tagline */}
      <p className="font-sans text-[#5C524B] text-[18px] md:text-[20px] tracking-[0.2px] text-center px-4">
        every business runs on loose threads, we tie them off.
      </p>
    </div>
  );
}
