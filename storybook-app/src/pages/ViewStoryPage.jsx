import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStorybook } from '../hooks/useStorybook';
import StorytimeMode from '../components/storybook/StorytimeMode';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

export default function ViewStoryPage() {
  const { id } = useParams();
  const { getStorybook } = useStorybook();
  const [storybook, setStorybook] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await getStorybook(id);
      if (data) {
        setStorybook(data);
        setPages(data.story_pages || []);
      }
      setLoading(false);
    };
    load();
  }, [id, getStorybook]);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!storybook || !pages.length) {
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

  return <StorytimeMode storybook={storybook} pages={pages} />;
}
