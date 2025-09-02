import React, { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

const BadgeAnimator = ({
  type,
  unlocked,
  children,
  centerRef,
  onStart,
  onEnd,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const controls = useAnimationControls();
  const badgeRef = useRef(null);

  const startAnimation = async () => {
    if (!unlocked || isAnimating) return;

    setIsAnimating(true);
    onStart?.();

    try {
      switch (type) {
        case "basic":
          await animateShake();
          break;
        case "common":
          await animateSpin();
          break;
        case "rare":
          await animateFallAndReturn();
          break;
        case "epic":
          await animateOrbit();
          break;
        case "legendary":
          await controls.start({
            scale: 1.15,
            transition: { duration: 0.2 },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Animation error:", error);
    } finally {
      await controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
      });
      setIsAnimating(false);
      onEnd?.();
    }
  };

  const animateShake = async () => {
    await controls.start({
      x: [0, -6, 6, -4, 4, -2, 2, 0],
      transition: { duration: 0.7 },
    });
  };

  const animateSpin = async () => {
    await controls.start({
      rotate: [0, 360],
      transition: { duration: 0.8, ease: "easeInOut" },
    });
  };

  const animateFallAndReturn = async () => {
    await controls.start({
      y: [0, 40, 100, 180, 220],
      opacity: [1, 1, 0.9, 0.8, 0.6],
      scale: [1, 1, 0.95, 0.9, 0.85],
      transition: { duration: 1.4, ease: "easeIn" },
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    setShowComingUp(false);

    await controls.start({
      y: [220, 50, -10, 0],
      opacity: [0.6, 0.8, 0.95, 1],
      scale: [0.85, 0.95, 1.05, 1],
      transition: {
        duration: 1.8,
        ease: "backOut",
        times: [0, 0.6, 0.9, 1],
      },
    });
  };

  const animateOrbit = async () => {
    if (!centerRef?.current || !badgeRef.current) return;

    const centerRect = centerRef.current.getBoundingClientRect();
    const badgeRect = badgeRef.current.getBoundingClientRect();

    const centerX = centerRect.left + centerRect.width / 2;
    const centerY = centerRect.top + centerRect.height / 2;
    const badgeX = badgeRect.left + badgeRect.width / 2;
    const badgeY = badgeRect.top + badgeRect.height / 2;

    const radius = Math.sqrt(
      Math.pow(centerX - badgeX, 2) + Math.pow(centerY - badgeY, 2)
    );

    const startAngle = Math.atan2(badgeY - centerY, badgeX - centerX);

    const totalRotations = 4;
    const steps = 60;
    const keyframes = [];

    for (let i = 0; i <= totalRotations * steps; i++) {
      const angle = startAngle + (i / steps) * 2 * Math.PI;
      const x = radius * Math.cos(angle) - (badgeX - centerX);
      const y = radius * Math.sin(angle) - (badgeY - centerY);
      keyframes.push({ x, y });
    }

    await controls.start({
      x: keyframes.map((k) => k.x),
      y: keyframes.map((k) => k.y),
      transition: {
        duration: 2.4,
        ease: "linear",
        times: keyframes.map((_, i) => i / (keyframes.length - 1)),
      },
    });
  };

  return (
    <div className="relative">
      <motion.div
        ref={badgeRef}
        animate={controls}
        onClick={startAnimation}
        className={`${isAnimating ? "pointer-events-none" : "cursor-pointer"}`}
        style={{
          pointerEvents: !unlocked || isAnimating ? "none" : "auto",

          zIndex: type === "rare" && isAnimating ? 1000 : "auto",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BadgeAnimator;
