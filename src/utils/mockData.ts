import { 
  PersonalInfo, 
  Experience, 
  Skills, 
  Education, 
  Project, 
  ResumeData,
  MockDataOptions 
} from '../types/ResumeData';

// Default data based on the Figma design
export function generateDefaultPersonalInfo(): PersonalInfo {
  return {
    name: 'Tony Sebastian',
    title: 'Senior Product Designer',
    subTitle: 'Design Systems & UX Foundation',
    email: 'tonyzebastian@gmail.com',
    website: 'tonyzeb.design',
  };
}

export function generateDefaultExperience(): Experience[] {
  return [
    {
      id: '1',
      company: 'Postman',
      position: 'Senior Product Designer',
      location: 'Bengaluru, India',
      startDate: '2022-06-01',
      endDate: '2025-06-01',
      current: false,
      description: [
        'Led and scaled Postman\'s design system as part of the UX Foundation: built and governed reusable components, improved app performance , embedded with Growth for cohesive experiences, defined Postman Vision 2024, and enabled rapid high-fidelity prototyping via a code-based Postman clone.',
        'Spearheaded 0→1 API observability initiatives: drove hypothesis-led experiments (schema/collection generation, Live Collections, API Design Health), and partnered cross-functionally to validate and iterate on early product direction.'
      ],
    },
    {
      id: '2',
      company: 'Hypersonix',
      position: 'Senior Product Designer',
      location: 'Remote',
      startDate: '2020-11-01',
      endDate: '2022-05-01',
      current: false,
      description: [
        'Lead 0→1 development of a data analytics platform MVP—designing workflows for unified enterprise data ingestion, query-driven insight exploration, and rich trend visualizations through rapid ideation, prototyping, and user-informed validation.',
        'Built and owned the company\'s first design system, Sonic, while leading all product design efforts; scaled the design function by hiring and onboarding designers and drove consistency across emerging features.'
      ],
    },
    {
      id: '3',
      company: 'tonyzeb.design',
      position: 'Freelancer Designer',
      location: 'Remote',
      startDate: '2019-01-01',
      endDate: '2020-10-01',
      current: false,
      description: [
        'Engaged long-term with AVRL to design cross-platform UX and illustrative interfaces for a decision-tree automation platform with an AI-powered voice system, while also delivering designs, illustration systems, and marketing assets for clients like Chatwoot, Scribd, EPI-USE, and Bioticslabs.'
      ],
    },
    {
      id: '4',
      company: 'Infosys',
      position: 'Senior Associate Consultant',
      location: 'Mysuru, India',
      startDate: '2016-04-01',
      endDate: '2018-12-01',
      current: false,
      description: [
        'Owned analyst/product-owner efforts to re-engineer internal application workflows and improve user experience across Infosys tools.'
      ],
    },
  ];
}

export function generateDefaultSkills(): Skills {
  return {
    categories: {
      'Competencies': [
        'Product thinking',
        'System design',
        'Motion design',
        'Design to code workflows',
        'Rapid Prototyping (design & Code)'
      ],
      'Code': [
        'HTML & CSS',
        'React',
        'Github & Vercel',
        'Cursor & Claude Code',
        'Figma Make, V0 & Lovable'
      ],
      'Design': [
        'Figma',
        'Framer',
        'Midjourney',
        'ChatGPT & Claude',
        'Photoshop & Illustrator',
        'DaVinci Resolve'
      ],
    },
    // Keep old structure for backward compatibility
    competencies: [],
    technical: {
      code: [],
      design: [],
    },
  };
}

// Sample data pools for realistic mock generation
const SAMPLE_NAMES = [
  'Tony Sebastian', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim',
  'Jessica Thompson', 'Ryan Patel', 'Amanda Wilson', 'Kevin Lee', 'Maria Garcia'
];

const SAMPLE_TITLES = [
  'Senior Product Designer', 'Software Engineer', 'UX Designer', 'Frontend Developer',
  'Product Manager', 'Data Scientist', 'Full Stack Developer', 'UI/UX Designer',
  'Backend Developer', 'DevOps Engineer'
];

const SAMPLE_SUB_TITLES = [
  'Design Systems & UX Foundation', 'Frontend Architecture & Development', 'User Research & Strategy',
  'Full Stack Development', 'Product Strategy & Growth', 'Machine Learning & Analytics',
  'Cloud Infrastructure & DevOps', 'Mobile App Development', 'Backend Systems & APIs'
];

const SAMPLE_COMPANIES = [
  'Postman', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Spotify',
  'Airbnb', 'Uber', 'Tesla', 'Hypersonix', 'Infosys', 'Adobe', 'Salesforce'
];

const SAMPLE_LOCATIONS = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote',
  'Bengaluru, India', 'London, UK', 'Toronto, Canada', 'Berlin, Germany', 'Sydney, Australia'
];

/**
 * Utility function to get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Utility function to get multiple random items from array
 */
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate a random date in the past
 */
