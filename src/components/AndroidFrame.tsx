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
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 overflow-x-hidden">
      <div className="min-h-screen w-full bg-slate-900">
        {children}
      </div>
    </div>
  );
};
