import React, { useState } from 'react';
import { Experience, ValidationResult } from '../../types/ResumeData';
import { validateExperience } from '../../utils/validation';
import { Input } from '../ui/input';
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
}

function ExperienceItem({ experience, onUpdate, onRemove, index }: ExperienceItemProps) {
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
  const handleDescriptionChange = (index: number, value: string) => {
    const newDescription = [...experience.description];
    newDescription[index] = value;
    onUpdate({ description: newDescription });
  };

  const addDescriptionBullet = () => {
    onUpdate({ description: [...experience.description, ''] });
  };

  const removeDescriptionBullet = (index: number) => {
    const newDescription = experience.description.filter((_, i) => i !== index);
    onUpdate({ description: newDescription });
  };

  return (
    <div className="space-y-4 pt-4 border-b pb-8 border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Experience {index + 1}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-slate-700 hover:text-red-700 w-auto font-normal text"
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
            placeholder="Company name"
            className="bg-white border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Position</label>
          <Input
            value={experience.position}
            onChange={(e) => handleFieldChange('position', e.target.value)}
            onBlur={() => handleFieldBlur('position')}
            placeholder="Job title"
            className="bg-white border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Location</label>
          <Input
            value={experience.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            onBlur={() => handleFieldBlur('location')}
            placeholder="City, State"
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
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor={`current-${experience.id}`} className="text-sm font-medium text-slate-700">Current position</Label>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Start date</label>
          <Input
            type="date"
            value={experience.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            onBlur={() => handleFieldBlur('startDate')}
            className="bg-white border border-gray-300 "
            aria-label="Start Date"
          />
        </div>

        {!experience.current && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">End date</label>
            <Input
              type="date"
              value={experience.endDate}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              onBlur={() => handleFieldBlur('endDate')}
              min={experience.startDate}
              className="bg-white border border-gray-300"
              aria-label="End Date"
            />
          </div>
        )}
      </div>

      {/* Description Bullets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Job description</label>
        <div className="space-y-3">
          {experience.description.map((bullet, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={bullet}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  className="bg-white border border-gray-300 min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
              {experience.description.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDescriptionBullet(index)}
                  className="text-slate-400 hover:text-slate-600 mt-2 w-auto"
                  aria-label="Remove bullet point"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={addDescriptionBullet}
            className="w-auto border-slate-500 text-slate-700"
          >
            <Plus className="h-4 w-4 mr-1 " />
            Add Description
          </Button>
        </div>
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
        <h2 className="text-lg font-semibold">Work Experience</h2>
        
        <div className="space-y-4 pb-4">
          {experiences.map((experience, index) => (
            <div key={experience.id}>
              <ExperienceItem
                experience={experience}
                onUpdate={(updates) => onUpdate(experience.id, updates)}
                onRemove={() => onRemove(experience.id)}
                index={index}
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
        
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      <Separator className="my-8" />
    </div>
  );
}