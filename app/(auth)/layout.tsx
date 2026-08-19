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

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-100">
      {/* One ambient wash for the whole page. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(202,197,254,0.10),transparent_65%)]" />

      {/* A single tree that reflows at lg, rather than two parallel trees.
          The scene and the form each mount exactly once: previously both were
          rendered twice and one copy hidden, which loaded the Spline scene
          twice and put a duplicate set of form fields in the DOM. */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Scene: a short banner on mobile, a full-height column at lg. */}
        <section className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:w-1/2 xl:w-3/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[200%] w-full -translate-y-[25%] lg:h-[120%] lg:w-[120%] lg:translate-y-0 lg:-translate-x-[5%]">
              <SplineScene className="size-full object-cover" />
            </div>
          </div>

          {/* Scrim runs bottom-up on mobile and left-to-right at lg, so the
              copy stays legible in both orientations. */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-100 via-dark-100/70 to-dark-100/40 lg:bg-gradient-to-r lg:from-dark-100 lg:via-dark-100/80 lg:to-transparent" />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center lg:items-start lg:p-12 lg:text-left xl:p-16">
            {/* Compact wordmark for the banner. */}
            <div className="lg:hidden">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                NexusAgent AI
              </h1>
              <p className="mt-1.5 text-sm text-light-100/80">
                Practice interviews with AI
              </p>
            </div>

            {/* Full value proposition, only where there is room for it. */}
            <div className="hidden max-w-xl lg:block">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
                <span className="block text-white">Practice with AI.</span>
                <span className="block text-primary-200">
                  Ace Your Interview.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-light-100/80">
                Experience realistic interview scenarios powered by advanced AI.
                Build confidence, improve your skills, and land your dream job.
              </p>

              <ul className="mt-12 flex list-none flex-col gap-5">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary-200/20 bg-primary-200/10">
                      <Icon
                        className="size-5 text-primary-200"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-lg font-medium text-white xl:text-xl">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Form */}
        <main className="relative flex flex-1 items-center justify-center p-6 lg:p-8 xl:p-16">
          <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-light-800 to-transparent lg:block" />
          <div className="relative z-10 w-full max-w-md lg:max-w-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
