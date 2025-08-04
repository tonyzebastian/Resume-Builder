import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Project } from '../types/ResumeData';
import { mockResumeData } from '../utils/mockData';
import { useLocalStorage, useAutoSave } from '../hooks/useLocalStorage';

// Action types for the reducer
export type ResumeAction =
  | { type: 'LOAD_DATA'; payload: ResumeData }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; updates: Partial<Experience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'REORDER_EXPERIENCE'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; updates: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'UPDATE_SKILLS'; payload: ResumeData['skills'] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'RESET_DATA' };

// State interface
interface ResumeState {
  resumeData: ResumeData;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

// Context interface  
interface ResumeContextType extends ResumeState {
  dispatch: React.Dispatch<ResumeAction>;
}

// Initial state
const initialState: ResumeState = {
  resumeData: mockResumeData,
  isLoading: false,
  lastSaved: null,
  hasUnsavedChanges: false,
};

// Resume reducer
function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        resumeData: action.payload,
        isLoading: false,
        hasUnsavedChanges: false,
      };

    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          personalInfo: action.payload,
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: [action.payload, ...state.resumeData.experience],
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.map(exp => 
            exp.id === action.payload.id 
              ? { ...exp, ...action.payload.updates }
              : exp
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.filter(exp => exp.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };

    case 'REORDER_EXPERIENCE':
      const { fromIndex, toIndex } = action.payload;
      const newExperience = [...state.resumeData.experience];
      const [removed] = newExperience.splice(fromIndex, 1);
      newExperience.splice(toIndex, 0, removed);
      
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: newExperience,
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: [action.payload, ...state.resumeData.education],
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.map(edu => 
            edu.id === action.payload.id 
              ? { ...edu, ...action.payload.updates }
              : edu
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'REMOVE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter(edu => edu.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_SKILLS':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: action.payload,
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: [action.payload, ...(state.resumeData.projects || [])],
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: (state.resumeData.projects || []).map(project => 
            project.id === action.payload.id 
              ? { ...project, ...action.payload.updates }
              : project
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'REMOVE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: (state.resumeData.projects || []).filter(project => project.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };


    case 'RESET_DATA':
      return {
        ...initialState,
        hasUnsavedChanges: true,
      };

    default:
      return state;
  }
}

// Create context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Provider component
interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const [storedData, setStoredData] = useLocalStorage<ResumeData>('resume-data', mockResumeData);

  // Load data from localStorage on mount
  useEffect(() => {
    if (storedData) {
      dispatch({ type: 'LOAD_DATA', payload: storedData });
    }
  }, [storedData]);

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave(
    state.resumeData,
    (data) => {
      setStoredData(data);
    },
    2000 // Save after 2 seconds of inactivity
  );

  const contextValue: ResumeContextType = {
    ...state,
    lastSaved: lastSaved || state.lastSaved,
    isLoading: state.isLoading || isSaving,
    dispatch,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
}

// Custom hook to use the context
export function useResumeData() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeProvider');
  }
  return context;
}