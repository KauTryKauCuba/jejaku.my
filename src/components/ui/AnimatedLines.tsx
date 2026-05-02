'use client';

import React from 'react';

export const AnimatedLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-10">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonal-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M-7.5,7.5 L7.5,-7.5 M0,30 L30,0 M22.5,37.5 L37.5,22.5" stroke="currentColor" strokeWidth="0.5" className="text-border/20" />
          </pattern>
          
          <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#diagonal-grid)" />

        {/* Technology Ribbon Waves */}
        {[...Array(5)].map((_, ribbonIndex) => {
          const yBase = 200 + ribbonIndex * 150;
          return (
            <g key={`ribbon-${ribbonIndex}`} className="opacity-40">
              {[...Array(3)].map((_, lineIndex) => (
                <path
                  key={`line-${lineIndex}`}
                  d={`M -100 ${yBase + lineIndex * 4} C 200 ${yBase - 100}, 400 ${yBase + 100}, 600 ${yBase} S 900 ${yBase - 50}, 1100 ${yBase + 50}`}
                  fill="none"
                  stroke="url(#ribbon-grad)"
                  strokeWidth="0.8"
                  
                  className="animate-ribbon-flow"
                  style={{
                    strokeDasharray: '200 800',
                    animationDelay: `${ribbonIndex * -2 + lineIndex * -0.2}s`,
                    animationDuration: `${12 + ribbonIndex * 2}s`,
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Opposite Ribbons */}
        {[...Array(3)].map((_, ribbonIndex) => {
          const yBase = 100 + ribbonIndex * 250;
          return (
            <g key={`ribbon-rev-${ribbonIndex}`} className="opacity-30">
              {[...Array(2)].map((_, lineIndex) => (
                <path
                  key={`line-rev-${lineIndex}`}
                  d={`M 1100 ${yBase + lineIndex * 6} C 800 ${yBase + 150}, 600 ${yBase - 150}, 400 ${yBase} S 100 ${yBase + 100}, -100 ${yBase - 50}`}
                  fill="none"
                  stroke="url(#ribbon-grad)"
                  strokeWidth="0.6"
                  className="animate-ribbon-flow-rev"
                  style={{
                    strokeDasharray: '150 900',
                    animationDelay: `${ribbonIndex * -3 + lineIndex * -0.5}s`,
                    animationDuration: `${18 + ribbonIndex * 4}s`,
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>
      
      <style jsx>{`
        @keyframes ribbon-flow {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: -1000; }
        }
        @keyframes ribbon-flow-rev {
          0% { stroke-dashoffset: -1000; }
          100% { stroke-dashoffset: 1000; }
        }
        .animate-ribbon-flow {
          animation: ribbon-flow linear infinite;
        }
        .animate-ribbon-flow-rev {
          animation: ribbon-flow-rev linear infinite;
        }
      `}</style>
    </div>
  );
};
