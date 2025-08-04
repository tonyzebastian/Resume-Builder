import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ResumeData } from '../types/ResumeData';
// import { format, parseISO } from 'date-fns';

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
    top: 64, // 16 * 4 to match top-16 from preview
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
    try {
      // Load IBM Plex Sans fonts
      const regularResponse = await fetch('/fonts/IBMPlexSans-Regular.ttf');
      const mediumResponse = await fetch('/fonts/IBMPlexSans-Medium.ttf');
      
      if (!regularResponse.ok || !mediumResponse.ok) {
        throw new Error('Failed to load IBM Plex Sans fonts');
      }
      
      const regularFontBytes = await regularResponse.arrayBuffer();
      const mediumFontBytes = await mediumResponse.arrayBuffer();
      
      this.fonts.regular = await this.doc!.embedFont(regularFontBytes);
      this.fonts.bold = await this.doc!.embedFont(mediumFontBytes); // Use Medium (500) for bold text
    } catch (error) {
      console.warn('Failed to load IBM Plex Sans fonts, falling back to Helvetica:', error);
      // Fallback to standard fonts
      this.fonts.regular = await this.doc!.embedFont(StandardFonts.Helvetica);
      this.fonts.bold = await this.doc!.embedFont(StandardFonts.HelveticaBold);
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
    // Hero Left Column - Name and Title
    // Name
    this.currentPage.drawText(this.sanitizeText(personalInfo.name), {
      x: this.options.layout.leftColumnX,
      y: this.leftColumnY,
      size: this.options.fonts.name.size,
      font: this.fonts.bold,
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
      font: this.fonts.bold,
      color: rgb(...this.options.colors.slate950),
    });
    
    const titleWidth = this.getTextWidth(personalInfo.title, this.options.fonts.title.size, true);
    currentX += titleWidth + 8; // gap-2 (8px)
    
    // Separator "/"
    this.currentPage.drawText('/', {
      x: currentX,
      y: this.leftColumnY,
      size: this.options.fonts.title.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate950),
    });
    
    currentX += this.getTextWidth('/', this.options.fonts.title.size, false) + 8; // actual "/" width + gap-2
    
    // Sub title
    const subTitle = personalInfo.subTitle || 'Design Systems & UX Foundation';
    this.currentPage.drawText(this.sanitizeText(subTitle), {
      x: currentX,
      y: this.leftColumnY,
      size: this.options.fonts.title.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate800),
    });

    // Hero Right Column - Links (Website and Email)
    const website = personalInfo.website || 'tonyzeb.design';
    
    this.currentPage.drawText(this.sanitizeText(website), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.small.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate800),
    });
    this.rightColumnY -= this.options.fonts.small.lineHeight; // Use consistent line height

    this.currentPage.drawText(this.sanitizeText(personalInfo.email), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.small.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate800),
    });
    
    // Move both columns down for the next section (gap-8)
    this.leftColumnY -= this.options.fonts.title.lineHeight + 32; // gap-8
    this.rightColumnY -= this.options.fonts.small.lineHeight + 32; // gap-8
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
      font: this.fonts.bold,
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
        font: this.fonts.bold,
        color: rgb(...this.options.colors.slate950),
      });
      
      const companyWidth = this.getTextWidth(exp.company, this.options.fonts.title.size, true);
      currentX += companyWidth + 8; // gap-2 (8px)
      
      this.currentPage.drawText('/', {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.fonts.regular,
        color: rgb(...this.options.colors.slate950),
      });
      
      currentX += this.getTextWidth('/', this.options.fonts.title.size, false) + 8; // actual "/" width + gap-2
      
      this.currentPage.drawText(this.sanitizeText(exp.position), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.title.size,
        font: this.fonts.regular,
        color: rgb(...this.options.colors.slate800),
      });
      
      this.leftColumnY -= this.options.fonts.title.lineHeight;

      // Location/Date line
      currentX = this.options.layout.leftColumnX;
      
      this.currentPage.drawText(this.sanitizeText(exp.location), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.fonts.regular,
        color: rgb(...this.options.colors.slate700),
      });
      
      const locationWidth = this.getTextWidth(exp.location, this.options.fonts.small.size, false);
      currentX += locationWidth + 8; // gap-2 (8px)
      
      this.currentPage.drawText('/', {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.fonts.regular,
        color: rgb(...this.options.colors.slate700),
      });
      
      currentX += this.getTextWidth('/', this.options.fonts.small.size, false) + 8; // actual "/" width + gap-2
      
      const dateRange = this.formatDateRange(exp.startDate, exp.endDate, exp.current);
      this.currentPage.drawText(this.sanitizeText(dateRange), {
        x: currentX,
        y: this.leftColumnY,
        size: this.options.fonts.small.size,
        font: this.fonts.regular,
        color: rgb(...this.options.colors.slate700),
      });
      
      this.leftColumnY -= this.options.fonts.small.lineHeight + 4; // gap-1

      // Description
      for (let j = 0; j < exp.description.length; j++) {
        const wrappedText = this.wrapText(
          this.sanitizeText(exp.description[j]), 
          this.options.layout.leftColumnWidth
        );
        
        for (const line of wrappedText) {
          this.currentPage.drawText(line, {
            x: this.options.layout.leftColumnX,
            y: this.leftColumnY,
            size: this.options.fonts.body.size,
            font: this.fonts.regular,
            color: rgb(...this.options.colors.slate700),
          });
          this.leftColumnY -= this.options.fonts.body.lineHeight;
        }
        
        if (j < exp.description.length - 1) {
          this.leftColumnY -= 8; // gap-2 between paragraphs
        }
      }

      if (i < experiences.length - 1) {
        this.leftColumnY -= 32; // gap-8 between experiences
      }
    }
  }

  private async addLinks(personalInfo: ResumeData['personalInfo']) {
    // Links section - match preview layout exactly
    const website = personalInfo.website || 'tonyzeb.design';
    
    this.currentPage.drawText(this.sanitizeText(website), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.small.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate800),
    });
    this.rightColumnY -= this.options.fonts.small.lineHeight; // Use consistent line height

    this.currentPage.drawText(this.sanitizeText(personalInfo.email), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.small.size,
      font: this.fonts.regular,
      color: rgb(...this.options.colors.slate800),
    });
    this.rightColumnY -= this.options.fonts.small.lineHeight + 32; // line height + gap-8
  }

  private async addSkills(skills: ResumeData['skills']) {
    // Skills section header
    this.currentPage.drawText(this.sanitizeText('Skills'), {
      x: this.options.layout.rightColumnX,
      y: this.rightColumnY,
      size: this.options.fonts.sectionHeader.size,
      font: this.fonts.bold,
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
            font: this.fonts.bold,
            color: rgb(...this.options.colors.slate700),
          });
          this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

          for (let i = 0; i < skillList.length; i++) {
            this.currentPage.drawText(this.sanitizeText(skillList[i]), {
              x: this.options.layout.rightColumnX,
              y: this.rightColumnY,
              size: this.options.fonts.skillCategory.size,
              font: this.fonts.regular,
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
          font: this.fonts.bold,
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.competencies.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.competencies[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.fonts.regular,
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
          font: this.fonts.bold,
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.technical.code.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.technical.code[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.fonts.regular,
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
          font: this.fonts.bold,
          color: rgb(...this.options.colors.slate700),
        });
        this.rightColumnY -= this.options.fonts.skillCategory.lineHeight;

        for (let i = 0; i < skills.technical.design.length; i++) {
          this.currentPage.drawText(this.sanitizeText(skills.technical.design[i]), {
            x: this.options.layout.rightColumnX,
            y: this.rightColumnY,
            size: this.options.fonts.skillCategory.size,
            font: this.fonts.regular,
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
      const testWidth = this.getTextWidth(testLine, this.options.fonts.body.size, false);
      
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

  private getTextWidth(text: string, fontSize: number, bold: boolean): number {
    // Text width calculation for IBM Plex Sans
    // IBM Plex Sans character width ratios (measured from font metrics)
    const avgCharWidth = bold ? 0.58 : 0.56; // IBM Plex Sans Medium and Regular ratios
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
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}