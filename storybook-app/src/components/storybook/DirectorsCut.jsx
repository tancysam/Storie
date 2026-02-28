import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditor from './PageEditor';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useStorybook } from '../../hooks/useStorybook';
import { regenerateImageWithFeedback, regenerateTextWithFeedback } from '../../utils/generation';

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

  const handleRequestEdit = async (pageId, issueType, feedback) => {
    setIsRegenerating(`${issueType}-${pageId}`);
    setError('');

    try {
      const page = pages.find(p => p.id === pageId);
      
      if (issueType === 'image') {
        // Regenerate image with feedback
        const imageUrl = await regenerateImageWithFeedback(
          page.image_prompt,
          storybook.visual_style,
          feedback
        );
        
        await updateStoryPage(pageId, { image_url: imageUrl });
        
        setPages(prev => prev.map(p => 
          p.id === pageId ? { ...p, image_url: imageUrl } : p
        ));
      } else if (issueType === 'text') {
        // Regenerate text with feedback
        const text = await regenerateTextWithFeedback(
          storybook.original_prompt,
          storybook.child_name,
          page.act_title,
          page.page_number,
          page.text_content,
          feedback
        );
        
        await updateStoryPage(pageId, { text_content: text });
        
        setPages(prev => prev.map(p => 
          p.id === pageId ? { ...p, text_content: text } : p
        ));
      }
    } catch (err) {
      setError(`Failed to regenerate ${issueType}: ${err.message}`);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handlePublish = () => {
    navigate(`/story/${storybook.id}`);
  };

  if (!pages.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-retro-paper border-3 border-retro-dark shadow-retro">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-retro-brown font-retro">Loading your storybook...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 bg-retro-paper border-3 border-retro-dark shadow-retro p-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-retro-dark">{storybook.title}</h1>
          <p className="text-retro-brown font-retro">for {storybook.child_name}</p>
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
            onRequestEdit={handleRequestEdit}
            isRegenerating={isRegenerating}
          />
        ))}
      </div>

      <div className="mt-8 text-center bg-retro-paper border-3 border-retro-dark shadow-retro p-6">
        <p className="text-sm text-retro-brown font-retro mb-4">
          Click "Request Edit" on any page to make changes
        </p>
        <Button onClick={handlePublish} size="lg">
          Publish Storybook
        </Button>
      </div>
    </div>
  );
}
