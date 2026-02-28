import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorybook } from '../hooks/useStorybook';
import StorybookList from '../components/storybook/StorybookList';
import Button from '../components/common/Button';

export default function HomePage() {
  const { getUserStorybooks, deleteStorybook } = useStorybook();
  const [storybooks, setStorybooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorybooks = async () => {
      const { data } = await getUserStorybooks();
      setStorybooks(data || []);
      setLoading(false);
    };
    loadStorybooks();
  }, [getUserStorybooks]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this storybook?')) {
      await deleteStorybook(id);
      setStorybooks(prev => prev.filter(book => book.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-xl font-bold text-gray-900">Storie</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Storybooks</h2>
          <Link to="/create">
            <Button>Create New Story</Button>
          </Link>
        </div>

        <StorybookList
          storybooks={storybooks}
          loading={loading}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
