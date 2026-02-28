import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStorybook } from '../hooks/useStorybook';
import StorybookList from '../components/storybook/StorybookList';
import Button from '../components/common/Button';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const { getUserStorybooks, deleteStorybook } = useStorybook();
  const [storybooks, setStorybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-retro-cream">
      <header className="bg-retro-paper border-b-3 border-retro-dark">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-display">✦</span>
            <h1 className="text-2xl font-display font-bold text-retro-dark tracking-wide">Storie</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-retro-brown font-retro hidden sm:inline">
              {user?.profile?.name || user?.email}
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-retro-dark">Your Storybooks</h2>
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
