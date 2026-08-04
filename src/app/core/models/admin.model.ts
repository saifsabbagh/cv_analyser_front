export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface UserFilters {
  search?: string;
  role?: 'ADMIN' | 'CANDIDATE';
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  users: {
    total: number;
    admins: number;
    candidates: number;
    inactive: number;
  };
  jobs: {
    total: number;
    active: number;
  };
  cvs: {
    total: number;
    byStatus: {
      PENDING: number;
      EXTRACTED: number;
      FAILED: number;
    };
  };
  matches: {
    total: number;
    avgScore: number;
  };
}

export interface MatchFilters {
  jobId?: number;
  minScore?: number;
  maxScore?: number;
  page?: number;
  limit?: number;
}

export interface AdminMatchResult {
  id: number;
  score: number;
  scorePercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string;
  createdAt: string;
  cv: {
    filename: string;
  };
  job: {
    title: string;
  };
  user: {
    name: string;
    email: string;
  };
}

// Le backend renvoie la liste sous la clé `results` (et non `matches`),
// comme MatchListResponse côté candidat.
export interface PaginatedMatches {
  results: AdminMatchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TopCandidate {
  rank: number;
  userId: number;
  userName: string;
  userEmail: string;
  cvId: number;
  cvFilename: string;
  score: number;
  scorePercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  createdAt: string;
}
