import React from 'react';
import { Toaster } from 'sonner';
import { ResumeBuilder } from './components/ResumeBuilder';

export default function App() {
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