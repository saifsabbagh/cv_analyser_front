export interface Job {
  id: number;
  title: string;
  description: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    jobSkills: number;
    matches: number;
  };
}

export interface JobSkill {
  id: number;
  name: string;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
