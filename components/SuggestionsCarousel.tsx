"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Suggestion {
  role: string;
  level: string;
  type: string;
  techStack: string[];
  reason: string;
  priority: number;
}

export default function SuggestionsCarousel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/automation/suggestions");
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-dark-200 rounded-xl p-6 h-64" />;
  }

  if (suggestions.length === 0) return null;

  const currentSuggestion = suggestions[currentIndex];

  const nextSuggestion = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + suggestions.length) % suggestions.length
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <h3 className="text-xl font-bold">Personalized Suggestions</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>
            {currentIndex + 1} / {suggestions.length}
          </span>
        </div>
      </div>

      <div className="relative bg-dark-200 rounded-lg p-6 min-h-[200px]">
        <div className="space-y-4">
          <div>
            <h4 className="text-2xl font-bold text-purple-400">
              {currentSuggestion.role}
            </h4>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                {currentSuggestion.level}
              </span>
              <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                {currentSuggestion.type}
              </span>
            </div>
          </div>

          <p className="text-gray-300">{currentSuggestion.reason}</p>

          {currentSuggestion.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentSuggestion.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-dark-300 text-gray-300 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <Button asChild className="btn-primary w-full mt-4">
            <Link href="/interview">Start This Interview</Link>
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {suggestions.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={prevSuggestion}
            className="p-2 bg-dark-300 hover:bg-dark-400 rounded-full transition-colors"
            aria-label="Previous suggestion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSuggestion}
            className="p-2 bg-dark-300 hover:bg-dark-400 rounded-full transition-colors"
            aria-label="Next suggestion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Dots Indicator */}
      {suggestions.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {suggestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-purple-500 w-8"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to suggestion ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
