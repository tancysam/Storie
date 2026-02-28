import { useState, useCallback } from 'react';
import { generateFullStorybook, generateImage, generateActText } from '../utils/generation';
import { useStorybook } from './useStorybook';

export function useGeneration() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const { createStoryPages, updateStorybookStatus, updateStoryPage } = useStorybook();

  const generateStory = useCallback(async (storybookId, userId, prompt, childName, visualStyle) => {
    setGenerating(true);
    setError(null);
    setProgress('Starting generation...');

    try {
      const result = await generateFullStorybook(
        storybookId,
        userId,
        prompt,
        childName,
        visualStyle,
        {
          onProgress: setProgress,
          onPageComplete: (page) => {
            setProgress(`Page ${page.page_number} complete!`);
          },
          onError: (err) => {
            console.error('Generation error:', err);
          },
        }
      );

      // Save pages to database
      setProgress('Saving your storybook...');
      await createStoryPages(result.pages);

      // Update storybook status
      await updateStorybookStatus(storybookId, 'ready');

      setProgress('Complete!');
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      await updateStorybookStatus(storybookId, 'error');
      return { success: false, error: err.message };
    } finally {
      setGenerating(false);
    }
  }, [createStoryPages, updateStorybookStatus]);

  const regeneratePageImage = useCallback(async (pageId, sceneDescription, visualStyle) => {
    try {
      const imageUrl = await generateImage(sceneDescription, visualStyle);
      await updateStoryPage(pageId, { image_url: imageUrl });
      return { success: true, imageUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [updateStoryPage]);

  const regeneratePageText = useCallback(async (pageId, prompt, childName, actTitle, actNumber) => {
    try {
      const text = await generateActText(prompt, childName, actTitle, actNumber);
      await updateStoryPage(pageId, { text_content: text });
      return { success: true, text };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [updateStoryPage]);

  return {
    generating,
    progress,
    error,
    generateStory,
    regeneratePageImage,
    regeneratePageText,
  };
}
