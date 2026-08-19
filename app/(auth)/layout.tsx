import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Mic, MessageSquareText, Target } from "lucide-react";

import { isAuthenticated } from "@/lib/actions/auth.action";
import SplineScene from "@/components/SplineScene";

const features = [
  { icon: Mic, label: "AI-Powered Interview Practice" },
  { icon: MessageSquareText, label: "Real-time Feedback" },
  { icon: Target, label: "Industry-Specific Questions" },
];

const FeatureList = () => (
  <ul className="flex list-none flex-col gap-5">
    {features.map(({ icon: Icon, label }) => (
      <li key={label} className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary-200/20 bg-primary-200/10">
          <Icon className="size-5 text-primary-200" aria-hidden="true" />
        </span>
        <span className="text-lg font-medium text-white xl:text-xl">
          {label}
        </span>
      </li>
    ))}
  </ul>
);

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-100">
      {/* One ambient wash for the whole page, rather than a separate gradient
          stack per panel. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(202,197,254,0.10),transparent_65%)]" />

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[200%] w-full -translate-y-1/4">
              <SplineScene className="size-full object-cover" />
            </div>
          </div>

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-100 via-dark-100/70 to-dark-100/40" />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              NexusAgent AI
            </h1>
            <p className="mt-1.5 text-sm text-light-100/80">
              Practice interviews with AI
            </p>
          </div>
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-11rem)] items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="relative flex min-h-screen">
          {/* Left: scene + value proposition */}
          <div className="relative w-1/2 overflow-hidden xl:w-3/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[120%] w-[120%] -translate-x-[5%]">
                <SplineScene className="size-full" />
              </div>
            </div>

            {/* Single directional scrim so the copy stays legible over the
                scene without stacking four overlays. */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-dark-100 via-dark-100/80 to-transparent" />

            <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 xl:p-16">
              <div className="max-w-xl">
                <h1 className="text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
                  <span className="block text-white">Practice with AI.</span>
                  <span className="block text-primary-200">
                    Ace Your Interview.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-light-100/80">
                  Experience realistic interview scenarios powered by advanced
                  AI. Build confidence, improve your skills, and land your dream
                  job.
                </p>

                <div className="mt-12">
                  <FeatureList />
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="relative flex w-1/2 items-center justify-center p-8 xl:w-2/5 xl:p-16">
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-light-800 to-transparent" />
            <div className="relative z-10 w-full max-w-lg">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
