"use client";

import { useEffect, useState } from "react";

interface SplineSceneProps {
  className?: string;
}

const SplineScene = ({ className }: SplineSceneProps) => {
  const [Spline, setSpline] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import Spline only on client side
    import('@splinetool/react-spline').then((SplineModule) => {
      setSpline(() => SplineModule.default);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load Spline:', error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !Spline) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/20 to-primary-500/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Spline
      scene="https://prod.spline.design/uwwTgYWW91JCVOJ8/scene.splinecode"
      className={className}
    />
  );
};

export default SplineScene;
