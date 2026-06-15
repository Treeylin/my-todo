import type { DragEvent } from 'react';
import type { Task } from '../types';
import { useTodo } from '../context/TodoContext';
import { PRIORITY_LABEL } from '../constants';
import { isOverdue, isToday, fmtDate, esc } from '../utils';

interface Props {
  task: Task;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, id: string) => void;
}

export default function TaskCard({ task, onDragStart, onDragEnd, onDragOver, onDrop }: Props) {
  const { dispatch, showToast } = useTodo();
  const overdue = !task.done && isOverdue(task.due);
  const today = !task.done && isToday(task.due);

  function handleToggle() {
    dispatch({ type: 'TOGGLE_DONE', id: task.id });
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TASK', id: task.id });
  }

  function handleEdit() {
    const title = prompt('编辑任务名称：', task.title);
    if (title !== null && title.trim()) {
      dispatch({ type: 'EDIT_TASK', id: task.id, title: title.trim() });
      showToast('✅ 任务已更新');
    }
  }

  let dueCls = '';
  if (overdue) dueCls = ' overdue-text';
  else if (today) dueCls = ' today';

  return (
    <div
      className={`task${task.done ? ' done' : ''}${overdue ? ' overdue' : ''}`}
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={e => onDrop(e, task.id)}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggle}
        title="标记完成"
      />
      <div className="task-body">
        <div className="task-title">{esc(task.title)}</div>
        <div className="task-meta">
          <span className={`priority ${task.priority}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          <span className="category">{esc(task.category)}</span>
          {task.due && (
            <span className={`due-date${dueCls}`}>
              📅 {fmtDate(task.due)}{overdue ? ' 逾期' : ''}{today ? ' 今天' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={handleEdit} title="编辑">✏️</button>
        <button className="danger" onClick={handleDelete} title="删除">🗑</button>
      </div>
    </div>
  );
}
