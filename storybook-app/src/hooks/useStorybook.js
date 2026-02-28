import { useState, useCallback } from 'react';
import insforge from '../lib/insforgeClient';

export function useStorybook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createStorybook = useCallback(async ({ title, childName, prompt, visualStyle, userId }) => {
    setLoading(true);
    setError(null);
    
    const { data, error: err } = await insforge.database
      .from('storybooks')
      .insert([{
        user_id: userId,
        title,
        child_name: childName,
        original_prompt: prompt,
        visual_style: visualStyle,
        status: 'generating',
      }])
      .select()
      .single();

    setLoading(false);
    if (err) setError(err.message);
    return { data, error: err };
  }, []);

  const getStorybook = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await insforge.database
      .from('storybooks')
      .select('*, story_pages(*)')
      .eq('id', id)
      .single();

    setLoading(false);
    if (err) setError(err.message);
    return { data, error: err };
  }, []);

  const getUserStorybooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await insforge.database
      .from('storybooks')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false);
    if (err) setError(err.message);
    return { data, error: err };
  }, []);

  const updateStorybookStatus = useCallback(async (id, status) => {
    const { data, error: err } = await insforge.database
      .from('storybooks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error: err };
  }, []);

  const createStoryPages = useCallback(async (pages) => {
    const { data, error: err } = await insforge.database
      .from('story_pages')
      .insert(pages)
      .select();

    return { data, error: err };
  }, []);

  const updateStoryPage = useCallback(async (pageId, updates) => {
    const { data, error: err } = await insforge.database
      .from('story_pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', pageId)
      .select()
      .single();

    return { data, error: err };
  }, []);

  const deleteStorybook = useCallback(async (id) => {
    const { error: err } = await insforge.database
      .from('storybooks')
      .delete()
      .eq('id', id);

    return { error: err };
  }, []);

  return {
    loading,
    error,
    createStorybook,
    getStorybook,
    getUserStorybooks,
    updateStorybookStatus,
    createStoryPages,
    updateStoryPage,
    deleteStorybook,
  };
}
