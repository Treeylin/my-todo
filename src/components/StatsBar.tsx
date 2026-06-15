import { useTodo } from '../context/TodoContext';

export default function StatsBar() {
  const { tasks } = useTodo();
  const all = tasks.length;
  const done = tasks.filter(t => t.done).length;

  return (
    <div className="stats-bar">
      <span>📌 全部 <strong>{all}</strong></span>
      <span>✅ 已完成 <strong>{done}</strong></span>
      <span>⏳ 待处理 <strong>{all - done}</strong></span>
    </div>
  );
}
