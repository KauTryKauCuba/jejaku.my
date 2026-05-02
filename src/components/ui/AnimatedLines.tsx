'use client';

import React from 'react';

export const AnimatedLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonal-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="currentColor" strokeWidth="0.5" className="text-border/30" />
          </pattern>
          
          <linearGradient id="highlight-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#diagonal-grid)" />

        {/* Moving Highlights */}
        {[...Array(15)].map((_, i) => (
          <line
            key={i}
            x1="-100"
            y1={i * 100}
            x2="100%"
            y2={i * 100 + 1000}
            stroke="url(#highlight-grad)"
            strokeWidth="1.5"
            strokeDasharray="100 1000"
            className="animate-diagonal-pulse"
            style={{
              animationDelay: `${i * -1.2}s`,
              animationDuration: `${8 + (i % 5) * 2}s`
            }}
          />
        ))}

        {/* More highlights from the top */}
        {[...Array(10)].map((_, i) => (
          <line
            key={`top-${i}`}
            x1={i * 150}
            y1="-100"
            x2={i * 150 + 1000}
            y2="100%"
            stroke="url(#highlight-grad)"
            strokeWidth="1.5"
            strokeDasharray="150 1200"
            className="animate-diagonal-pulse"
            style={{
              animationDelay: `${i * -2.5}s`,
              animationDuration: `${10 + (i % 3) * 3}s`
            }}
          />
        ))}
      </svg>
      
      <style jsx>{`
        @keyframes diagonal-pulse {
          0% { stroke-dashoffset: 1500; }
          100% { stroke-dashoffset: -1500; }
        }
        .animate-diagonal-pulse {
          animation: diagonal-pulse linear infinite;
        }
      `}</style>
    </div>
  );
};
