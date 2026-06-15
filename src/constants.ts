export const STORAGE_KEY = 'my_todo_tasks';

export const CATEGORIES = ['工作', '个人', '学习', '生活', '其他'] as const;

export const PRIORITIES: { value: 'low' | 'med' | 'high'; label: string }[] = [
  { value: 'low', label: '🟢 低' },
  { value: 'med', label: '🟡 中' },
  { value: 'high', label: '🔴 高' },
];

export const FILTERS: { value: 'all' | 'active' | 'done' | 'overdue'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '待处理' },
  { value: 'done', label: '已完成' },
  { value: 'overdue', label: '已逾期' },
];

export const PRIORITY_LABEL: Record<string, string> = {
  high: '🔴 高',
  med: '🟡 中',
  low: '🟢 低',
};
