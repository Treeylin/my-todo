import { FILTERS } from '../constants';
import type { FilterStatus } from '../types';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  filter: FilterStatus;
  onFilterChange: (val: FilterStatus) => void;
  overdueCount: number;
}

export default function Toolbar({ search, onSearchChange, filter, onFilterChange, overdueCount }: Props) {
  return (
    <div className="toolbar">
      <input
        className="search"
        type="text"
        placeholder="🔍 搜索任务…"
        autoComplete="off"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <div className="filters">
        {FILTERS.map(f => {
          let label = f.label;
          if (f.value === 'overdue' && overdueCount > 0) label += ` (${overdueCount})`;
          return (
            <button
              key={f.value}
              data-filter={f.value}
              className={filter === f.value ? 'active' : ''}
              onClick={() => onFilterChange(f.value)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
