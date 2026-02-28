export const VISUAL_STYLES = [
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'claymation', label: 'Claymation' },
  { value: 'pastel', label: 'Pastel Illustration' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'digital_art', label: 'Digital Art' },
];

export const ACT_TITLES = [
  'Introduction',
  'The Journey',
  'The Gentle Conflict',
  'The Sleepy Resolution',
];

export const SAFETY_PROMPT_PREFIX = 
  'Illustration for children\'s storybook, soft lighting, friendly and gentle, no scary elements, toddler-safe, warm colors';

export const getImagePrompt = (style, sceneDescription) => {
  return `${SAFETY_PROMPT_PREFIX}, ${style} style, ${sceneDescription}`;
};
