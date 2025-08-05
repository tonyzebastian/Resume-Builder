import { Monitor, Smartphone } from 'lucide-react';

export default function MobileBlocker() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center gap-4">
          <div className="relative">
            <Monitor className="w-16 h-16 text-slate-700" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-slate-300"></div>
          </div>
          <div className="relative opacity-50">
            <Smartphone className="w-16 h-16 text-slate-400" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <img src="/logo.png" alt="Resume Builder Logo" className="w-16 h-16 mx-auto mb-6" />
        
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Desktop Experience Required
        </h1>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          The Simplest Resume Builder is optimized for desktop and laptop computers to provide the best editing experience. 
        </p>
        
        <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6">
          <h2 className="font-medium text-slate-900 mb-3">To use this app:</h2>
          <ul className="text-sm text-slate-600 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Open this link on a desktop or laptop computer</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Use a screen size of at least 1024px wide</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Chrome, Firefox, Safari, or Edge browsers recommended</span>
            </li>
          </ul>
        </div>
        
        <p className="text-xs text-slate-500">
          Thank you for understanding. We're working on a mobile version!
        </p>
      </div>
    </div>
  );
}