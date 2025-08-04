import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ResumeData } from '../types/ResumeData';
// import { format, parseISO } from 'date-fns';

// ============================================
// FONT WEIGHT CONFIGURATION - Easy to modify!
// ============================================
// Available weights: 'regular', 'medium', 'semibold'
// regular = Helvetica (normal weight)
// medium = Helvetica Bold 
// semibold = Helvetica Bold

const FONT_WEIGHTS = {
  // Hero Section
  name: 'medium',                    // Tony Sebastian
  title: 'medium',                  // Senior Product Designer
  subTitle: 'regular',               // Design Systems & UX Foundation
  website: 'regular',                // tonyzeb.design
  email: 'regular',                  // email address
  
  // Experience Section
  sectionHeaderExperience: 'semibold',  // "Experience" heading
  companyName: 'medium',               // Postman, Hypersonix, etc.
  position: 'regular',                  // Senior Product Designer, etc.
  location: 'regular',                  // Bengaluru, India
  dates: 'regular',                     // Jun 2022 - Present
  description: 'regular',               // Job description text
  
  // Skills Section
  sectionHeaderSkills: 'semibold',      // "Skills" heading
  skillCategoryHeader: 'medium',      // Competencies, Code, Design
  skillItems: 'regular',                // Individual skill items
  
  // Separators
  separators: 'regular',                // All "/" characters
} as const;

type FontWeight = keyof typeof FONT_WEIGHTS;

interface PDFGeneratorOptions {
  pageSize: {
    width: number;
    height: number;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  fonts: {
    name: { size: number; lineHeight: number };
    title: { size: number; lineHeight: number };
    sectionHeader: { size: number; lineHeight: number };
    body: { size: number; lineHeight: number };
    small: { size: number; lineHeight: number };
    skillCategory: { size: number; lineHeight: number };
  };
  colors: {
    slate950: [number, number, number];
    slate800: [number, number, number];
    slate700: [number, number, number];
  };
  layout: {
    leftColumnX: number;
    rightColumnX: number;
    leftColumnWidth: number;
    rightColumnWidth: number;
  };
}

const DEFAULT_OPTIONS: PDFGeneratorOptions = {
  pageSize: {
    width: 794, // Match preview container width (794px)
    height: 1123, // Match preview container height (1123px) 
  },
  margins: {
    top: 72, // 16 * 4 to match top-16 from preview
    bottom: 64,
    left: 64, // 16 * 4 to match left-16 from preview
    right: 64,
  },
  fonts: {
    name: { size: 24, lineHeight: 28 },
    title: { size: 14, lineHeight: 28 },
    sectionHeader: { size: 14, lineHeight: 28 },
    body: { size: 11, lineHeight: 21 },
    small: { size: 12, lineHeight: 18 }, // Match preview leading-[18px]
    skillCategory: { size: 11, lineHeight: 21 },
  },
  colors: {
    slate950: [0.0078, 0.0235, 0.0863], // #020617 converted to RGB 0-1
    slate800: [0.1176, 0.1608, 0.2314], // #1e293b converted to RGB 0-1  
    slate700: [0.2, 0.2549, 0.3333], // #334155 converted to RGB 0-1
  },
  layout: {
    leftColumnX: 64, // Match left-16 from preview (64px)
    rightColumnX: 64 + 459 + 44, // left margin + left column width + gap-11 (567px total)
    leftColumnWidth: 459, // Match w-[459px] from preview
    rightColumnWidth: 169, // Match w-[169px] from preview
  },
};

export class PDFGenerator {
  private doc: PDFDocument | null = null;
  private currentPage: any = null;
  private leftColumnY: number = 0;
  private rightColumnY: number = 0;
  private options: PDFGeneratorOptions;
  private fonts: { [key: string]: any } = {};

  constructor(options: Partial<PDFGeneratorOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  // Helper method to get font by weight name
  private getFont(weightKey: keyof typeof FONT_WEIGHTS) {
    const weight = FONT_WEIGHTS[weightKey];
    return this.fonts[weight] || this.fonts.regular;
  }

  private sanitizeText(text: string): string {
    const replacements: { [key: string]: string } = {
      '→': '->',
      '←': '<-',
      '↑': '^',
      '↓': 'v',
      '•': '*',
      '–': '-',
      '—': '--',
      '\u201C': '"',
      '\u201D': '"',
      '\u2018': "'",
      '\u2019': "'",
      '\u2026': '...',
    };

    let sanitized = text;
    for (const [unicode, ascii] of Object.entries(replacements)) {
      sanitized = sanitized.replace(new RegExp(unicode, 'g'), ascii);
    }
    sanitized = sanitized.replace(/[^\x00-\xFF]/g, '?');
    return sanitized;
  }

  async generateResumePDF(resumeData: ResumeData): Promise<Uint8Array> {
    try {
      await this.initializeDocument();
      await this.loadFonts();
      
      this.startNewPage();
      this.initializeColumns();
      
      // Hero Section (Name, Title, Links)
      await this.addHeroSection(resumeData.personalInfo);
      
      // Bottom Section (Experience and Skills)
      await this.addBottomSection(resumeData.experience, resumeData.skills);

      return await this.doc!.save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('cannot encode')) {
          throw new Error('PDF generation failed due to unsupported characters. Please check your resume content for special characters and try again.');
        } else if (error.message.includes('font')) {
          throw new Error('PDF generation failed due to font loading issues. Please try again.');
        }
      }
      
      throw new Error('Failed to generate PDF. Please check your resume content and try again.');
    }
  }

