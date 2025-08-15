import React, { useState, useEffect } from 'react';

export const StickyLoader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: "0s" }}></div>
    <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: "0.2s" }}></div>
    <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: "0.4s" }}></div>
  </div>
);

export const CorporateStyles = () => (
  <style jsx="true" global="true">{`
    :root { --corporate-red: #e85a4f; --corporate-dark: #2d2d2d; --corporate-red-light: #fbeceb; }
    .bg-corporate-red { background-color: var(--corporate-red); }
    .text-corporate-red { color: var(--corporate-red); }
    .text-corporate-dark { color: var(--corporate-dark); }
    .border-corporate-red { border-color: var(--corporate-red); }
    .hover\\:bg-corporate-red-dark:hover { background-color: #d04a3f; }
  `}</style>
);

export const Confetti = () => {
  const confettiCount = 100;
  const colors = ["#E85A4F", "#2D2D2D", "#3b82f6", "#10b981", "#f59e0b"];
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        ></div>
      ))}
    </div>
  );
};

export const AnimatedCounter = ({ to, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(String(to).replace(/,/g, ""));
    if (start === end) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentNum = Math.floor(progress * end);
      setCount(currentNum);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [to, duration]);

  return <span>{count.toLocaleString("es-PE")}</span>;
};