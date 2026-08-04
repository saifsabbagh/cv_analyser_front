// `_count` n'est renvoyé que par GET /skills (liste et détail).
// Les réponses de création/modification retournent la compétence sans compteurs.
export interface Skill {
  id: number;
  name: string;
  createdAt: string;
  _count?: {
    cvSkills: number;
    jobSkills: number;
  };
}

export interface SkillFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface SkillListResponse {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
