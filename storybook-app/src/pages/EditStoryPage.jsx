import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStorybook } from '../hooks/useStorybook';
import DirectorsCut from '../components/storybook/DirectorsCut';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

export default function EditStoryPage() {
  const { id } = useParams();
  const { getStorybook } = useStorybook();
  const [storybook, setStorybook] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await getStorybook(id);
      if (cancelled) return;
      if (data) {
        setStorybook(data);
        setPages(data.story_pages || []);
        setPolling(data.status === 'generating');
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [id, getStorybook]);

  // Poll for updates while generating
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      const { data } = await getStorybook(id);
      if (data) {
        setStorybook(data);
        setPages(data.story_pages || []);

        if (data.status !== 'generating') {
          setPolling(false);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, id, getStorybook]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!storybook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Storybook not found</h2>
          <Link to="/">
            <Button>Back to Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-xl font-bold text-gray-900">Storie</h1>
          </Link>
          <Link to="/">
            <Button variant="ghost">Back to Library</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {storybook.status === 'generating' ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Creating Your Story...</h2>
            <p className="text-gray-600 mb-4">This may take a minute or two</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full ${
                    pages.length >= num ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">{pages.length}/4 pages generated</p>
          </div>
        ) : (
          <DirectorsCut
            storybook={storybook}
            pages={pages}
          />
        )}
      </main>
    </div>
  );
}
