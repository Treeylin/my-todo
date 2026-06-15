import { useState, useCallback } from 'react';
import type { DragEvent } from 'react';
import { useTodo } from '../context/TodoContext';
import { isOverdue } from '../utils';
import TaskCard from './TaskCard';
import type { FilterStatus } from '../types';

interface Props {
  search: string;
  filter: FilterStatus;
}

export default function TaskList({ search, filter }: Props) {
  const { tasks, dispatch } = useTodo();
  const [dragSrcId, setDragSrcId] = useState<string | null>(null);

  // Compute filtered / searched tasks
  let visible = tasks.filter(t => {
    switch (filter) {
      case 'active':  return !t.done;
      case 'done':    return t.done;
      case 'overdue': return !t.done && isOverdue(t.due);
      default:        return true;
    }
  });

  const q = search.trim().toLowerCase();
  if (q) visible = visible.filter(t => t.title.toLowerCase().includes(q));

  // Drag handlers
  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, id: string) => {
    setDragSrcId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback((_e: DragEvent<HTMLDivElement>) => {
    setDragSrcId(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!dragSrcId || dragSrcId === targetId) return;
    const fromIdx = tasks.findIndex(t => t.id === dragSrcId);
    const toIdx = tasks.findIndex(t => t.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    dispatch({ type: 'REORDER_TASKS', fromIndex: fromIdx, toIndex: toIdx });
  }, [dragSrcId, tasks, dispatch]);

  if (!visible.length) {
    return (
      <div className="task-list">
        <div className="empty">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <strong>暂无任务</strong><br />
          <span>用上方表单添加你的第一个任务吧</span>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {visible.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
