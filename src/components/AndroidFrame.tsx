import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
  onBackPress?: () => void;
  isLandscape?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-slate-900">
      <main className="w-full min-h-screen overflow-x-hidden bg-slate-900">
        {children}
      </main>
    </div>
  );
};
