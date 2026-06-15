export type Priority = 'low' | 'med' | 'high';

export type FilterStatus = 'all' | 'active' | 'done' | 'overdue';

export interface Task {
  id: string;
  title: string;
  due: string | null;
  priority: Priority;
  category: string;
  done: boolean;
  createdAt: string;
}

export type TodoAction =
  | { type: 'LOAD_TASKS'; tasks: Task[] }
  | { type: 'ADD_TASK'; payload: { title: string; due: string | null; priority: Priority; category: string } }
  | { type: 'TOGGLE_DONE'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'EDIT_TASK'; id: string; title: string }
  | { type: 'CLEAR_DONE' }
  | { type: 'REORDER_TASKS'; fromIndex: number; toIndex: number };
