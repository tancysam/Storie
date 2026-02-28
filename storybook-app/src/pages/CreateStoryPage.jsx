import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStorybook } from '../hooks/useStorybook';
import { useGeneration } from '../hooks/useGeneration';
import MagicPrompt from '../components/storybook/MagicPrompt';
import Button from '../components/common/Button';

const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000000';

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const { createStorybook } = useStorybook();
  const { generateStory } = useGeneration();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async ({ prompt, childName, visualStyle }) => {
    setIsGenerating(true);

    // Generate a title from the prompt
    const title = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;

    // Create the storybook record
    const { data: storybook, error } = await createStorybook({
      title,
      childName,
      prompt,
      visualStyle,
      userId: DUMMY_USER_ID,
    });

    if (error) {
      setIsGenerating(false);
      alert('Failed to create storybook: ' + (error.message || JSON.stringify(error)));
      return;
    }

    if (!storybook) {
      setIsGenerating(false);
      alert('Failed to create storybook: no data returned');
      return;
    }

    // Trigger generation in background, then navigate
    generateStory(storybook.id, DUMMY_USER_ID, prompt, childName, visualStyle);

    // Navigate to the edit page
    navigate(`/edit/${storybook.id}`);
  };

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

      <main className="max-w-6xl mx-auto px-4 py-12">
        <MagicPrompt onSubmit={handleSubmit} isGenerating={isGenerating} />
      </main>
    </div>
  );
}
