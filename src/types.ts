export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
  coursework?: string;
  order: number;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  logo?: string;
  period: string;
  tags: string[];
  description: string[];
  order: number;
}

export interface CaseStudy {
  context?: string;
  role?: string;
  outcome?: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  impact?: string;
  caseStudy?: CaseStudy;
  tags: string[];
  type?: string;
  group?: string;
  featured?: boolean;
  flagship?: boolean;
  status: 'in-progress' | 'improving' | 'completed';
  image?: string;
  code?: string;
  demo?: string;
  doc?: string;
  website?: string;
  note?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Credential {
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface HonorAward {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface SkillsData {
  professionalSkills: SkillCategory[];
  credentials: Credential[];
  honorsAwards: HonorAward[];
}
