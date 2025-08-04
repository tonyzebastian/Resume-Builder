import React, { useState } from 'react';
import { Skills } from '../../types/ResumeData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skills;
  onUpdate: (skills: Skills) => void;
  className?: string;
}

export function SkillsSection({ skills, onUpdate, className }: SkillsSectionProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>({});

  // Initialize categories if they don't exist
  const categories = skills.categories || {};

  // Initialize textarea values from existing skills
  React.useEffect(() => {
    const initialValues: Record<string, string> = {};
    Object.entries(categories).forEach(([categoryName, skillsList]) => {
      if (!textareaValues[categoryName]) {
        initialValues[categoryName] = skillsList.join('\n');
      }
    });
    if (Object.keys(initialValues).length > 0) {
      setTextareaValues(prev => ({ ...prev, ...initialValues }));
    }
  }, [categories]);

  // Handle adding a new skill category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const updatedSkills = {
      ...skills,
      categories: {
        ...categories,
        [newCategoryName]: [],
      },
    };

    onUpdate(updatedSkills);
    setNewCategoryName('');
  };

  // Handle removing a skill category
  const handleRemoveCategory = (categoryName: string) => {
    const { [categoryName]: removed, ...remainingCategories } = categories;
    
    // Clean up textarea state
    setTextareaValues(prev => {
      const { [categoryName]: removedValue, ...remaining } = prev;
      return remaining;
    });
    
    const updatedSkills = {
      ...skills,
      categories: remainingCategories,
    };

    onUpdate(updatedSkills);
  };

  // Handle updating skills within a category
  const handleUpdateCategorySkills = (categoryName: string, skillsText: string) => {
    // Update textarea state immediately for smooth UX
    setTextareaValues(prev => ({ ...prev, [categoryName]: skillsText }));

    // Extract non-empty skills for storage (but allow newlines in textarea)
    const skillsList = skillsText
      .split('\n')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const updatedSkills = {
      ...skills,
      categories: {
        ...categories,
        [categoryName]: skillsList,
      },
    };

    onUpdate(updatedSkills);
  };

  return (
    <div className={className}>
      <div className="border-t pt-12 border-slate-300 pb-4">
        <div className='flex flex-row items-center gap-2 pb-4'>
          <h2 className="text-lg font-semibold ">Skills</h2>
          <p className="text-base font-light text-slate-800">Enter each skill on a new line</p>
        </div>
        <div className="space-y-6">
          {/* Existing skill categories */}
          {Object.entries(categories).map(([categoryName, skillsList], index) => (
            <div key={categoryName} className='space-y-1'>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">{categoryName}</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCategory(categoryName)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={textareaValues[categoryName] || skillsList.join('\n')}
                  onChange={(e) => handleUpdateCategorySkills(categoryName, e.target.value)}
                  placeholder="Enter skills, one per line"
                  className="bg-white border border-gray-300 min-h-[100px] resize-y"
                  rows={4}
                />
              </div>
              {index < Object.entries(categories).length - 1 && <Separator className="my-6" />}
            </div>
          ))}

          {/* Add new category */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium text-slate-700">Add New Category</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Programming Languages, Design Tools, etc."
                className="bg-white border border-gray-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="shrink-0 w-auto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Show default categories if no custom categories exist */}
          {Object.keys(categories).length === 0 && (
            <div className="space-y-2 text-sm text-muted-foreground border rounded-md p-4 bg-muted/50">
              <p>No skill categories yet. Add your first category above!</p>
              <p>Examples: Competencies, Code, Design, Languages, etc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}