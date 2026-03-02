import { useState, useMemo } from 'react';
import type { Story } from '../types/story';
import styles from './StoryTable.module.css';

type SortField = 'score' | 'title' | 'postedBy' | 'time' | 'commentCount';
type SortDir = 'asc' | 'desc';

interface Props {
  stories: Story[];
}

export function StoryTable({ stories }: Props) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = useMemo(() => {
    return [...stories].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'score' || sortField === 'commentCount') {
        cmp = a[sortField] - b[sortField];
      } else if (sortField === 'time') {
        cmp = new Date(a.time).getTime() - new Date(b.time).getTime();
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [stories, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <span className={styles.sortIcon}>↕</span>;
    return <span className={styles.sortIconActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (stories.length === 0) return null;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} onClick={() => handleSort('score')}>
              Score <SortIcon field="score" />
            </th>
            <th className={styles.thTitle} onClick={() => handleSort('title')}>
              Title <SortIcon field="title" />
            </th>
            <th className={styles.th} onClick={() => handleSort('postedBy')}>
              Posted By <SortIcon field="postedBy" />
            </th>
            <th className={styles.th} onClick={() => handleSort('time')}>
              Date <SortIcon field="time" />
            </th>
            <th className={styles.th} onClick={() => handleSort('commentCount')}>
              Comments <SortIcon field="commentCount" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((story, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td className={styles.tdScore}>{story.score.toLocaleString()}</td>
              <td className={styles.tdTitle}>
                {story.uri ? (
                  <a href={story.uri} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {story.title}
                  </a>
                ) : (
                  story.title
                )}
              </td>
              <td className={styles.td}>{story.postedBy}</td>
              <td className={styles.td}>{formatDate(story.time)}</td>
              <td className={styles.td}>{story.commentCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
