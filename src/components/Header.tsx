import React from 'react';
import { toast } from 'sonner';
import UIGlowLogoMini from './ui/LogoMini';
import { generateResumePDF, downloadPDF } from '../utils/pdfGenerator';
import { ResumeData } from '../types/ResumeData';
import { Github, Download } from 'lucide-react';

interface HeaderProps {
  resumeData: ResumeData;
}

export default function Header({ resumeData }: HeaderProps) {
  const handleDownloadPDF = async () => {
    if (resumeData) {
      // Show loading toast
      const loadingToast = toast.loading('Generating PDF...');

      try {
        const pdfBytes = await generateResumePDF(resumeData);
        const filename = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
        downloadPDF(pdfBytes, filename);
        
        // Show success toast
        toast.success('PDF downloaded successfully!', {
          id: loadingToast
        });
      } catch (error) {
        console.error('PDF generation failed:', error);
        
        // Show error toast
        toast.error('Failed to generate PDF', {
          id: loadingToast
        });
      }
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Resume Builder Logo" className="w-8 h-8" />
        <h1 className="font-semibold text-xl text-slate-900">The Simplest Resume Builder</h1>

      </div>
      
      <div className="flex items-center gap-4">
        <a
          href="http://tonyzeb.design"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-muted hover:bg-muted/80 transition-colors border border-slate-300 hover:border-blue-500"
        >
          <img 
            src="/profile.jpg" 
            alt="Tony's profile"
            className="w-7 h-7 rounded-md object-cover"
          />
          <span className="text-sm font-medium text-foreground">tonyzeb.design</span>
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub repository"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 hover:border-blue-500 bg-background hover:bg-accent hover:text-accent-foreground p-2 text-slate-600 "
        >
          <Github className="w-4 h-4" />
        </a>

        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-700 px-4 py-2"
        >
          <Download className="w-4 h-4 text-slate-50" />
          Download PDF
        </button>
        
      </div>
    </header>
  );
}