function generateRandomDate(yearsBack: number = 10): string {
  const now = new Date();
  const pastDate = new Date(now.getFullYear() - Math.random() * yearsBack, 
                           Math.floor(Math.random() * 12), 
                           Math.floor(Math.random() * 28) + 1);
  return pastDate.toISOString().split('T')[0];
}

/**
 * Generate a random date in the future relative to start date
 */
function generateEndDate(startDate: string, maxYears: number = 4): string {
  const start = new Date(startDate);
  const end = new Date(start.getFullYear() + Math.random() * maxYears + 1,
                      start.getMonth() + Math.random() * 12,
                      start.getDate());
  return end.toISOString().split('T')[0];
}

/**
 * Generate mock personal information
 */
export function generateMockPersonalInfo(options: MockDataOptions = {}): PersonalInfo {
  const name = getRandomItem(SAMPLE_NAMES);
  const title = getRandomItem(SAMPLE_TITLES);
  const subTitle = getRandomItem(SAMPLE_SUB_TITLES);
  const emailDomain = getRandomItem(['gmail.com', 'outlook.com', 'company.com', 'email.com']);
  const email = `${name.toLowerCase().replace(' ', '.')}@${emailDomain}`;
  
  const personalInfo: PersonalInfo = {
    name,
    title,
    subTitle,
    email,
    website: `${name.toLowerCase().replace(' ', '')}.design`,
  };
  
  return personalInfo;
}

/**
 * Generate mock experience entry
 */
export function generateMockExperience(options: MockDataOptions = {}): Experience {
  const id = Math.random().toString(36).substring(2, 9);
  const company = getRandomItem(SAMPLE_COMPANIES);
  const position = getRandomItem(SAMPLE_TITLES);
  const location = getRandomItem(SAMPLE_LOCATIONS);
  const startDate = generateRandomDate(8);
  
  const isCurrent = options.current ?? Math.random() < 0.3; // 30% chance of current position
  const endDate = isCurrent ? '' : generateEndDate(startDate);
  
  // Generate 1-3 description bullet points
  const descriptionCount = Math.floor(Math.random() * 3) + 1;
  const sampleDescriptions = [
    'Led cross-functional teams to deliver high-impact product features and improve user experience across multiple platforms.',
    'Collaborated with stakeholders to define product requirements and roadmap, resulting in successful product launches.',
    'Implemented scalable solutions and design systems that improved development efficiency and consistency.',
    'Mentored junior team members and established best practices for design and development workflows.',
    'Drove user research initiatives that informed design decisions and improved product metrics.',
    'Built and maintained design systems used across multiple product teams and applications.',
    'Optimized user workflows resulting in significant improvements in user engagement and satisfaction.',
    'Spearheaded 0→1 product initiatives from concept to launch, working closely with engineering and product teams.'
  ];
  
  return {
    id,
    company,
    position,
    location,
    startDate,
    endDate,
    current: isCurrent,
    description: getRandomItems(sampleDescriptions, descriptionCount),
  };
}

/**
 * Generate mock skills data with new structure
 */
export function generateMockSkills(): Skills {
  return {
    categories: {
      'Competencies': getRandomItems([
        'Product thinking', 'System design', 'Motion design', 'User research', 'Prototyping',
        'Design strategy', 'Cross-functional collaboration', 'Leadership', 'Problem solving'
      ], Math.floor(Math.random() * 4) + 3),
      'Code': getRandomItems([
        'HTML & CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python',
        'TypeScript', 'GitHub & Vercel', 'Docker', 'AWS', 'GraphQL', 'REST APIs'
      ], Math.floor(Math.random() * 4) + 3),
      'Design': getRandomItems([
        'Figma', 'Sketch', 'Adobe Creative Suite', 'Framer', 'Principle', 'InVision',
        'Photoshop & Illustrator', 'After Effects', 'Midjourney', 'ChatGPT & Claude'
      ], Math.floor(Math.random() * 4) + 3),
    },
    // Keep old structure empty for backward compatibility
    competencies: [],
    technical: {
      code: [],
      design: [],
    },
  };
}

/**
 * Generate mock education entry (not used in current design but kept for compatibility)
 */
export function generateMockEducation(options: MockDataOptions = {}): Education {
  const id = Math.random().toString(36).substring(2, 9);
  return {
    id,
    institution: 'University',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2012-09-01',
    endDate: '2016-05-01',
  };
}

/**
 * Generate complete mock resume data with default values
 */
export function generateMockResumeData(options: MockDataOptions = {}): ResumeData {
  return {
    personalInfo: generateDefaultPersonalInfo(),
    experience: generateDefaultExperience(),
    skills: generateDefaultSkills(),
    education: [], // Empty since not used in current design
    projects: [], // Empty since not used in current design
  };
}

// Export a default instance for immediate use
export const mockResumeData = generateMockResumeData();