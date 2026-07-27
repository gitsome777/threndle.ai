import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface GnomeProps {
  className?: string;
}

export default function Gnome({ className }: GnomeProps) {
  return (
    <motion.div
      initial={{ y: -150, opacity: 0 }}
      whileInView={{ y: [-150, 0], opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.1 }}
      className={cn("pointer-events-none w-14 h-20 z-30 drop-shadow-lg", className)}
    >
      <img
        src="/gnome.svg"
        alt="Gnome"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
}
