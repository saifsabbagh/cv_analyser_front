export interface MatchResult {
  id: number;
  cvId: number;
  jobId: number;
  userId: number;
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
    location: string;
  };
}

export interface MatchListResponse {
  results: MatchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
