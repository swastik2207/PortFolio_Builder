'use client';
import Image from "next/image";
import { ArrowRight, Sparkles, Code, Palette, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background image */}
      <Image
        src="/landing-preview.png"
        alt="Portfolio Preview"
        fill
        className="z-0 object-cover"
        priority
      />

      {/* Simplified dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 w-full">
        {/* Simple badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/90 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">No Code Required</span>
        </div>

        {/* Main heading with better contrast */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white mr-2">
            Portfolio
          </span>
          <span className="text-purple-400 ml-2">
            Platform
          </span>
        </h1>

        {/* Subtitle with high contrast */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-8 text-gray-100">
          Fill the form and get your portfolio{" "}
          <span className="text-purple-400 font-bold">
            like this
          </span>
        </h2>

        {/* Description with better readability */}
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create stunning developer portfolios in minutes with our intuitive platform.
          <span className="text-purple-300 font-semibold"> Stand out from the crowd</span> with
          professional designs that showcase your skills perfectly.
        </p>

        {/* Clean CTA Button */}
        <div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-300 hover:scale-105 transform"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </main>
  );
}