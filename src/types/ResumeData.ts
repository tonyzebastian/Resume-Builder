/**
 * Core data types for the Resume Builder application
 */

export interface PersonalInfo {
  name: string;
  title: string;
  subTitle?: string; // New field for sub profession title
  email: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Skills {
  // New flexible structure for custom skill categories
  categories?: Record<string, string[]>;
  
  // Keep old structure for backward compatibility
  competencies: string[];
  technical: {
    code: string[];
    design: string[];
  };
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}


export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: Skills;
  education: Education[];
  projects?: Project[];
}

/**
 * Validation result for form inputs
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Options for mock data generation
 */
export interface MockDataOptions {
  includeOptionals?: boolean;
  includeProjects?: boolean;
  includeGPA?: boolean;
  includeURL?: boolean;
  current?: boolean;
}

/**
 * Resume context state and dispatch types
 */
export type ResumeAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; updates: Partial<Experience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'REORDER_EXPERIENCE'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'UPDATE_SKILLS'; payload: Skills }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; updates: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'LOAD_DATA'; payload: ResumeData }
  | { type: 'RESET_DATA' };

export interface ResumeContextState {
  resumeData: ResumeData;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}