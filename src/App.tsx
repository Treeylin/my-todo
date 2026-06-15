import { useState, useCallback, useEffect } from 'react';
import { TodoProvider, useTodo } from './context/TodoContext';
import { isOverdue } from './utils';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import AddTaskForm from './components/AddTaskForm';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import type { FilterStatus } from './types';
import './App.css';

function TodoApp() {
  const { tasks, dispatch } = useTodo();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const overdueCount = tasks.filter(t => !t.done && isOverdue(t.due)).length;

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLButtonElement) return;
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const input = document.querySelector<HTMLInputElement>('.add-form input[name="title"]');
      input?.focus();
    }
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      const s = document.querySelector<HTMLInputElement>('.search');
      s?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Force re-render every minute to update overdue status
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="app">
      <Header />
      <StatsBar />
      <AddTaskForm />
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        overdueCount={overdueCount}
      />
      <TaskList search={search} filter={filter} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
}
