import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Task, TodoAction } from '../types';
import { STORAGE_KEY } from '../constants';
import { uid } from '../utils';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function todoReducer(state: Task[], action: TodoAction): Task[] {
  switch (action.type) {
    case 'LOAD_TASKS':
      return action.tasks;

    case 'ADD_TASK': {
      const task: Task = {
        id: uid(),
        title: action.payload.title,
        due: action.payload.due,
        priority: action.payload.priority,
        category: action.payload.category,
        done: false,
        createdAt: new Date().toISOString(),
      };
      return [task, ...state];
    }

    case 'TOGGLE_DONE':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);

    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.id);

    case 'EDIT_TASK':
      return state.map(t => t.id === action.id ? { ...t, title: action.title } : t);

    case 'CLEAR_DONE':
      return state.filter(t => !t.done);

    case 'REORDER_TASKS': {
      const next = [...state];
      const [moved] = next.splice(action.fromIndex, 1);
      next.splice(action.toIndex, 0, moved);
      return next;
    }

    default:
      return state;
  }
}

/* ── Toast context (co-located, small enough) ── */

interface ToastCtx {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

/* ── Todo context ── */

interface TodoCtx {
  tasks: Task[];
  dispatch: React.Dispatch<TodoAction>;
  showToast: (msg: string) => void;
}

const TodoContext = createContext<TodoCtx | null>(null);

export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodo must be used within TodoProvider');
  return ctx;
}

/* ── Provider ── */

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(todoReducer, [], loadTasks);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Toast state
  const [toastMsg, setToastMsg] = useReducer(
    (_: string | null, msg: string | null) => msg,
    null
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1800);
  };

  return (
    <TodoContext.Provider value={{ tasks, dispatch, showToast }}>
      <ToastContext.Provider value={{ showToast }}>
        {children}
        {toastMsg && <Toast message={toastMsg} />}
      </ToastContext.Provider>
    </TodoContext.Provider>
  );
}

/* ── Toast component (inline, tightly coupled) ── */

function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#21262d',
        color: '#fff',
        padding: '10px 24px',
        borderRadius: 24,
        fontSize: '.88rem',
        fontWeight: 600,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 99,
        pointerEvents: 'none',
        animation: 'toastIn .3s cubic-bezier(.175,.885,.32,1.275)',
      }}
    >
      {message}
    </div>
  );
}
