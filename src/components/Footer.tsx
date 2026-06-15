import { useTodo } from '../context/TodoContext';

export default function Footer() {
  const { tasks, dispatch, showToast } = useTodo();
  const doneCount = tasks.filter(t => t.done).length;
  if (doneCount === 0) return null;

  function handleClear() {
    if (!confirm('确定清除所有已完成的任务吗？')) return;
    dispatch({ type: 'CLEAR_DONE' });
    showToast('🗑 已完成任务已清除');
  }

  return (
    <div className="footer">
      <button className="clear-btn" onClick={handleClear}>
        🗑 清除已完成
      </button>
    </div>
  );
}
