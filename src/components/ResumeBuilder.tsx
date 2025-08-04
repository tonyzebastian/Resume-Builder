import React, { useState } from "react";
import {
  ResumeProvider,
  useResumeData,
} from "../context/ResumeContext";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { ExperienceSection } from "./sections/ExperienceSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ResumePreview } from "./preview/ResumePreview";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import {
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { generateMockExperience } from "../utils/mockData";
import {
  generateResumePDF,
  downloadPDF,
} from "../utils/pdfGenerator";

function ResumeBuilderContent() {
  const { resumeData, dispatch, hasUnsavedChanges } =
    useResumeData();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Handle adding new experience
  const handleAddExperience = () => {
    const newExperience = generateMockExperience();
    dispatch({
      type: "ADD_EXPERIENCE",
      payload: newExperience,
    });
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      const pdfBytes = await generateResumePDF(resumeData);
      const filename = `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
      downloadPDF(pdfBytes, filename);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfError(
        error instanceof Error
          ? error.message
          : "Failed to generate PDF",
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Full Width Header */}
      <header className="border-b border-slate-100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">
              The Simplest Resume Builder
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* PDF download button */}
            <Button
              onClick={handleGeneratePDF}
              variant="default"
              className="w-auto bg-slate-950 text-slate-50 font-sans tracking-wide font-normal hover:bg-slate-700"
            >
              <Download className="h-4 w-4 text-slate-50" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {(pdfError || pdfSuccess) && (
        <div className="px-6 py-2 flex-shrink-0">
          {pdfError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{pdfError}</AlertDescription>
            </Alert>
          )}
          {pdfSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                PDF downloaded successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Main Content Area - Two Columns */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Edit Forms */}
        <div className="w-[512px] border-r border-slate-100 bg-background flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="px-6 py-6 space-y-0">
              {/* Personal Information */}
              <PersonalInfoForm
                data={resumeData.personalInfo}
                onUpdate={(updates) =>
                  dispatch({
                    type: "UPDATE_PERSONAL_INFO",
                    payload: updates,
                  })
                }
              />

              {/* Experience Section */}
              <ExperienceSection
                experiences={resumeData.experience}
                onAdd={handleAddExperience}
                onUpdate={(id, updates) =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: { id, updates },
                  })
                }
                onRemove={(id) =>
                  dispatch({
                    type: "REMOVE_EXPERIENCE",
                    payload: id,
                  })
                }
                onReorder={(fromIndex, toIndex) =>
                  dispatch({
                    type: "REORDER_EXPERIENCE",
                    payload: { fromIndex, toIndex },
                  })
                }
              />

              {/* Skills Section */}
              <SkillsSection
                skills={resumeData.skills}
                onUpdate={(updates) =>
                  dispatch({
                    type: "UPDATE_SKILLS",
                    payload: updates,
                  })
                }
              />
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - Preview Canvas */}
        <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
          <ScrollArea className="h-full">
            <div className="p-6 flex justify-center">
              {/* Fixed A4 size container for preview */}
              <div
                className="bg-white border border-slate-100 shadow-lg overflow-hidden"
                style={{ width: "794px", height: "1123px" }}
              >
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}