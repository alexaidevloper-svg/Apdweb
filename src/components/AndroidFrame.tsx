import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
  onBackPress?: () => void;
  isLandscape?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col">
      {/* स्टेटस बार */}
      <div className="w-full h-6 bg-slate-900 flex items-center justify-between px-4 text-white text-[10px] flex-shrink-0">
        <span className="font-semibold">9:41</span>
        <div className="flex gap-1 items-center">
          <span>📶</span>
          <span>📶</span>
          <span className="text-xs">🔋</span>
        </div>
      </div>
      
      {/* मुख्य कंटेंट - पूरी स्क्रीन */}
      <main className="flex-1 w-full bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
