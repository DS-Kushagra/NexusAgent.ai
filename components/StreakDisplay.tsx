"use client";

import { useEffect, useState } from "react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalInterviews: number;
  lastInterviewDate: string;
}

export default function StreakDisplay() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await fetch("/api/automation/streak");
      if (response.ok) {
        const data = await response.json();
        setStreak(data.streak);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-dark-200 rounded-xl p-6 h-32" />;
  }

  if (!streak) return null;

  const { currentStreak, longestStreak, totalInterviews } = streak;

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔥</span>
            <div>
              <h3 className="text-2xl font-bold text-orange-500">
                {currentStreak} Day Streak
              </h3>
              <p className="text-sm text-gray-400">
                Keep it going! Practice daily to maintain your streak
              </p>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-xs text-gray-500">Longest Streak</p>
              <p className="text-lg font-bold text-yellow-500">
                {longestStreak} days
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Interviews</p>
              <p className="text-lg font-bold text-blue-500">
                {totalInterviews}
              </p>
            </div>
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="text-center">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-dark-300"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${
                    (currentStreak / (longestStreak || currentStreak)) * 251.2
                  } 251.2`}
                  className="text-orange-500"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold text-orange-500">
                  {currentStreak}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
