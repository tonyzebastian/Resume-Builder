import React from 'react';
import { ResumeData } from '../../types/ResumeData';
import { cn } from '../ui/utils';
interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
}
export function ResumePreview({ data, className }: ResumePreviewProps) {
  const { personalInfo, experience, skills } = data;
  const formatDateRange = (startDate: string, endDate: string, current?: boolean) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      try {
        // Handle MM/YYYY format
        if (dateString.includes('/')) {
          const [month, year] = dateString.split('/');
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          
          // Validate month and year
          if (monthNum >= 1 && monthNum <= 12 && yearNum > 1900 && yearNum < 2100) {
            // Create date with day 1 to avoid timezone issues
            const date = new Date(yearNum, monthNum - 1, 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
          
          // If invalid, just return the original string
          return dateString;
        }
        // Fallback for old YYYY-MM-DD format
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } catch {
        return dateString;
      }
    };
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };
  return (
    <div className={cn("bg-white relative w-full h-full", className)} data-name="A4 - 3">
      <div className="absolute left-16 top-16 flex flex-col gap-8 items-start justify-start">
        
        {/* Hero Section - Two Columns */}
        <div className="flex flex-row gap-11 items-center justify-start w-full">
          {/* Hero Content - Left Column */}
          <div className="flex flex-col gap-1 items-start justify-start w-[459px]" data-name="Hero">
            <div 
              className="font-medium text-[24px] leading-[28px] text-slate-950 relative shrink-0 whitespace-nowrap"
            >
              <p className="block leading-[28px]">{personalInfo.name}</p>
            </div>
            {/* Title and Sub Profession */}
            <div className="flex flex-row gap-2 items-center justify-start text-[14px] leading-[28px]">
              <div 
                className="font-medium text-slate-950 whitespace-nowrap"
              >
                <p className="block leading-[28px] whitespace-pre">{personalInfo.title}</p>
              </div>
              {/* Only show separator and subTitle if subTitle exists */}
              {personalInfo.subTitle && personalInfo.subTitle.trim() && (
                <>
                  <div 
                    className="font-normal text-slate-950 whitespace-nowrap"
                  >
                    <p className="block leading-[28px] whitespace-pre">/</p>
                  </div>
                  <div 
                    className="font-normal text-slate-800 whitespace-nowrap"
                  >
                    <p className="block leading-[28px] whitespace-pre">{personalInfo.subTitle}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Links Section - Right Column */}
          <div className="flex flex-col gap-2 items-start justify-start w-[169px] text-[12px] leading-[18px] text-slate-800" data-name="Links">
            <a 
              className="block whitespace-nowrap font-normal"
              href={personalInfo.website || '#'}
            >
              <p className="block leading-[18px] whitespace-pre">{personalInfo.website || 'tonyzeb.design'}</p>
            </a>
            <a 
              className="block whitespace-nowrap font-normal"
              href={`mailto:${personalInfo.email}`}
            >
              <p className="block leading-[18px] whitespace-pre">{personalInfo.email}</p>
            </a>
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="flex flex-row gap-11 items-start justify-start w-full">
          {/* Experience Section - Left Column */}
          <div className="flex flex-col gap-2 items-start justify-start w-[459px]" data-name="Experience">
            <div 
              className="font-semibold text-[14px] leading-[28px] text-slate-950 whitespace-nowrap"
            >
              <p className="block leading-[28px] whitespace-pre">Experience</p>
            </div>
            <div className="flex flex-col gap-8 items-start justify-start w-full">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-1 items-start justify-start w-full">
                  {/* Company and Position */}
                  <div className="flex flex-col items-start justify-start pb-1 pt-0 px-0 w-full">
                    <div className="flex flex-row gap-2 items-center justify-start text-[14px] leading-[28px] mb-[-4px]">
                      <div 
                        className="font-medium text-slate-950 whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">{exp.company}</p>
                      </div>
                      <div 
                        className="font-normal text-slate-950 whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">/</p>
                      </div>
                      <div 
                        className="font-normal text-slate-800 whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">{exp.position}</p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-start text-[12px] leading-[28px] text-slate-700 w-full mb-[-4px]">
                      <div 
                        className="font-normal whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">{exp.location}</p>
                      </div>
                      <div 
                        className="font-normal whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">/</p>
                      </div>
                      <div 
                        className="font-normal whitespace-nowrap"
                      >
                        <p className="block leading-[28px] whitespace-pre">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="flex flex-col gap-2 items-start justify-start w-full text-[11px] leading-[21px] text-slate-700" data-name="description">
                    {(typeof exp.description === 'string' 
                      ? exp.description.split('\n') 
                      : Array.isArray(exp.description) 
                        ? (exp.description as string[])
                        : [exp.description || '']
                    ).map((line, index) => (
                      <div 
                        key={index}
                        className="w-full font-normal"
                      >
                        <p className="block leading-[21px]">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section - Right Column */}
          <div className="flex flex-col gap-2 items-start justify-start w-[169px]" data-name="Skills">
            <div 
              className="font-semibold text-[14px] leading-[28px] text-slate-950 whitespace-nowrap"
            >
              <p className="block leading-[28px] whitespace-pre">Skills</p>
            </div>
            <div className="flex flex-col gap-8 items-start justify-start w-full">
              {/* Render custom skill categories */}
              {Object.entries(skills.categories || {}).map(([categoryName, skillList]) => (
                <div key={categoryName} className="flex flex-col items-start justify-start text-[11px] leading-[21px] text-slate-700 w-full" data-name={`Skill-${categoryName}`}>
                  <div 
                    className="font-semibold w-full"
                  >
                    <p className="block leading-[21px]">{categoryName}</p>
                  </div>
                  <div 
                    className="font-normal w-full"
                  >
                    {skillList.map((skill, index) => (
                      <React.Fragment key={index}>
                        {skill}
                        {index < skillList.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
              {/* Fallback to old structure if new structure doesn't exist */}
              {(!skills.categories || Object.keys(skills.categories).length === 0) && (
                <>
                  {skills.competencies && skills.competencies.length > 0 && (
                    <div className="flex flex-col items-start justify-start text-[11px] leading-[21px] text-slate-700 w-full">
                      <div 
                        className="font-semibold w-full"
                      >
                        <p className="block leading-[21px]">Competencies</p>
                      </div>
                      <div 
                        className="font-normal w-full"
                      >
                        {skills.competencies.map((skill, index) => (
                          <React.Fragment key={index}>
                            {skill}
                            {index < skills.competencies.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.technical?.code && skills.technical.code.length > 0 && (
                    <div className="flex flex-col items-start justify-start text-[11px] leading-[21px] text-slate-700 w-full">
                      <div 
                        className="font-semibold w-full"
                      >
                        <p className="block leading-[21px]">Code</p>
                      </div>
                      <div 
                        className="font-normal w-full"
                      >
                        {skills.technical.code.map((skill, index) => (
                          <React.Fragment key={index}>
                            {skill}
                            {index < skills.technical.code.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.technical?.design && skills.technical.design.length > 0 && (
                    <div className="flex flex-col items-start justify-start text-[11px] leading-[21px] text-slate-700 w-full">
                      <div 
                        className="font-semibold w-full"
                      >
                        <p className="block leading-[21px]">Design</p>
                      </div>
                      <div 
                        className="font-normal w-full"
                      >
                        {skills.technical.design.map((skill, index) => (
                          <React.Fragment key={index}>
                            {skill}
                            {index < skills.technical.design.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}