  private async initializeDocument() {
    this.doc = await PDFDocument.create();
  }

  private async loadFonts() {
    console.log('🔄 Loading Helvetica fonts for PDF...');
    
    try {
      // Use Helvetica fonts directly (no custom font loading)
      this.fonts.regular = await this.doc!.embedFont(StandardFonts.Helvetica);
      this.fonts.medium = await this.doc!.embedFont(StandardFonts.HelveticaBold);
      this.fonts.semibold = await this.doc!.embedFont(StandardFonts.HelveticaBold);
      
      console.log('✅ Helvetica fonts loaded successfully');
      console.log('Font objects verification:', {
        regular: !!this.fonts.regular,
        medium: !!this.fonts.medium,
        semibold: !!this.fonts.semibold
      });
      
    } catch (error) {
      console.error('❌ Helvetica font loading failed:', error);
      throw new Error('Failed to load Helvetica fonts for PDF generation');
    }
  }

  private startNewPage() {
    this.currentPage = this.doc!.addPage([
      this.options.pageSize.width, 
      this.options.pageSize.height
    ]);
  }

  private initializeColumns() {
    this.leftColumnY = this.options.pageSize.height - this.options.margins.top;
    this.rightColumnY = this.options.pageSize.height - this.options.margins.top;
  }

  private formatDateRange(startDate: string, endDate: string, current?: boolean): string {
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
  }

  private async addHeroSection(personalInfo: ResumeData['personalInfo']) {
    // Hero sections are center-aligned (items-center in preview)
    // Calculate vertical alignment offset to center the links with the hero content
    const heroContentHeight = this.options.fonts.name.lineHeight + this.options.fonts.title.lineHeight + 4; // name + title + gap-1
    const linksHeight = this.options.fonts.small.lineHeight * 2; // 2 links
    const alignmentOffset = (heroContentHeight - linksHeight) / 2;
    
    // Store original right column position for center alignment
    const originalRightY = this.rightColumnY;
    
    // Hero Left Column - Name and Title
    // Name
    this.currentPage.drawText(this.sanitizeText(personalInfo.name), {
      x: this.options.layout.leftColumnX,
      y: this.leftColumnY,
      size: this.options.fonts.name.size,
      font: this.getFont('name'),
      color: rgb(...this.options.colors.slate950),
    });
    this.leftColumnY -= this.options.fonts.name.lineHeight + 4; // gap-1

    // Title line with subTitle - match preview layout exactly
    let currentX = this.options.layout.leftColumnX;
    
    // Position title
    this.currentPage.drawText(this.sanitizeText(personalInfo.title), {
      x: currentX,
      y: this.leftColumnY,
      size: this.options.fonts.title.size,
      font: this.getFont('title'),
      color: rgb(...this.options.colors.slate950),
    });
    
    const titleWidth = this.getTextWidth(personalInfo.title, this.options.fonts.title.size, FONT_WEIGHTS.title);
    currentX += titleWidth;
    
    // Only show separator and subTitle if subTitle exists
    const subTitle = personalInfo.subTitle;
    if (subTitle && subTitle.trim()) {
      currentX += 4; // 4px spacing before slash
      
      // Separator "/" with precise positioning
      this.currentPage.drawText('/', {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.getFont('separators'),
        color: rgb(...this.options.colors.slate950),
      });
      
      // Calculate slash width and add 4px spacing after
      const slashWidth = this.getTextWidth('/', this.options.fonts.title.size, FONT_WEIGHTS.separators);
      currentX += slashWidth + 4; // slash width + 4px spacing after
      
      // Sub title
      this.currentPage.drawText(this.sanitizeText(subTitle), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.getFont('subTitle'),
        color: rgb(...this.options.colors.slate800),
      });
    }

