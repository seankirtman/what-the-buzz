"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface BeeTransitionContextType {
  triggerTransition: (href: string) => void;
}

const BeeTransitionContext = createContext<BeeTransitionContextType | undefined>(
  undefined
);

export function useBeeTransition() {
  return useContext(BeeTransitionContext);
}

export function BeeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isFlying, setIsFlying] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const triggerTransition = (href: string) => {
    if (isFlying) return;
    setTargetHref(href);
    setIsFlying(true);
  };

  useEffect(() => {
    if (isFlying && targetHref) {
      const timer = setTimeout(() => {
        router.push(targetHref);
      }, 800);
      
      const resetTimer = setTimeout(() => {
        setIsFlying(false);
        setTargetHref(null);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [isFlying, targetHref, router]);

  return (
    <BeeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence mode="wait">
        {isFlying && (
          <motion.div
            key="bee-flying"
            initial={{ x: "-20vw", y: "50vh", rotate: 15, scale: 0.8, opacity: 1 }}
            animate={{ 
              x: "120vw", 
              y: ["50vh", "30vh", "60vh", "40vh"],
              rotate: [15, -5, 10, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              times: [0, 0.3, 0.6, 1]
            }}
            className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-start"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh',
              pointerEvents: 'none' 
            }}
          >
            <div className="relative text-8xl filter drop-shadow-2xl">
              🐝
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 0.5], x: -50 }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute left-0 top-1/2 h-4 w-24 -translate-y-1/2 -translate-x-full rounded-full bg-yellow-400/20 blur-md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BeeTransitionContext.Provider>
  );
}
