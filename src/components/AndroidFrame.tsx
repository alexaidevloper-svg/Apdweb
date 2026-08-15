import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
  onBackPress?: () => void;
  isLandscape?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ 
  children,
  onHomePress,
  onBackPress,
  isLandscape = false 
}) => {
  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen overflow-hidden bg-slate-900">
      {/* स्टेटस बार */}
      <div className="w-full h-7 bg-slate-900 flex items-center justify-between px-5 text-white text-xs">
        <span className="font-semibold">9:41</span>
        <div className="flex gap-1.5 items-center">
          <span>📶</span>
          <span>📶</span>
          <span className="text-sm">🔋</span>
        </div>
      </div>
      
      <main className="w-full h-[calc(100vh-28px)] overflow-hidden bg-white rounded-t-3xl">
        <div className="w-full h-full overflow-y-auto px-4 py-4 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};
