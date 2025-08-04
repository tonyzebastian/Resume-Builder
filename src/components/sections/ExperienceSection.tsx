import React, { useState } from 'react';
import { Experience, ValidationResult } from '../../types/ResumeData';
import { validateExperience } from '../../utils/validation';
import { Input } from '../ui/input';
import { MonthYearInput } from '../ui/month-year-input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

interface ExperienceItemProps {
  experience: Experience;
  onUpdate: (updates: Partial<Experience>) => void;
  onRemove: () => void;
  index: number;
  totalExperiences: number;
}

function ExperienceItem({ experience, onUpdate, onRemove, index, totalExperiences }: ExperienceItemProps) {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Handle field changes
  const handleFieldChange = (field: keyof Experience, value: any) => {
    const updates = { [field]: value };
    
    // Special handling for current position
    if (field === 'current' && value === true) {
      updates.endDate = '';
    }
    
    onUpdate(updates);
  };

  // Handle field blur
  const handleFieldBlur = (field: keyof Experience) => {
    setTouchedFields(prev => new Set([...prev, field]));
  };

  // Handle description changes
  const handleDescriptionChange = (value: string) => {
    onUpdate({ description: value });
  };

  return (
    <div className="group space-y-4 pt-4 pb-4 ">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium tracking-wider text-slate-700">EXPERIENCE {totalExperiences - index}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-800 hover:text-red-600 w-auto font-normal text"
          aria-label="Remove experience"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Company</label>
          <Input
            value={experience.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            onBlur={() => handleFieldBlur('company')}
            helperText="Company name"
            className="bg-white border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Position</label>
          <Input
            value={experience.position}
            onChange={(e) => handleFieldChange('position', e.target.value)}
            onBlur={() => handleFieldBlur('position')}
            helperText="Job title"
            className="bg-white border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Location</label>
          <Input
            value={experience.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            onBlur={() => handleFieldBlur('location')}
            helperText="City, State"
            className="bg-white border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3 pt-10">
            <Switch
              id={`current-${experience.id}`}
              checked={experience.current}
              onCheckedChange={(checked) => handleFieldChange('current', checked)}
              aria-label="Current position"
            />
            <Label htmlFor={`current-${experience.id}`} className="text-sm font-medium text-slate-700">Current position</Label>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Start date</label>
          <MonthYearInput
            value={experience.startDate}
            onChange={(value) => handleFieldChange('startDate', value)}
            onBlur={() => handleFieldBlur('startDate')}
            className="bg-white border border-gray-300"
            aria-label="Start Date"
            helperText="MM/YYYY"
          />
        </div>

        {!experience.current && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">End date</label>
            <MonthYearInput
              value={experience.endDate}
              onChange={(value) => handleFieldChange('endDate', value)}
              onBlur={() => handleFieldBlur('endDate')}
              className="bg-white border border-gray-300"
              aria-label="End Date"
              helperText="MM/YYYY"
            />
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Job description</label>
        <Textarea
          value={typeof experience.description === 'string' 
            ? experience.description 
            : Array.isArray(experience.description) 
              ? (experience.description as string[]).join('\n\n') 
              : ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          helperText="Describe your responsibilities and achievements. Use line breaks to separate different points."
          className="bg-white border border-gray-300 min-h-[120px] resize-y"
          rows={5}
        />
      </div>
    </div>
  );
}

export function ExperienceSection({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
  className,
}: ExperienceSectionProps) {

  return (
    <div className={className}>
      <div className="pt-12">
        <div className='flex justify-between items-center pb-2 border-b border-slate-200 mb-2'>
          <h2 className="text-lg font-semibold">Work Experience</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={onAdd}
            className="w-auto hover:text-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>

        <div className="space-y-4 pb-4">
          {experiences.map((experience, index) => (
            <div key={experience.id}>
              <ExperienceItem
                experience={experience}
                onUpdate={(updates) => onUpdate(experience.id, updates)}
                onRemove={() => onRemove(experience.id)}
                index={index}
                totalExperiences={experiences.length}
              />
              {index < experiences.length - 1 && <Separator className="my-0" />}
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No work experience added yet. Add your professional experience to showcase your career journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}