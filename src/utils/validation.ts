import { PersonalInfo, Experience, Education, ValidationResult } from '../types/ResumeData';

/**
 * Validates email format using a comprehensive regex pattern
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}


/**
 * Validates date range ensuring start date is before end date
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || typeof startDate !== 'string') return false;
  
  // Allow empty end date for current positions
  if (!endDate || endDate === '') return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  // Start date should be before end date
  return start < end;
}

/**
 * Validates required fields in an object
 */
export function validateRequiredFields(
  obj: Record<string, any>, 
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    const value = obj[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validates description length (max 500 characters per bullet point)
 */
export function validateDescriptionLength(description: string): boolean {
  if (!description || typeof description !== 'string') return false;
  if (description.trim().length === 0) return false;
  return description.length <= 500;
}

/**
 * Comprehensive personal info validation
 */
export function validatePersonalInfo(personalInfo: PersonalInfo): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  if (!personalInfo.name || personalInfo.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!personalInfo.title || personalInfo.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!personalInfo.email || personalInfo.email.trim() === '') {
    errors.push('Email is required');
  } else if (!validateEmail(personalInfo.email)) {
    errors.push('Invalid email format');
  }
  
  
  // Validate optional website URL if provided
  if (personalInfo.website && personalInfo.website.trim() !== '') {
    try {
      new URL(personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`);
    } catch {
      errors.push('Invalid website URL');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Comprehensive experience validation
 */
export function validateExperience(experience: Experience): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  if (!experience.company || experience.company.trim() === '') {
    errors.push('Company is required');
  }
  
  if (!experience.position || experience.position.trim() === '') {
    errors.push('Position is required');
  }
  
  if (!experience.location || experience.location.trim() === '') {
    errors.push('Location is required');
  }
  
  if (!experience.startDate || experience.startDate.trim() === '') {
    errors.push('Start date is required');
  }
  
  // Validate date range
  if (experience.startDate && !experience.current && experience.endDate) {
    if (!validateDateRange(experience.startDate, experience.endDate)) {
      errors.push('End date must be after start date');
    }
  }
  
  // Validate description
  if (!experience.description || experience.description.trim().length === 0) {
    errors.push('Job description is required');
  } else {
    const lines = experience.description.split('\n').filter(line => line.trim() !== '');
    lines.forEach((desc, index) => {
      if (!validateDescriptionLength(desc)) {
        errors.push(`Description line ${index + 1} is invalid or too long`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validates education entry
 */
export function validateEducation(education: Education): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  const requiredFields = ['institution', 'degree', 'field', 'startDate', 'endDate'];
  requiredFields.forEach(field => {
    const value = education[field as keyof Education];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  // Validate date range
  if (education.startDate && education.endDate) {
    if (!validateDateRange(education.startDate, education.endDate)) {
      errors.push('End date must be after start date');
    }
  }
  
  // Validate GPA if provided
  if (education.gpa) {
    const gpa = parseFloat(education.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      errors.push('GPA must be a number between 0.0 and 4.0');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validates complete resume data
 */
export function validateResumeData(resumeData: any): ValidationResult {
  const errors: string[] = [];
  
  // Validate personal info
  if (!resumeData.personalInfo) {
    errors.push('Personal information is required');
  } else {
    const personalInfoResult = validatePersonalInfo(resumeData.personalInfo);
    errors.push(...personalInfoResult.errors);
  }
  
  // Validate experience (at least one required)
  if (!resumeData.experience || resumeData.experience.length === 0) {
    errors.push('At least one work experience is required');
  } else {
    resumeData.experience.forEach((exp: Experience, index: number) => {
      const expResult = validateExperience(exp);
      expResult.errors.forEach(error => {
        errors.push(`Experience ${index + 1}: ${error}`);
      });
    });
  }
  
  // Validate education (at least one required)
  if (!resumeData.education || resumeData.education.length === 0) {
    errors.push('At least one education entry is required');
  } else {
    resumeData.education.forEach((edu: Education, index: number) => {
      const eduResult = validateEducation(edu);
      eduResult.errors.forEach(error => {
        errors.push(`Education ${index + 1}: ${error}`);
      });
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}