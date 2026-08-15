// components/AndroidFrame.tsx
import React, { useEffect } from 'react';

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
  // Fullscreen mode force karo
  useEffect(() => {
    // Agar fullscreen available hai toh enable karo
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
    
    // Screen orientation lock (optional)
    if (isLandscape && screen.orientation?.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    } else if (screen.orientation?.lock) {
      screen.orientation.lock('portrait').catch(() => {});
    }
    
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isLandscape]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#0f172a',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        // Touch events ko prevent karo zoom/hide se
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      // Tap/click par zoom/hide prevent
      onTouchStart={(e) => {
        // Agar double tap hai toh prevent karo
        if (e.touches.length === 1) {
          // Single touch - normal behavior
        }
      }}
      onTouchMove={(e) => {
        // Prevent pull-to-refresh
        e.preventDefault();
      }}
    >
      {/* Content container - full screen */}
      <div 
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#ffffff',
          position: 'relative',
          // iOS Safari ke liye
          WebkitOverflowScrolling: 'touch',
        }}
        // Prevent zoom on double tap
        onDoubleClick={(e) => e.preventDefault()}
      >
        {children}
      </div>
    </div>
  );
};
