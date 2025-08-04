import React, { useState, useEffect } from 'react';
import { PersonalInfo, ValidationResult } from '../../types/ResumeData';
import { validateEmail } from '../../utils/validation';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
// Icons removed for cleaner UI

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (updates: PersonalInfo) => void;
  onValidation?: (result: ValidationResult) => void;
  className?: string;
}

interface FieldErrors {
  name?: string;
  title?: string;
  subTitle?: string;
  email?: string;
  website?: string;
}

export function PersonalInfoForm({
  data,
  onUpdate,
  onValidation,
  className,
}: PersonalInfoFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Validate form and update parent component
  const validateForm = (formData: PersonalInfo) => {
    const errors: FieldErrors = {};
    let isValid = true;
    const errorMessages: string[] = [];

    // Validate required fields
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
      errorMessages.push('Name is required');
      isValid = false;
    }

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
      errorMessages.push('Title is required');
      isValid = false;
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
      errorMessages.push('Email is required');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
      errorMessages.push('Invalid email format');
      isValid = false;
    }

    // Validate website if provided
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
      } catch {
        errors.website = 'Invalid website URL';
        errorMessages.push('Invalid website URL');
        isValid = false;
      }
    }

    const result: ValidationResult = {
      isValid,
      errors: errorMessages,
      warnings: [],
    };

    setFieldErrors(errors);
    onValidation?.(result);
    return result;
  };

  // Handle field changes
  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);

    // Real-time validation
    if (touchedFields.has(field)) {
      setTimeout(() => validateForm(updatedData), 100);
    }
  };

  // Handle field blur (mark as touched)
  const handleFieldBlur = (field: keyof PersonalInfo) => {
    setTouchedFields(prev => new Set([...prev, field]));
    validateForm(data);
  };

  // Initial validation
  useEffect(() => {
    validateForm(data);
  }, [data]);

  return (
    <div className={className}>
      <div className="space-y-6 pb-2">
        <div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <Input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  helperText="Enter your full name"
                  className="bg-white border border-gray-300"
                  aria-label="Full Name"
                />
                {touchedFields.has('name') && fieldErrors.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Professional title</label>
                <Input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  onBlur={() => handleFieldBlur('title')}
                  helperText="e.g., Senior Product Designer"
                  className="bg-white border border-gray-300"
                  aria-label="Professional Title"
                />
                {touchedFields.has('title') && fieldErrors.title && (
                  <p className="text-sm text-red-600">{fieldErrors.title}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sub profession title (optional)</label>
              <Input
                type="text"
                value={data.subTitle || ''}
                onChange={(e) => handleFieldChange('subTitle', e.target.value)}
                onBlur={() => handleFieldBlur('subTitle')}
                helperText="e.g., Design Systems & UX Foundation"
                className="bg-white border border-gray-300"
                aria-label="Sub Profession Title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <Input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  helperText="your.email@example.com"
                  className="bg-white border border-gray-300"
                  aria-label="Email Address"
                />
                {touchedFields.has('email') && fieldErrors.email && (
                  <p className="text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Portfolio link or website</label>
                <Input
                  type="url"
                  value={data.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  onBlur={() => handleFieldBlur('website')}
                  helperText="https://yourwebsite.com"
                  className="bg-white border border-gray-300"
                  aria-label="Website"
                />
                {touchedFields.has('website') && fieldErrors.website && (
                  <p className="text-sm text-red-600">{fieldErrors.website}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}