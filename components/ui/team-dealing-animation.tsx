"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamDealingAnimationProps {
  members: TeamMember[];
}

const CardContent = ({ member, isDealt, isComplete, isCEO }: { member: TeamMember, isDealt: boolean, isComplete: boolean, isCEO: boolean }) => (
  <motion.div
    className="w-full h-full bg-[#11130F] rounded-2xl border border-forest-border flex flex-col group overflow-hidden cursor-pointer"
    whileHover={isDealt ? {
      y: -10,
      scale: 1.02,
      boxShadow: "0px 10px 30px rgba(16, 185, 129, 0.15)",
      borderColor: "rgba(16, 185, 129, 0.4)",
      transition: { duration: 0.25, ease: "easeOut" }
    } : {}}
    animate={isComplete ? {
      y: [0, -8, 0],
      boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 40px rgba(16, 185, 129, 0.4)", "0px 0px 0px rgba(16, 185, 129, 0)"]
    } : {}}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <div className="relative w-full h-2/3 overflow-hidden bg-[#1E211A]">
      <motion.img 
        src={member.image} 
        alt={member.name} 
        className="w-full h-full object-cover"
        whileHover={isDealt ? { scale: 1.08 } : {}}
        transition={{ duration: 0.4 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#11130F] via-transparent to-transparent" />
      
      {/* Subtle indicator for CEO */}
      {isCEO && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-forest-accent shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      )}
    </div>
    <div className="flex flex-col justify-end p-2 lg:p-3 h-1/3 text-center pb-3 relative">
      <h3 className={`font-bold text-forest-beige line-clamp-2 leading-tight ${isCEO ? 'text-[13px] lg:text-[15px]' : 'text-[12px] lg:text-[14px]'}`}>{member.name}</h3>
      <p className={`font-black text-[#829661] tracking-widest mt-1 uppercase ${isCEO ? 'text-[10px] lg:text-[12px]' : 'text-[9px] lg:text-[11px]'}`}>{member.role}</p>
    </div>
  </motion.div>
);

export function TeamDealingAnimation({ members }: TeamDealingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  
  // CEO is at index 3, visible from the start
  const [visibleIndices, setVisibleIndices] = useState<number[]>([3]);
  const [isComplete, setIsComplete] = useState(false);

  // Deal sequence for remaining 6 subordinates: Left 1 (2), Right 1 (4), Left 2 (1), Right 2 (5), Left 3 (0), Right 3 (6)
  const dealSequence = [2, 4, 1, 5, 0, 6];

  useEffect(() => {
    if (!isInView) return;

    let timeouts: NodeJS.Timeout[] = [];

    dealSequence.forEach((memberIdx, i) => {
      const timeout = setTimeout(() => {
        setVisibleIndices(prev => {
          if (prev.includes(memberIdx)) return prev;
          return [...prev, memberIdx];
        });
        
        // Final bounce
        if (i === dealSequence.length - 1) {
          setTimeout(() => setIsComplete(true), 600);
          setTimeout(() => setIsComplete(false), 1200);
        }
      }, (i + 1) * 200); // 200ms rapid dealing
      
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-[1300px] mx-auto py-2 mt-8 flex justify-center items-center overflow-visible"
    >
      {/* 
        THE DECK (Undealt Cards)
        Absolutely centered in the middle of the container.
      */}
      {members.map((member, idx) => {
        const isDealt = visibleIndices.includes(idx);
        if (isDealt) return null;

        const distance = Math.abs(idx - 3);
        const direction = idx < 3 ? -1 : 1;
        const xOffset = direction * distance * 15; // Extremely compact fan
        const scale = 1 - (distance * 0.05);
        const opacity = 1 - (distance * 0.2);
        const zIndex = 10 - distance;

        return (
          <motion.div
            key={`deck-${idx}`}
            layoutId={`card-${idx}`}
            className="absolute top-1/2 w-[130px] h-[210px] md:w-[155px] md:h-[250px] lg:w-[180px] lg:h-[280px]"
            style={{ 
               zIndex,
               left: `calc(50% + ${xOffset}px)`,
               x: "-50%",
               y: "-50%"
            }}
            initial={{ scale, opacity }}
            animate={{ scale, opacity }}
            transition={{ duration: 0.5 }}
          >
            <CardContent member={member} isDealt={false} isComplete={false} isCEO={false} />
          </motion.div>
        );
      })}

      {/* 
        THE ROW (Dealt Cards)
        A single flex row that dynamically pushes existing cards horizontally.
      */}
      <div className="relative flex justify-center items-center gap-2 lg:gap-3 w-full flex-wrap z-10 px-4">
        {members.map((member, idx) => {
          const isDealt = visibleIndices.includes(idx);
          if (!isDealt) return null;

          const isCEO = idx === 3;

          return (
            <motion.div
              key={`dealt-${idx}`}
              layoutId={`card-${idx}`}
              layout
              initial={{ filter: "brightness(1.5) blur(2px)", opacity: 0.8 }}
              animate={{ filter: "brightness(1) blur(0px)", opacity: 1 }}
              transition={{
                layout: { type: "spring", stiffness: 120, damping: 15, mass: 0.9 },
                filter: { duration: 0.4, ease: "easeOut" },
                opacity: { duration: 0.3 }
              }}
              // Dimensions dynamically sized to ensure all 7 fit beautifully
              style={{
                width: isCEO ? 'clamp(150px, 14vw, 180px)' : 'clamp(130px, 12vw, 155px)',
                height: isCEO ? 'clamp(240px, 21vw, 280px)' : 'clamp(210px, 18vw, 250px)',
              }}
              className="relative shrink-0"
            >
              <CardContent member={member} isDealt={true} isComplete={isComplete} isCEO={isCEO} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
