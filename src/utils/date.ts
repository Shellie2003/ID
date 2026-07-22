export type ReportPeriod = 'today' | 'week' | 'month' | 'year';

export const PERIOD_LABELS: Record<ReportPeriod, string> = {
  today: "Aujourd'hui",
  week: 'Cette semaine',
  month: 'Ce mois-ci',
  year: 'Cette année',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Monday-based start of week. */
function startOfWeek(date: Date) {
  const d = startOfDay(date);
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return d;
}

export function getPeriodRange(period: ReportPeriod, reference = new Date()) {
  switch (period) {
    case 'today': {
      const start = startOfDay(reference);
      return { start: start.getTime(), end: start.getTime() + DAY_MS };
    }
    case 'week': {
      const start = startOfWeek(reference);
      return { start: start.getTime(), end: start.getTime() + 7 * DAY_MS };
    }
    case 'month': {
      const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
      const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
      return { start: start.getTime(), end: end.getTime() };
    }
    case 'year': {
      const start = new Date(reference.getFullYear(), 0, 1);
      const end = new Date(reference.getFullYear() + 1, 0, 1);
      return { start: start.getTime(), end: end.getTime() };
    }
  }
}

/** Previous period of equal length, used for trend comparisons. */
export function getPreviousPeriodRange(period: ReportPeriod, reference = new Date()) {
  const { start, end } = getPeriodRange(period, reference);
  const length = end - start;
  return { start: start - length, end: start };
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export type TrendBucket = { label: string; start: number; end: number };

/** Buckets a period into chart-friendly slices: days for a week, weeks for a month, months for a year. */
export function getTrendBuckets(period: ReportPeriod, reference = new Date()): TrendBucket[] {
  const { start, end } = getPeriodRange(period, reference);

  if (period === 'week') {
    return Array.from({ length: 7 }, (_, i) => ({
      label: WEEKDAY_LABELS[i],
      start: start + i * DAY_MS,
      end: start + (i + 1) * DAY_MS,
    }));
  }

  if (period === 'month') {
    const buckets: TrendBucket[] = [];
    let cursor = start;
    let week = 1;
    while (cursor < end) {
      const bucketEnd = Math.min(cursor + 7 * DAY_MS, end);
      buckets.push({ label: `S${week}`, start: cursor, end: bucketEnd });
      cursor = bucketEnd;
      week += 1;
    }
    return buckets;
  }

  if (period === 'year') {
    const year = new Date(start).getFullYear();
    return Array.from({ length: 12 }, (_, i) => ({
      label: MONTH_LABELS[i],
      start: new Date(year, i, 1).getTime(),
      end: new Date(year, i + 1, 1).getTime(),
    }));
  }

  // 'today' — 4-hour buckets
  return Array.from({ length: 6 }, (_, i) => ({
    label: `${(i * 4).toString().padStart(2, '0')}h`,
    start: start + i * 4 * 60 * 60 * 1000,
    end: start + (i + 1) * 4 * 60 * 60 * 1000,
  }));
}

/** "Aujourd'hui" / "Hier" / "12 juil." style label for a transaction list grouped by day. */
export function formatRelativeDateLabel(date: Date, now = new Date()): string {
  const today = startOfDay(now).getTime();
  const target = startOfDay(date).getTime();
  const diffDays = Math.round((today - target) / DAY_MS);

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays > 1 && diffDays < 7) return `Il y a ${diffDays} jours`;

  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()].toLowerCase()}.`;
}