    // Hero Right Column - Links (Website and Email) - Center aligned with hero content
    const website = personalInfo.website || 'tonyzeb.design';
    
    // Apply center alignment offset to right column
    const alignedRightY = originalRightY - alignmentOffset;
    
    this.currentPage.drawText(this.sanitizeText(website), {
      x: this.options.layout.rightColumnX,
      y: alignedRightY,
      size: this.options.fonts.small.size,
      font: this.getFont('website'),
      color: rgb(...this.options.colors.slate800),
    });
    
    this.currentPage.drawText(this.sanitizeText(personalInfo.email), {
      x: this.options.layout.rightColumnX,
      y: alignedRightY - this.options.fonts.small.lineHeight - 4, // Increased spacing by 4px
      size: this.options.fonts.small.size,
      font: this.getFont('email'),
      color: rgb(...this.options.colors.slate800),
    });
    
    // Move both columns down for the next section (gap-8)
    // Use the lowest point from either column
    const finalLeftY = this.leftColumnY - this.options.fonts.title.lineHeight;
    const finalRightY = alignedRightY - (this.options.fonts.small.lineHeight * 2) - 4; // Account for increased spacing
    const lowestY = Math.min(finalLeftY, finalRightY);
    
    this.leftColumnY = lowestY - 32; // gap-8
    this.rightColumnY = lowestY - 32; // gap-8
  }

  private async addBottomSection(experiences: ResumeData['experience'], skills: ResumeData['skills']) {
    // Left Column - Experience
    await this.addExperience(experiences);
    
    // Right Column - Skills  
    await this.addSkills(skills);
  }

  private async addExperience(experiences: ResumeData['experience']) {
    if (experiences.length === 0) return;

    // Section header
    this.currentPage.drawText(this.sanitizeText('Experience'), {
      x: this.options.layout.leftColumnX,
      y: this.leftColumnY,
      size: this.options.fonts.sectionHeader.size,
      font: this.getFont('sectionHeaderExperience'),
      color: rgb(...this.options.colors.slate950),
    });
    this.leftColumnY -= this.options.fonts.sectionHeader.lineHeight + 8; // gap-2

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      
      // Company/Position line
      let currentX = this.options.layout.leftColumnX;
      
      this.currentPage.drawText(this.sanitizeText(exp.company), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.getFont('companyName'),
        color: rgb(...this.options.colors.slate950),
      });
      
      const companyWidth = this.getTextWidth(exp.company, this.options.fonts.title.size, FONT_WEIGHTS.companyName);
      currentX += companyWidth + 4; // 4px spacing before slash
      
      this.currentPage.drawText('/', {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.getFont('separators'),
        color: rgb(...this.options.colors.slate950),
      });
      
      // Calculate slash width and add 4px spacing after
      const slashWidth = this.getTextWidth('/', this.options.fonts.title.size, FONT_WEIGHTS.separators);
      currentX += slashWidth + 4; // slash width + 4px spacing after
      
      this.currentPage.drawText(this.sanitizeText(exp.position), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.getFont('position'),
        color: rgb(...this.options.colors.slate800),
      });
      
      this.leftColumnY -= this.options.fonts.title.lineHeight - 4; // Use negative margin mb-[-4px]

      // Location/Date line
      currentX = this.options.layout.leftColumnX;
      
      this.currentPage.drawText(this.sanitizeText(exp.location), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.getFont('location'),
        color: rgb(...this.options.colors.slate700),
      });
      
      const locationWidth = this.getTextWidth(exp.location, this.options.fonts.small.size, FONT_WEIGHTS.location);
      currentX += locationWidth + 4; // 4px spacing before slash
      
      this.currentPage.drawText('/', {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.getFont('separators'),
        color: rgb(...this.options.colors.slate700),
      });
      
      // Calculate slash width and add 4px spacing after
      const locationSlashWidth = this.getTextWidth('/', this.options.fonts.small.size, FONT_WEIGHTS.separators);
      currentX += locationSlashWidth + 4; // slash width + 4px spacing after
      
      const dateRange = this.formatDateRange(exp.startDate, exp.endDate, exp.current);
      this.currentPage.drawText(this.sanitizeText(dateRange), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.getFont('dates'),
        color: rgb(...this.options.colors.slate700),
      });
      
      this.leftColumnY -= this.options.fonts.title.lineHeight - 4; // Use title line height (28px) with negative margin mb-[-4px]

      // Description - handle both string and array formats for backward compatibility
      const description = typeof exp.description === 'string' 
        ? exp.description 
        : Array.isArray(exp.description) 
          ? (exp.description as string[]).join('\n\n') 
          : '';
      const descriptionLines = description.split('\n').filter(line => line.trim() !== '');
      for (let j = 0; j < descriptionLines.length; j++) {
        const wrappedText = this.wrapText(
          this.sanitizeText(descriptionLines[j]), 
          this.options.layout.leftColumnWidth
        );
        
        for (const line of wrappedText) {
          this.currentPage.drawText(line, {
            x: this.options.layout.leftColumnX,
            y: this.leftColumnY,
            size: this.options.fonts.body.size,
            font: this.getFont('description'),
            color: rgb(...this.options.colors.slate700),
          });
          this.leftColumnY -= this.options.fonts.body.lineHeight;
        }
        
        if (j < descriptionLines.length - 1) {
          this.leftColumnY -= 8; // gap-2 between paragraphs
        }
      }

      if (i < experiences.length - 1) {
        this.leftColumnY -= 32; // gap-8 between experiences
      }
    }
  }


  private async addSkills(skills: ResumeData['skills']) {
    // Skills section header
    this.currentPage.drawText(this.sanitizeText('Skills'), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.sectionHeader.size,
      font: this.getFont('sectionHeaderSkills'),
      color: rgb(...this.options.colors.slate950),
    });
    this.rightColumnY -= this.options.fonts.sectionHeader.lineHeight + 8; // gap-2

    // Use new categories structure if available
    if (skills.categories && Object.keys(skills.categories).length > 0) {
      for (const [categoryName, skillList] of Object.entries(skills.categories)) {
        if (skillList.length > 0) {
          this.currentPage.drawText(this.sanitizeText(categoryName), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.getFont('skillCategoryHeader'),
            color: rgb(...this.options.colors.slate700),
          });
          this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

          for (let i = 0; i < skillList.length; i++) {
            this.currentPage.drawText(this.sanitizeText(skillList[i]), {
              x: this.options.layout.rightColumnX,
              y: this.rightColumnY,
              size: this.options.fonts.skillCategory.size,
              font: this.getFont('skillItems'),
              color: rgb(...this.options.colors.slate700),
            });
            this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;
          }
          this.rightColumnY -= 32; // gap-8
        }
      }
    } else {
      // Fallback to old structure
      if (skills.competencies && skills.competencies.length > 0) {
        this.currentPage.drawText(this.sanitizeText('Competencies'), {
          x: this.options.layout.rightColumnX,
          y: this.rightColumnY,
          size: this.options.fonts.skillCategory.size,
          font: this.getFont('skillCategoryHeader'),
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.competencies.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.competencies[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.getFont('skillItems'),
            color: rgb(...this.options.colors.slate700),
          });
          this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;
        }
        this.rightColumnY -= 32; // gap-8
      }

      if (skills.technical?.code && skills.technical.code.length > 0) {
        this.currentPage.drawText(this.sanitizeText('Code'), {
          x: this.options.layout.rightColumnX,
          y: this.rightColumnY,
          size: this.options.fonts.skillCategory.size,
          font: this.getFont('skillCategoryHeader'),
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.technical.code.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.technical.code[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.getFont('skillItems'),
            color: rgb(...this.options.colors.slate700),
          });
          this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;
        }
        this.rightColumnY -= 32; // gap-8
      }

      if (skills.technical?.design && skills.technical.design.length > 0) {
        this.currentPage.drawText(this.sanitizeText('Design'), {
          x: this.options.layout.rightColumnX,
          y: this.rightColumnY,
          size: this.options.fonts.skillCategory.size,
          font: this.getFont('skillCategoryHeader'),
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.technical.design.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.technical.design[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.getFont('skillItems'),
            color: rgb(...this.options.colors.slate700),
          });
          this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;
        }
      }
    }
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = this.getTextWidth(testLine, this.options.fonts.body.size, 'regular');
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private getTextWidth(text: string, fontSize: number, weight: 'regular' | 'medium' | 'semibold' = 'regular'): number {
    // Use actual font metrics from pdf-lib for more accurate width calculation
    try {
      const font = this.fonts[weight] || this.fonts.regular;
      if (font && font.widthOfTextAtSize) {
        return font.widthOfTextAtSize(text, fontSize);
      }
    } catch (error) {
      console.warn('Font width calculation failed, using fallback:', error);
    }
    
    // Fallback to rough approximation if font metrics unavailable
    const avgCharWidth = weight === 'regular' ? 0.56 : 0.58;
    return text.length * fontSize * avgCharWidth;
  }
}

// Export utility function for easy use
export async function generateResumePDF(resumeData: ResumeData): Promise<Uint8Array> {
  const generator = new PDFGenerator();
  return await generator.generateResumePDF(resumeData);
}

// Download utility
export function downloadPDF(pdfBytes: Uint8Array, filename: string = 'resume.pdf') {
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}