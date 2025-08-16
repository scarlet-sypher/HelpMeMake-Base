import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimationControls } from "framer-motion";
import { Crown, Sparkles, Star } from "lucide-react";

const LegendaryOverlay = ({ open, onClose, label = "LEGENDARY!" }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [stars, setStars] = useState([]);
  const badgeControls = useAnimationControls();
  const textControls = useAnimationControls();

  useEffect(() => {
    if (open) {
      setShowOverlay(true);
      startLegendarySequence();
    }
  }, [open]);

  const startLegendarySequence = async () => {
    // Generate stars for blast effect - more stars with varied sizes
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      // Random positions in a circle around center
      angle: (Math.PI * 2 * i) / 20 + Math.random() * 0.3,
      distance: 100 + Math.random() * 150, // Varied distances
      size: 12 + Math.random() * 16, // Varied sizes
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 0.8,
    }));
    setStars(newStars);

    try {
      // Step 1: Small shake before the blast
      await badgeControls.start({
        x: [0, -4, 4, -3, 3, -2, 2, 0],
        y: [0, -2, 2, -1, 1, 0],
        transition: { duration: 0.5 },
      });

      // Step 2: Brief pause for suspense
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Step 3: Simultaneous blast - scale up badge, show text, emit stars
      await Promise.all([
        // Badge blast effect
        badgeControls.start({
          scale: [1, 1.4, 1.2, 1.3],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.8 },
        }),
        // Text appearance with dramatic effect
        textControls.start({
          opacity: [0, 1],
          scale: [0.5, 1.2, 0.95, 1],
          y: [20, -10, 5, 0],
          letterSpacing: ["-0.2em", "0.15em", "0"],
          transition: { duration: 1.0, delay: 0.2 },
        }),
      ]);

      // Step 4: Hold the effect for dramatic pause
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 5: Fade out and close
      await Promise.all([
        badgeControls.start({
          scale: 1,
          opacity: 0.8,
          transition: { duration: 0.4 },
        }),
        textControls.start({
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.4 },
        }),
      ]);

      // Step 6: Close overlay and return badge
      setShowOverlay(false);
      onClose?.();
    } catch (error) {
      console.error("Legendary animation error:", error);
      setShowOverlay(false);
      onClose?.();
    }
  };

  if (!showOverlay) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 md:p-8"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Animated background rings - responsive sizes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 3, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border-2 sm:border-3 md:border-4 border-yellow-400/40 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 border-2 sm:border-3 border-orange-400/50 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 border-1 sm:border-2 border-red-400/30 rounded-full"
        />
      </div>

      {/* Central badge - responsive sizing */}
      <div className="relative flex flex-col items-center max-w-full">
        <motion.div
          animate={badgeControls}
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 border-2 sm:border-3 md:border-4 border-yellow-400/60 shadow-xl sm:shadow-2xl shadow-yellow-500/40 flex items-center justify-center overflow-hidden"
        >
          {/* Multiple animated background gradients for more intensity */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-amber-400/20"
          />

          {/* Multiple shine effects */}
          <motion.div
            animate={{
              x: ["-120%", "120%"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
              repeatDelay: 2,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          />

          {/* Crown icon - responsive sizing */}
          <Crown
            className="text-yellow-100 relative z-10 drop-shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16"
          />

          {/* Enhanced corner sparkles - responsive positioning and sizing */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 text-yellow-300"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.div>
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              rotate: { duration: 2.5, repeat: Infinity, ease: "linear" },
              scale: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              },
            }}
            className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 md:-top-3 md:-left-3 text-blue-300"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </motion.div>
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3.5, repeat: Infinity, ease: "linear" },
              scale: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              },
            }}
            className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 md:-bottom-3 md:-right-3 text-orange-300"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.div>

          {/* Stars at bottom - responsive positioning */}
          <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 flex space-x-0.5 sm:space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Star className="fill-current text-yellow-100 w-2 h-2 sm:w-2.5 sm:h-2.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legendary text with enhanced effects - responsive sizing */}
        <motion.div
          animate={textControls}
          initial={{ opacity: 0, scale: 0.5, letterSpacing: "-0.2em" }}
          className="mt-4 sm:mt-6 md:mt-8 text-center px-2"
        >
          <motion.h1
            className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 drop-shadow-lg sm:drop-shadow-xl md:drop-shadow-2xl"
            style={{
              fontSize: "clamp(2rem, 8vw, 7rem)",
              lineHeight: "0.9",
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {label}
          </motion.h1>
          <motion.div
            animate={{
              scaleX: [0, 1, 0.95, 1],
              background: [
                "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
                "linear-gradient(90deg, #f97316 0%, #dc2626 100%)",
                "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
              ],
            }}
            transition={{
              scaleX: { duration: 1.2, delay: 0.3 },
              background: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
            className="mt-2 sm:mt-3 h-1 sm:h-1.5 rounded-full mx-auto shadow-md sm:shadow-lg w-32 sm:w-48 md:w-64 lg:w-80 max-w-full"
          />
        </motion.div>
      </div>

      {/* Enhanced floating stars blast effect - responsive scaling */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: Math.cos(star.angle) * star.distance * (window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1),
            y: Math.sin(star.angle) * star.distance * (window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1),
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut",
          }}
          className="absolute text-yellow-300 pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            fontSize: `${star.size * (window.innerWidth < 640 ? 0.7 : window.innerWidth < 1024 ? 0.85 : 1)}px`,
          }}
        >
          {star.id % 3 === 0 ? "✨" : star.id % 2 === 0 ? "⭐" : "💫"}
        </motion.div>
      ))}

      {/* Additional particle effects - responsive scaling */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: (Math.random() - 0.5) * (window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 300 : 400),
            y: (Math.random() - 0.5) * (window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 300 : 400),
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 2,
            delay: 0.3 + Math.random() * 0.5,
            ease: "easeOut",
          }}
          className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
          }}
        />
      ))}
    </motion.div>,
    document.body
  );
};

export default LegendaryOverlay;