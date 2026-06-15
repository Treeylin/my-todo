export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(due: string | null): boolean {
  return !!due && due < todayStr();
}

export function isToday(due: string | null): boolean {
  return due === todayStr();
}

export function fmtDate(d: string | null): string {
  if (!d) return '';
  const [, m, day] = d.split('-');
  return `${Number(m)}/${Number(day)}`;
}

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
