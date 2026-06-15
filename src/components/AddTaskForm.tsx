import { useState, useRef } from 'react';
import { useTodo } from '../context/TodoContext';
import { CATEGORIES, PRIORITIES } from '../constants';
import type { Priority } from '../types';

export default function AddTaskForm() {
  const { dispatch } = useTodo();
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<Priority>('med');
  const [category, setCategory] = useState('工作');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: trimmed,
        due: due || null,
        priority,
        category,
      },
    });
    setTitle('');
    inputRef.current?.focus();
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} autoComplete="off">
      <input
        ref={inputRef}
        name="title"
        type="text"
        placeholder="添加新任务…"
        maxLength={120}
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        name="date"
        type="date"
        title="截止日期"
        value={due}
        onChange={e => setDue(e.target.value)}
      />
      <select
        name="priority"
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
      >
        {PRIORITIES.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <select
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {CATEGORIES.map(c => (
          <option key={c} value={c}>{getCatIcon(c)} {c}</option>
        ))}
      </select>
      <button type="submit">＋ 添加</button>
    </form>
  );
}

function getCatIcon(cat: string): string {
  const map: Record<string, string> = {
    '工作': '💼',
    '个人': '👤',
    '学习': '📚',
    '生活': '🏠',
    '其他': '📌',
  };
  return map[cat] || '📌';
}
