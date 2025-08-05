import {
  ResumeProvider,
  useResumeData,
} from "../context/ResumeContext";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { ExperienceSection } from "./sections/ExperienceSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ResumePreview } from "./preview/ResumePreview";
import Header from "./Header";
import { ScrollArea } from "./ui/scroll-area";
import { generateMockExperience } from "../utils/mockData";

function ResumeBuilderContent() {
  const { resumeData, dispatch } = useResumeData();

  // Handle adding new experience
  const handleAddExperience = () => {
    const newExperience = generateMockExperience();
    dispatch({
      type: "ADD_EXPERIENCE",
      payload: newExperience,
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <Header resumeData={resumeData} />

      {/* Main Content Area - Two Columns */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Edit Forms */}
        <div className="w-[320px] sm:w-[400px] md:w-[480px] lg:w-[512px] border-r border-slate-100 bg-background flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="px-3 sm:px-4 md:px-6 py-6 space-y-0">
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
          <div className="h-full overflow-auto">
            <div className="p-3 sm:p-4 md:p-6 flex justify-center" style={{ minWidth: "850px" }}>
              {/* Fixed A4 size container for preview */}
              <div
                className="bg-white border border-slate-100 shadow-lg overflow-hidden flex-shrink-0"
                style={{ width: "794px", height: "1123px" }}
              >
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
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