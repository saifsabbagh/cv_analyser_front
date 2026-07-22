export function groupByWeek<T>(items: T[], dateField: keyof T): { semaine: string; count: number }[] {
  const weekMap = new Map<string, number>();

  for (const item of items) {
    const dateValue = item[dateField];
    if (!dateValue) continue;

    const date = new Date(dateValue as string);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const key = `S${week}-${year}`;

    weekMap.set(key, (weekMap.get(key) || 0) + 1);
  }

  return Array.from(weekMap.entries())
    .map(([semaine, count]) => ({ semaine, count }))
    .sort((a, b) => {
      const [aWeek, aYear] = a.semaine.replace('S', '').split('-').map(Number);
      const [bWeek, bYear] = b.semaine.replace('S', '').split('-').map(Number);
      return aYear - bYear || aWeek - bWeek;
    });
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
  return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
}

export interface ScoreCategory {
  categorie: string;
  valeur: number;
}

export function categorizeScores(scores: number[]): ScoreCategory[] {
  let fort = 0;
  let moyen = 0;
  let faible = 0;

  for (const score of scores) {
    if (score >= 75) {
      fort++;
    } else if (score >= 50) {
      moyen++;
    } else {
      faible++;
    }
  }

  return [
    { categorie: 'Fort (≥75%)', valeur: fort },
    { categorie: 'Moyen (50-74%)', valeur: moyen },
    { categorie: 'Faible (<50%)', valeur: faible },
  ].filter(c => c.valeur > 0);
}
