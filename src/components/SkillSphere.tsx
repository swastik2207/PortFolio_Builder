'use client';

import React from 'react';
import Image from 'next/image';

interface SkillSphereProps {
  name: string;
  logo: string;
  confidence: number;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return '#10b981'; // green-500
  if (confidence >= 60) return '#3b82f6'; // blue-500
  if (confidence >= 40) return '#c084fc'; // yellow-500
  return '#faedf3'; // muted
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 80) return 'Expert';
  if (confidence >= 60) return 'Proficient';
  if (confidence >= 40) return 'Intermediate';
  return 'Beginner';
};

const SkillSphere: React.FC<SkillSphereProps> = ({ name, logo, confidence }) => {
  return (
    <div
      className="relative p-6 text-center overflow-hidden group cursor-pointer"
      style={{
        background: 'rgba(26, 31, 46, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Animated background effects */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* Floating particles */}
        <div
          className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float-1 opacity-60"
          style={{
            top: '20%',
            left: '15%',
            animationDelay: '0s'
          }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float-2 opacity-50"
          style={{
            top: '70%',
            right: '20%',
            animationDelay: '1s'
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-green-400 rounded-full animate-float-3 opacity-40"
          style={{
            top: '40%',
            right: '10%',
            animationDelay: '2s'
          }}
        />

        {/* Pulsing rings */}
        <div
          className="absolute w-32 h-32 rounded-full border animate-pulse-ring opacity-30"
          style={{
            borderColor: getConfidenceColor(confidence),
            borderWidth: '1px',
            animationDuration: '3s'
          }}
        />
        <div
          className="absolute w-24 h-24 rounded-full border animate-pulse-ring-delayed opacity-20"
          style={{
            borderColor: getConfidenceColor(confidence),
            borderWidth: '1px',
            animationDuration: '4s',
            animationDelay: '1.5s'
          }}
        />
      </div>

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${getConfidenceColor(confidence)}40 0%, transparent 70%)`,
          filter: 'blur(8px)'
        }}
      />

      {/* Glass reflection effect */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          borderRadius: '16px 16px 0 0'
        }}
      />

      {/* Logo positioned on top */}
      <div className="relative z-10 mb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/90 border border-white/10 flex items-center justify-center animate-bounce-subtle group-hover:scale-110 transition-transform duration-300">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-color-shift" />
          )}
        </div>
      </div>

      {/* Content on top */}
      <div className="relative z-10">
        {/* Skill Name */}
        <h4
          className="text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300"
          style={{
            color: '#e2e8f0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          {name}
        </h4>

        {/* Confidence Level Label */}
        <div className="mb-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium animate-glow transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${getConfidenceColor(confidence)}20`,
              color: getConfidenceColor(confidence),
              border: `1px solid ${getConfidenceColor(confidence)}40`
            }}
          >
            {getConfidenceLabel(confidence)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between">
          <div
            className="flex-1 mr-3 rounded-full h-2 overflow-hidden"
            style={{
              backgroundColor: 'rgba(100, 116, 139, 0.2)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{
                width: `${confidence}%`,
                background: `linear-gradient(90deg, ${getConfidenceColor(confidence)}, ${getConfidenceColor(confidence)}80)`
              }}
            >

              <div
                className="absolute inset-0 rounded-full animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>
          <span
            className="text-sm font-medium animate-counter"
            style={{ color: '#94a3b8' }}
          >
            {confidence}%
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(-5px) translateX(-3px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-8px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(3px); }
          75% { transform: translateY(-12px) translateX(-5px); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse-ring-delayed {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes color-shift {
          0% { background: linear-gradient(45deg, #3b82f6, #8b5cf6); }
          33% { background: linear-gradient(45deg, #10b981, #3b82f6); }
          66% { background: linear-gradient(45deg, #f59e0b, #ef4444); }
          100% { background: linear-gradient(45deg, #3b82f6, #8b5cf6); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: var(--target-width); }
        }
        
        @keyframes counter {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        
        .animate-pulse-ring-delayed {
          animation: pulse-ring-delayed 4s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        
        .animate-color-shift {
          animation: color-shift 4s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-progress-fill {
          animation: progress-fill 2s ease-out forwards;
        }
        
        .animate-counter {
          animation: counter 1s ease-out 1.5s both;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .group:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SkillSphere;
export { SkillSphere };