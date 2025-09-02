import React, { useState, useEffect } from "react";
import { Sparkles, Crown, Star, Trophy, Zap, Medal } from "lucide-react";

const BadgeAnimations = ({
  badge,
  onAnimationComplete,
  isClickable,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [particles, setParticles] = useState([]);

  const animationTypes = {
    basic: "starBurst",
    common: "trophyRise",
    rare: "medalGlow",
    epic: "crownExplosion",
    legendary: "sparkleStorm",
  };

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const generateParticles = (count = 20) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        angle: Math.random() * 360,
        distance: 50 + Math.random() * 100,
      });
    }
    setParticles(newParticles);
  };

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    if (!isClickable || isAnimating || cooldown > 0) return;

    const level = badge.earnedBadges[badge.earnedBadges.length - 1] || "basic";
    const animation = animationTypes[level] || "starBurst";

    if (["crownExplosion", "sparkleStorm"].includes(animation)) {
      generateParticles(level === "legendary" ? 30 : 20);
    }

    setAnimationType(animation);
    setIsAnimating(true);
    setCooldown(5);

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
      setParticles([]);
      setCooldown(0);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000);
  };

  const getAnimationClasses = () => {
    if (!isAnimating || !animationType) return "";

    switch (animationType) {
      case "starBurst":
        return "animate-star-burst";
      case "trophyRise":
        return "animate-trophy-rise";
      case "medalGlow":
        return "animate-medal-glow";
      case "crownExplosion":
        return "animate-crown-explosion";
      case "sparkleStorm":
        return "animate-sparkle-storm";
      default:
        return "";
    }
  };

  const getAnimationIcon = () => {
    if (!isAnimating || !animationType) return null;

    const getBadgeIcon = (level) => {
      switch (level) {
        case "basic":
          return Star;
        case "common":
          return Trophy;
        case "rare":
          return Medal;
        case "epic":
          return Crown;
        case "legendary":
          return Sparkles;
        default:
          return Star;
      }
    };

    const badgeLevel =
      badge.earnedBadges[badge.earnedBadges.length - 1] || "basic";
    const BadgeIcon = getBadgeIcon(badgeLevel);

    const getIconClasses = () => {
      switch (animationType) {
        case "starBurst":
          return "text-yellow-400 animate-star-spin";
        case "trophyRise":
          return "text-amber-400 animate-trophy-float";
        case "medalGlow":
          return "text-purple-400 animate-medal-pulse";
        case "crownExplosion":
          return "text-yellow-300 animate-crown-shake";
        case "sparkleStorm":
          return "text-rainbow animate-legendary-spin";
        default:
          return "text-yellow-400";
      }
    };

    return (
      <>
        <BadgeIcon
          className={`absolute inset-0 m-auto ${getIconClasses()}`}
          size={32}
        />

        {animationType === "sparkleStorm" && (
          <>
            <BadgeIcon
              className="absolute inset-0 m-auto text-pink-400 animate-legendary-spin-reverse"
              size={28}
              style={{ animationDelay: "0.5s" }}
            />
            <BadgeIcon
              className="absolute inset-0 m-auto text-cyan-400 animate-legendary-spin"
              size={24}
              style={{ animationDelay: "1s" }}
            />
          </>
        )}

        {animationType === "crownExplosion" && (
          <>
            <Crown
              className="absolute inset-0 m-auto text-yellow-200 animate-crown-expand"
              size={40}
              style={{ animationDelay: "0.3s" }}
            />
            <Crown
              className="absolute inset-0 m-auto text-yellow-100 animate-crown-expand"
              size={48}
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}
      </>
    );
  };

  const renderParticles = () => {
    return particles.map((particle) => (
      <div
        key={particle.id}
        className="absolute w-2 h-2 rounded-full animate-particle-explosion"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
          transform: `rotate(${particle.angle}deg)`,
          "--particle-distance": `${particle.distance}px`,
          "--particle-size": `${particle.size}px`,
        }}
      >
        <div
          className={`w-full h-full rounded-full ${
            animationType === "sparkleStorm"
              ? "bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
              : "bg-gradient-to-r from-yellow-400 to-orange-500"
          }`}
        />
      </div>
    ));
  };

  return (
    <>
      <style>{`
        /* Star Burst Animation */
        @keyframes star-burst {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.4) rotate(72deg); }
          40% { transform: scale(1.1) rotate(144deg); }
          60% { transform: scale(1.3) rotate(216deg); }
          80% { transform: scale(1.05) rotate(288deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes star-spin {
          0% { transform: scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 0, 0.5)); }
          25% { transform: scale(1.2) rotate(90deg); filter: brightness(1.5) drop-shadow(0 0 20px rgba(255, 255, 0, 0.8)); }
          50% { transform: scale(0.9) rotate(180deg); filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 255, 0, 0.6)); }
          75% { transform: scale(1.1) rotate(270deg); filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 255, 0, 0.9)); }
          100% { transform: scale(1) rotate(360deg); filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 0, 0.5)); }
        }

        /* Trophy Rise Animation */
        @keyframes trophy-rise {
          0% { transform: scale(1) translateY(0) rotate(0deg); }
          25% { transform: scale(1.3) translateY(-20px) rotate(-10deg); }
          50% { transform: scale(1.1) translateY(-30px) rotate(5deg); }
          75% { transform: scale(1.2) translateY(-15px) rotate(-5deg); }
          100% { transform: scale(1) translateY(0) rotate(0deg); }
        }
        
        @keyframes trophy-float {
          0% { transform: translateY(0) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.6)); }
          33% { transform: translateY(-10px) rotate(5deg) scale(1.1); filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.9)); }
          66% { transform: translateY(-5px) rotate(-3deg) scale(1.05); filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.7)); }
          100% { transform: translateY(0) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.6)); }
        }

        /* Medal Glow Animation */
        @keyframes medal-glow {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
          25% { 
            transform: scale(1.2); 
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), inset 0 0 20px rgba(147, 51, 234, 0.3);
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 0 60px rgba(147, 51, 234, 1), inset 0 0 30px rgba(147, 51, 234, 0.5);
          }
          75% { 
            transform: scale(1.15); 
            box-shadow: 0 0 50px rgba(147, 51, 234, 0.9), inset 0 0 25px rgba(147, 51, 234, 0.4);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
        }
        
        @keyframes medal-pulse {
          0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg) brightness(1); }
          25% { transform: scale(1.15) rotate(5deg); filter: hue-rotate(90deg) brightness(1.3); }
          50% { transform: scale(1.05) rotate(-3deg); filter: hue-rotate(180deg) brightness(1.1); }
          75% { transform: scale(1.1) rotate(2deg); filter: hue-rotate(270deg) brightness(1.2); }
          100% { transform: scale(1) rotate(0deg); filter: hue-rotate(360deg) brightness(1); }
        }

        /* Crown Explosion Animation */
        @keyframes crown-explosion {
          0% { transform: scale(1); }
          15% { transform: scale(0.8); }
          30% { transform: scale(1.5); }
          45% { transform: scale(1.2); }
          60% { transform: scale(1.4); }
          75% { transform: scale(1.1); }
          90% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes crown-shake {
          0% { transform: translateX(0) rotate(0deg) scale(1); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
          10% { transform: translateX(-3px) rotate(-2deg) scale(1.1); filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)); }
          20% { transform: translateX(3px) rotate(2deg) scale(1.05); filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)); }
          30% { transform: translateX(-2px) rotate(-1deg) scale(1.08); filter: drop-shadow(0 0 35px rgba(255, 215, 0, 1.1)); }
          40% { transform: translateX(2px) rotate(1deg) scale(1.03); filter: drop-shadow(0 0 28px rgba(255, 215, 0, 0.95)); }
          50% { transform: translateX(-1px) rotate(-0.5deg) scale(1.06); filter: drop-shadow(0 0 32px rgba(255, 215, 0, 1.05)); }
          100% { transform: translateX(0) rotate(0deg) scale(1); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
        }
        
        @keyframes crown-expand {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
          100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }

        /* Legendary Sparkle Storm Animation */
        @keyframes sparkle-storm {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.4) rotate(90deg); }
          50% { transform: scale(0.8) rotate(180deg); }
          75% { transform: scale(1.2) rotate(270deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes legendary-spin {
          0% { 
            transform: scale(1) rotate(0deg); 
            filter: hue-rotate(0deg) drop-shadow(0 0 15px rgba(255, 192, 203, 0.8));
          }
          25% { 
            transform: scale(1.2) rotate(90deg); 
            filter: hue-rotate(90deg) drop-shadow(0 0 25px rgba(128, 0, 255, 0.8));
          }
          50% { 
            transform: scale(1.1) rotate(180deg); 
            filter: hue-rotate(180deg) drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));
          }
          75% { 
            transform: scale(1.15) rotate(270deg); 
            filter: hue-rotate(270deg) drop-shadow(0 0 30px rgba(255, 255, 0, 0.8));
          }
          100% { 
            transform: scale(1) rotate(360deg); 
            filter: hue-rotate(360deg) drop-shadow(0 0 15px rgba(255, 192, 203, 0.8));
          }
        }
        
        @keyframes legendary-spin-reverse {
          0% { 
            transform: scale(1) rotate(360deg); 
            filter: hue-rotate(360deg) brightness(1.2);
          }
          25% { 
            transform: scale(1.1) rotate(270deg); 
            filter: hue-rotate(270deg) brightness(1.4);
          }
          50% { 
            transform: scale(1.05) rotate(180deg); 
            filter: hue-rotate(180deg) brightness(1.3);
          }
          75% { 
            transform: scale(1.08) rotate(90deg); 
            filter: hue-rotate(90deg) brightness(1.5);
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            filter: hue-rotate(0deg) brightness(1.2);
          }
        }

        /* Particle Animation */
        @keyframes particle-explosion {
          0% { 
            transform: scale(1) translate(0, 0); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.5) translate(var(--particle-distance), calc(var(--particle-distance) * -0.5)); 
            opacity: 0.8;
          }
          100% { 
            transform: scale(0) translate(calc(var(--particle-distance) * 2), calc(var(--particle-distance) * -1)); 
            opacity: 0;
          }
        }

        /* Apply animations */
        .animate-star-burst { animation: star-burst 3s ease-in-out; }
        .animate-star-spin { animation: star-spin 3s ease-in-out; }
        .animate-trophy-rise { animation: trophy-rise 3s ease-in-out; }
        .animate-trophy-float { animation: trophy-float 3s ease-in-out; }
        .animate-medal-glow { animation: medal-glow 3s ease-in-out; }
        .animate-medal-pulse { animation: medal-pulse 3s ease-in-out; }
        .animate-crown-explosion { animation: crown-explosion 3s ease-in-out; }
        .animate-crown-shake { animation: crown-shake 3s ease-in-out; }
        .animate-crown-expand { animation: crown-expand 2s ease-out; }
        .animate-sparkle-storm { animation: sparkle-storm 4s ease-in-out; }
        .animate-legendary-spin { animation: legendary-spin 4s ease-in-out; }
        .animate-legendary-spin-reverse { animation: legendary-spin-reverse 4s ease-in-out; }
        .animate-particle-explosion { animation: particle-explosion 2s ease-out forwards; }
        
        /* Rainbow text effect */
        .text-rainbow {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 2s ease-in-out infinite;
        }
        
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Enhanced glow effects */
        .sparkle-effect {
          background: radial-gradient(circle, rgba(255, 255, 0, 0.6) 0%, rgba(255, 215, 0, 0.4) 30%, transparent 70%);
          box-shadow: 0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 0, 0.2);
        }
        
        .glow-effect {
          background: radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 70%);
          box-shadow: 0 0 40px rgba(147, 51, 234, 0.7), inset 0 0 25px rgba(147, 51, 234, 0.3);
        }
        
        .burst-effect {
          background: radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(249, 115, 22, 0.4) 35%, transparent 70%);
          box-shadow: 0 0 50px rgba(251, 146, 60, 0.8), inset 0 0 30px rgba(251, 146, 60, 0.4);
        }
        
        .spiral-effect {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 35%, transparent 70%);
          box-shadow: 0 0 45px rgba(59, 130, 246, 0.7), inset 0 0 25px rgba(59, 130, 246, 0.3);
        }
        
        .crown-effect {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.7) 0%, rgba(255, 193, 7, 0.5) 30%, rgba(255, 152, 0, 0.3) 60%, transparent 80%);
          box-shadow: 0 0 60px rgba(255, 215, 0, 0.9), inset 0 0 35px rgba(255, 215, 0, 0.5), 0 0 100px rgba(255, 215, 0, 0.3);
        }
      `}</style>

      <div
        className={`
          relative transition-all duration-300 
          ${getAnimationClasses()}
          ${
            isClickable && cooldown === 0
              ? "cursor-pointer hover:scale-105"
              : ""
          }
          ${!isClickable ? "cursor-not-allowed" : ""}
        `}
        onClick={handleBadgeClick}
        title={
          isClickable && cooldown === 0 ? "Click for amazing animation!" : ""
        }
      >
        {isAnimating && (
          <div className="absolute -inset-8 pointer-events-none z-10 overflow-hidden">
            {getAnimationIcon()}

            <div className="absolute inset-0">{renderParticles()}</div>

            {animationType === "sparkleStorm" && (
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full animate-ping"
                    style={{
                      top: `${20 + i * 7}%`,
                      left: `${15 + i * 6}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${1.5 + i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {animationType === "crownExplosion" && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`ring-${i}`}
                    className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-ping"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: "2s",
                      transform: `scale(${1 + i * 0.5})`,
                      opacity: 0.3 - i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`relative z-20 ${
            isAnimating
              ? getAnimationClasses().includes("sparkle-storm")
                ? "crown-effect"
                : getAnimationClasses().includes("crown-explosion")
                ? "crown-effect"
                : getAnimationClasses().includes("medal-glow")
                ? "glow-effect"
                : getAnimationClasses().includes("trophy-rise")
                ? "burst-effect"
                : "sparkle-effect"
              : ""
          }`}
        >
          {children}
        </div>

        {cooldown > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            {cooldown}
          </div>
        )}
      </div>
    </>
  );
};

export default BadgeAnimations;
