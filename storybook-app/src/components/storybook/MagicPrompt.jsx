import { useState } from 'react';
import { VISUAL_STYLES } from '../../utils/constants';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MagicPrompt({ onSubmit, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [childName, setChildName] = useState('');
  const [visualStyle, setVisualStyle] = useState('watercolor');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!prompt.trim()) {
      setError('Please enter a story idea');
      return;
    }
    if (!childName.trim()) {
      setError('Please enter the child\'s name');
      return;
    }

    onSubmit({ prompt: prompt.trim(), childName: childName.trim(), visualStyle });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Storybook</h1>
        <p className="text-gray-600">Enter a story idea and we'll create a magical bedtime story</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
            Child's Name
          </label>
          <input
            type="text"
            id="childName"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g., Emma"
            disabled={isGenerating}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Story Idea
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A brave little toaster gets lost in the forest but makes friends with a squirrel"
            rows={4}
            disabled={isGenerating}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
            Visual Style
          </label>
          <select
            id="style"
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            disabled={isGenerating}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
          >
            {VISUAL_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Creating Your Story...
            </span>
          ) : (
            'Create Story'
          )}
        </Button>
      </form>
    </div>
  );
}
