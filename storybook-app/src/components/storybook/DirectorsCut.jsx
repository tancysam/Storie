import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useStorybook } from '../../hooks/useStorybook';
import { generateImage, generateActText } from '../../utils/generation';

export default function DirectorsCut({
  storybook,
  pages: initialPages,
}) {
  const navigate = useNavigate();
  const { updateStoryPage } = useStorybook();
  const [pages, setPages] = useState(initialPages || []);
  const [isRegenerating, setIsRegenerating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPages) {
      setPages([...initialPages].sort((a, b) => a.page_number - b.page_number));
    }
  }, [initialPages]);

  const handleRegenerateImage = async (pageId) => {
    setIsRegenerating(`image-${pageId}`);
    setError('');

    try {
      const page = pages.find(p => p.id === pageId);
      
      // Generate new image using Wavespeed
      const imageUrl = await generateImage(page.image_prompt, storybook.visual_style);
      
      // Update database
      await updateStoryPage(pageId, { image_url: imageUrl });
      
      // Update local state
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, image_url: imageUrl } : p
      ));
    } catch (err) {
      setError(`Failed to regenerate image: ${err.message}`);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleRegenerateText = async (pageId) => {
    setIsRegenerating(`text-${pageId}`);
    setError('');

    try {
      const page = pages.find(p => p.id === pageId);
      
      // Generate new text using OpenAI
      const text = await generateActText(
        storybook.original_prompt,
        storybook.child_name,
        page.act_title,
        page.page_number
      );
      
      // Update database
      await updateStoryPage(pageId, { text_content: text });
      
      // Update local state
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, text_content: text } : p
      ));
    } catch (err) {
      setError(`Failed to regenerate text: ${err.message}`);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handlePublish = () => {
    navigate(`/story/${storybook.id}`);
  };

  if (!pages.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your storybook...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{storybook.title}</h1>
          <p className="text-gray-600">for {storybook.child_name}</p>
        </div>
        <Button onClick={handlePublish} size="lg">
          Publish Storybook
        </Button>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onDismiss={() => setError('')} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page) => (
          <PageEditor
            key={page.id}
            page={page}
            onRegenerateImage={handleRegenerateImage}
            onRegenerateText={handleRegenerateText}
            isRegenerating={isRegenerating}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Click "New Image" or "New Text" on any page to regenerate that content
        </p>
        <Button onClick={handlePublish} size="lg">
          Publish Storybook
        </Button>
      </div>
    </div>
  );
}
