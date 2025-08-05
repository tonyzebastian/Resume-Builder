import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { ResumeBuilder } from './components/ResumeBuilder';
import MobileBlocker from './components/MobileBlocker';
import { isMobileDevice } from './utils/deviceDetection';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check device type on mount and window resize
    const checkDevice = () => {
      setIsMobile(isMobileDevice());
      setIsChecking(false);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Show loading state briefly while checking device
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <img src="/logo.png" alt="Resume Builder Logo" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }

  // Show mobile blocker for mobile devices
  if (isMobile) {
    return <MobileBlocker />;
  }

  // Show main app for desktop devices
  return (
    <>
      <ResumeBuilder />
      <Toaster 
        position="bottom-center" 
        duration={3000}
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e2e8f0',
            width: 'auto',
            minWidth: 'auto',
            padding: '12px 16px',
          },
        }}
      />
    </>
  );
}