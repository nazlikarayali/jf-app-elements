import { useState, useMemo } from 'react';
import './FormSubmissions.scss';

// ============================================
// Types
// ============================================
export type SubmissionStatus = 'Completed' | 'Pending' | 'Rejected';
export type FilterOption = 'All' | SubmissionStatus;
export type SortField = 'camperName' | 'submittedDate' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface Submission {
  id: number;
  camperName: string;
  formType: 'Registration' | 'Health Record' | 'Immunization' | 'Photo Release' | 'Transportation';
  submittedDate: string;
  status: SubmissionStatus;
}

export interface FormSubmissionsProps {
  selected?: boolean;
}

// ============================================
// Sample Data
// ============================================
const SUBMISSIONS: Submission[] = [
  { id: 1, camperName: 'Emma Johnson', formType: 'Registration', submittedDate: 'Mar 12', status: 'Completed' },
  { id: 2, camperName: 'Emma Johnson', formType: 'Health Record', submittedDate: 'Mar 14', status: 'Completed' },
  { id: 3, camperName: 'Liam Carter', formType: 'Registration', submittedDate: 'Mar 15', status: 'Completed' },
  { id: 4, camperName: 'Sofia Martinez', formType: 'Registration', submittedDate: 'Mar 18', status: 'Pending' },
  { id: 5, camperName: 'Noah Kim', formType: 'Immunization', submittedDate: 'Mar 20', status: 'Completed' },
  { id: 6, camperName: 'Olivia Chen', formType: 'Photo Release', submittedDate: 'Mar 21', status: 'Rejected' },
  { id: 7, camperName: 'Aiden Park', formType: 'Transportation', submittedDate: 'Mar 22', status: 'Pending' },
  { id: 8, camperName: 'Sofia Martinez', formType: 'Health Record', submittedDate: 'Mar 23', status: 'Pending' },
];

const FILTER_OPTIONS: FilterOption[] = ['All', 'Completed', 'Pending', 'Rejected'];

const DATE_ORDER: Record<string, number> = {
  'Mar 12': 312, 'Mar 14': 314, 'Mar 15': 315, 'Mar 18': 318,
  'Mar 20': 320, 'Mar 21': 321, 'Mar 22': 322, 'Mar 23': 323,
};

// ============================================
// FormSubmissions Component
// ============================================
export function FormSubmissions({ selected = false }: FormSubmissionsProps) {
  const [filter, setFilter] = useState<FilterOption>('All');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('submittedDate');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...SUBMISSIONS];

    // Filter by status
    if (filter !== 'All') {
      result = result.filter(s => s.status === filter);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(s => s.camperName.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'camperName') {
        cmp = a.camperName.localeCompare(b.camperName);
      } else if (sortField === 'submittedDate') {
        cmp = (DATE_ORDER[a.submittedDate] || 0) - (DATE_ORDER[b.submittedDate] || 0);
      } else if (sortField === 'status') {
        const order: Record<SubmissionStatus, number> = { Completed: 0, Pending: 1, Rejected: 2 };
        cmp = order[a.status] - order[b.status];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [filter, search, sortField, sortDir]);

  const classes = ['jf-formsub', selected && 'jf-formsub--selected'].filter(Boolean).join(' ');

  const statusClass = (status: SubmissionStatus) => {
    const map: Record<SubmissionStatus, string> = {
      Completed: 'jf-formsub__badge--completed',
      Pending: 'jf-formsub__badge--pending',
      Rejected: 'jf-formsub__badge--rejected',
    };
    return `jf-formsub__badge ${map[status]}`;
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <span className="jf-formsub__sort-arrow">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-formsub__header">
        <div className="jf-formsub__header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="jf-formsub__header-text">
          <h3 className="jf-formsub__title">Form Submissions</h3>
          <p className="jf-formsub__subtitle">Track and manage camper form submissions</p>
        </div>
      </div>

      {/* Search */}
      <div className="jf-formsub__search-wrap">
        <svg className="jf-formsub__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="jf-formsub__search"
          type="text"
          placeholder="Search by camper name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Chips */}
      <div className="jf-formsub__filters">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt}
            type="button"
            className={`jf-formsub__chip ${filter === opt ? 'jf-formsub__chip--active' : ''}`}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="jf-formsub__table-wrap">
        <table className="jf-formsub__table">
          <thead>
            <tr>
              <th
                className="jf-formsub__th jf-formsub__th--sortable"
                onClick={() => handleSort('camperName')}
              >
                Name {sortIndicator('camperName')}
              </th>
              <th className="jf-formsub__th">Form Type</th>
              <th
                className="jf-formsub__th jf-formsub__th--sortable"
                onClick={() => handleSort('submittedDate')}
              >
                Date {sortIndicator('submittedDate')}
              </th>
              <th
                className="jf-formsub__th jf-formsub__th--sortable"
                onClick={() => handleSort('status')}
              >
                Status {sortIndicator('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map(sub => (
              <tr key={sub.id} className="jf-formsub__row">
                <td className="jf-formsub__td jf-formsub__td--name">{sub.camperName}</td>
                <td className="jf-formsub__td">{sub.formType}</td>
                <td className="jf-formsub__td">{sub.submittedDate}</td>
                <td className="jf-formsub__td">
                  <span className={statusClass(sub.status)}>{sub.status}</span>
                </td>
              </tr>
            ))}
            {filteredAndSorted.length === 0 && (
              <tr>
                <td className="jf-formsub__td jf-formsub__td--empty" colSpan={4}>
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormSubmissions;
