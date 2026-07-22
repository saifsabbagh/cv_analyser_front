export interface CV {
  id: number;
  userId: number;
  filename: string;
  filepath: string;
  status: 'PENDING' | 'EXTRACTED' | 'FAILED';
  createdAt: string;
  _count: {
    cvSkills: number;
  };
}

export interface Skill {
  id: number;
  name: string;
  createdAt: string;
}

export interface CVDetail extends CV {
  rawText?: string;
  skills: Skill[];
}

export interface CVListResponse {
  cvs: CV[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
