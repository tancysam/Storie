import { Link } from 'react-router-dom';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StorybookList({ storybooks, loading, onDelete }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!storybooks?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No storybooks yet</h3>
        <p className="text-gray-500 mb-6">Create your first magical storybook!</p>
        <Link to="/create">
          <Button>Create New Story</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {storybooks.map((book) => (
        <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-40 bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center relative">
            {book.preview_image_url ? (
              <img 
                src={book.preview_image_url} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">📖</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-2">for {book.child_name}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${
                book.status === 'ready' 
                  ? 'bg-green-100 text-green-700' 
                  : book.status === 'generating'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {book.status}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(book.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              {book.status === 'ready' ? (
                <>
                  <Link to={`/story/${book.id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">View</Button>
                  </Link>
                  <Link to={`/edit/${book.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">Edit</Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onDelete(book.id)}
                  >
                    Delete
                  </Button>
                </>
              ) : book.status === 'generating' ? (
                <>
                  <Link to={`/edit/${book.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">View Progress</Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onDelete(book.id)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onDelete(book.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
