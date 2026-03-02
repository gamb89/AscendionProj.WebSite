import { useState } from 'react';
import type { Story } from './types/story';
import { fetchBestStories } from './services/storiesApi';
import { StoryTable } from './components/StoryTable';
import styles from './App.module.css';

function App() {
  const [count, setCount] = useState<number>(10);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const handleSearch = async () => {
    if (count < 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBestStories(count);
      setStories(data);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoArea}>
            <div className={styles.logoMark}>S</div>
            <span className={styles.logoText}>Ascendion</span>
          </div>
          <span className={styles.headerTagline}>Hacker News Best Stories</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Best Stories</h1>
          <p className={styles.subtitle}>
            Explore the top stories from Hacker News, ranked by community score.
          </p>
        </section>

        <div className={styles.searchCard}>
          <label htmlFor="count-input" className={styles.label}>
            Number of stories to display
          </label>
          <div className={styles.searchRow}>
            <input
              id="count-input"
              type="number"
              min={0}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              className={styles.input}
              placeholder="Enter quantity (0 = all)"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={styles.button}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                'Search'
              )}
            </button>
          </div>
          <p className={styles.hint}>Enter <strong>0</strong> to retrieve all available best stories.</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className={styles.loadingArea}>
            <div className={styles.loadingSpinner} />
            <p>Fetching stories from Hacker News...</p>
          </div>
        )}

        {fetched && !loading && !error && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} found
              </span>
              <span className={styles.resultsHint}>Click column headers to sort</span>
            </div>
            {stories.length === 0 ? (
              <div className={styles.empty}>No stories found. Try a different count.</div>
            ) : (
              <StoryTable stories={stories} />
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
       
      </footer>
    </div>
  );
}

export default App;
