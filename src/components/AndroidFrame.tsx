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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-900">
      <main
        className="
          mx-auto
          min-h-screen
          w-full
          max-w-[430px]
          overflow-x-hidden
          bg-slate-900
        "
      >
        {children}
      </main>
    </div>
  );
};
