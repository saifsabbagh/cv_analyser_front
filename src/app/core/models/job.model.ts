export interface Job {
  id: number;
  title: string;
  description: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  /** @deprecated Le listage ne renvoie plus `_count` — préférer matchedCandidatesCount */
  _count?: {
    jobSkills: number;
    matches: number;
  };
  matchedCandidatesCount?: number;
  /** Enrichi côté front pour l'affichage des chips (non renvoyé par GET /jobs) */
  skills?: JobSkill[];
}

export interface JobSkill {
  id: number;
  name: string;
}

export interface JobPayload {
  title: string;
  description: string;
  location?: string | null;
  isActive?: boolean;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
