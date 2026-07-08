export interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
  skills: string[];
  createdAt: string;
}

export const MOCK_JOBS: Job[] = [
  { id: 1, title: 'Développeur Full Stack', location: 'Tunis',
    description: 'Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe.',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
    createdAt: '2025-01-10' },
  { id: 2, title: 'Data Scientist', location: 'Sfax',
    description: 'Poste de Data Scientist senior pour analyser de grands volumes de données.',
    skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning'],
    createdAt: '2025-01-08' },
  { id: 3, title: 'DevOps Engineer', location: 'Remote',
    description: 'Ingénieur DevOps pour gérer notre infrastructure cloud et automatiser les déploiements.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    createdAt: '2025-01-05' },
  { id: 4, title: 'UX Designer', location: 'Tunis',
    description: 'Designer UX/UI créatif pour concevoir des expériences utilisateur exceptionnelles.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'CSS', 'User Research'],
    createdAt: '2025-01-03' },
  { id: 5, title: 'Backend Developer', location: 'Sousse',
    description: 'Développeur backend spécialisé Node.js/Express pour nos APIs REST.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'TypeScript'],
    createdAt: '2024-12-28' },
  { id: 6, title: 'Mobile Developer', location: 'Tunis',
    description: 'Développeur mobile React Native pour nos applications iOS et Android.',
    skills: ['React Native', 'TypeScript', 'Redux', 'iOS', 'Android'],
    createdAt: '2024-12-20' }
];
