import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
  onBackPress?: () => void;
  isLandscape?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center overflow-x-hidden">
      <main className="w-full max-w-[430px] min-h-screen bg-slate-900 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
