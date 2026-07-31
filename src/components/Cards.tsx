import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const cards = [
  {
    num: "01",
    title: "Diagnostic",
    desc: "You tell us what's actually eating the week, not a menu. Your real answer.",
  },
  {
    num: "02",
    title: "Score",
    desc: "We weigh how many bottlenecks are stacked up against urgency, hours lost, and budget.",
  },
  {
    num: "03",
    title: "Proposal",
    desc: "A fixed-price scope built around your answers, confirmed on a short call before anything's signed.",
  },
  {
    num: "04",
    title: "Kickoff",
    desc: "Tools connected, first workflow running live against your real data. Not a demo.",
  },
  {
    num: "05",
    title: "Delivery",
    desc: "Trained on it, checked in on at 30 days, ready to scale up whenever you are.",
  },
  {
    num: "06",
    title: "Your Turn",
    desc: "Ready to tie off your loose threads? Let's start the diagnostic.",
    isFormLink: true,
  },
];

function AnimatedCard({ card, idx }: { card: any, idx: number, key?: any }) {
  const isEven = idx % 2 === 0;
  const isLast = idx === cards.length - 1;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.6, once: false }}
      className={cn(
        "relative flex flex-col md:flex-row items-start md:items-center gap-6",
        isEven ? "md:flex-row-reverse text-left md:text-right" : "text-left"
      )}
    >
      {/* The Dot (Stitch Point) */}
      <motion.div
        variants={{
          hidden: { scale: 0 },
          visible: { scale: 1, transition: { type: "spring", delay: 0.1 } }
        }}
        className="absolute left-[38px] md:left-1/2 w-5 h-5 rounded-full bg-brass ring-4 ring-stone transform -translate-x-1/2 z-10"
        style={{ top: '1.25rem' }}
      />

      {/* Card Content with Bounce */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", bounce: 0.4, duration: 0.8 } 
          }
        }}
        className="ml-12 md:ml-0 md:w-1/2 relative z-20"
      >
        <div className="p-6 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm relative group">
          
          {/* Falling Gnome */}
          <motion.div
            variants={
              isLast
                ? {
                    hidden: { y: -200, opacity: 0, x: 0 },
                    visible: {
                      y: [-200, 0, 0, 0],
                      opacity: [0, 1, 1, 0],
                      x: [0, 0, -100, -200], // Slide off screen to left
                      transition: { duration: 2, times: [0, 0.4, 0.7, 1] }
                    }
                  }
                : {
                    hidden: { y: -150, opacity: 0 },
                    visible: {
                      y: [-150, 0],
                      opacity: 1,
                      transition: { type: "spring", bounce: 0.5, duration: 0.8, delay: 0.1 }
                    }
                  }
            }
            className={cn(
              "absolute -top-16 z-30 pointer-events-none w-14 h-20 drop-shadow-lg",
              isEven ? "left-4 md:-left-6" : "right-4 md:-right-6"
            )}
          >
            <img
               src="/threndle-ai-gnome.svg"
               alt=""
               aria-hidden="true"
               className={cn("absolute inset-0 w-full h-full object-contain", isLast ? "" : (isEven ? "-scale-x-100" : ""))}
            />
          </motion.div>

          <div className="font-mono text-xs tracking-widest text-brass-dim mb-2 uppercase">
            Stitch {card.num}
          </div>
          <h3 className="font-serif text-xl font-semibold mb-2">{card.title}</h3>
          <p className="text-ink-soft text-sm leading-relaxed mb-4">
            {card.desc}
          </p>
          
          {card.isFormLink && (
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 bg-ink text-stone px-6 py-3 rounded-sm font-mono text-xs tracking-widest uppercase hover:bg-teal transition-colors"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, x: 10 },
                  visible: { opacity: 1, x: 0, transition: { delay: 1.2 } }
                }}
              >
                ←
              </motion.span>
              Follow the gnome
            </Link>
          )}
        </div>
      </motion.div>

      {/* Empty space for timeline */}
      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
}

export default function Cards() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-24 relative" ref={containerRef}>
      {/* Animated Thread Background */}
      <div className="absolute left-[38px] md:left-1/2 top-24 bottom-24 w-px -translate-x-1/2">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            stroke="var(--color-brass)"
            strokeWidth="2"
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-16 relative">
        {cards.map((card, idx) => (
          <AnimatedCard key={idx} card={card} idx={idx} />
        ))}
      </div>
    </div>
  );
}
