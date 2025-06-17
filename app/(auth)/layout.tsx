import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import SplineScene from "@/components/SplineScene";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Global unified background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Enhanced mobile header with controlled Spline */}
        <div className="relative h-48 overflow-hidden">
          {/* Rich gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/90 to-gray-800/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(100,70,255,0.15),transparent_70%)]"></div>

          {/* Contained Spline with proper positioning */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-[200%] transform translate-y-[-25%]">
              <SplineScene className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/60 z-10"></div>

          {/* Header content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-3xl font-black mb-2">
              <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent drop-shadow-xl">
                NexusAgent AI
              </span>
            </h1>
            <p className="text-base text-gray-200 font-medium drop-shadow-lg">
              Practice interviews with AI
            </p>
          </div>
        </div>

        {/* Enhanced mobile form area */}
        <div className="flex items-center justify-center p-6 relative z-10 min-h-[calc(100vh-12rem)]">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(100,70,255,0.08),transparent_70%)]"></div>

          {/* Animated glow spots */}
          <div
            className="absolute left-[10%] top-[30%] w-40 h-40 bg-primary-200/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute right-[10%] bottom-[20%] w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          ></div>

          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      {/* Desktop unified layout */}
      <div className="hidden lg:block">
        <div className="flex min-h-screen relative">
          {/* Left side - Enhanced Spline Scene */}
          <div className="w-1/2 xl:w-3/5 relative overflow-hidden">
            {/* Advanced background layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,70,255,0.15),transparent_70%)]"></div>

            {/* Contained Spline with proper positioning */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[120%] h-[120%] transform -translate-x-[5%]">
                <SplineScene className="w-full h-full" />
              </div>
            </div>

            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-8 xl:p-16 text-white">
              <div className="max-w-2xl">
                <div className="mb-10">
                  <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                    <span className="block text-white drop-shadow-2xl">
                      Practice with AI.
                    </span>
                    <span className="block bg-gradient-to-r from-primary-200 via-blue-400 to-primary-200 bg-clip-text text-transparent drop-shadow-lg">
                      Ace Your Interview.
                    </span>
                  </h1>
                  <p className="text-lg xl:text-xl text-gray-200 leading-relaxed drop-shadow-lg max-w-xl font-medium">
                    Experience realistic interview scenarios powered by advanced
                    AI. Build confidence, improve your skills, and land your
                    dream job.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 ease-out">
                      <svg
                        className="w-7 h-7 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xl xl:text-2xl font-semibold text-white drop-shadow-md">
                      AI-Powered Interview Practice
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 ease-out">
                      <svg
                        className="w-7 h-7 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xl xl:text-2xl font-semibold text-white drop-shadow-md">
                      Real-time Feedback
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 ease-out">
                      <svg
                        className="w-7 h-7 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <span className="text-xl xl:text-2xl font-semibold text-white drop-shadow-md">
                      Industry-Specific Questions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Right side - Enhanced form area */}
          <div className="w-1/2 xl:w-2/5 relative flex items-center justify-center p-8 xl:p-16">
            {/* Rich glass-like background with depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(100,70,255,0.08),transparent_70%)]"></div>

            {/* Enhanced animated glow spots */}
            <div
              className="absolute left-[10%] top-[30%] w-64 h-64 bg-primary-200/8 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "8s" }}
            ></div>
            <div
              className="absolute right-[20%] bottom-[20%] w-56 h-56 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "12s", animationDelay: "2s" }}
            ></div>

            {/* Premium glass effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary-200/20 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>

            {/* Modern connecting elements */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary-200/30 to-transparent"></div>
            <div className="absolute left-0 top-1/3 w-12 h-[1px] bg-gradient-to-r from-primary-200/50 to-transparent"></div>
            <div className="absolute left-0 top-2/3 w-20 h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent"></div>

            {/* Floating particles */}
            <div className="absolute top-1/4 left-12 w-2 h-2 bg-primary-200/60 rounded-full animate-pulse"></div>
            <div
              className="absolute top-3/4 left-6 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-2/4 left-20 w-1 h-1 bg-primary-200/30 rounded-full animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>

            <div className="w-full max-w-lg relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
