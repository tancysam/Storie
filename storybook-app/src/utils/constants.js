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
  'Illustration for children\'s storybook, soft lighting, friendly and gentle, no scary elements, toddler-safe, warm colors. CRITICAL: NO TEXT, NO WORDS, NO LETTERS, NO WRITING, NO TITLES, NO LABELS, NO CAPTIONS, NO SPEECH BUBBLES, NO SIGNS WITH TEXT. The image must contain ONLY visual artwork with absolutely no readable text of any kind.';

export const NO_TEXT_INSTRUCTION = 
  'IMPORTANT: This image MUST NOT contain any text, words, letters, numbers, writing, titles, labels, captions, speech bubbles, or signs with text. Generate ONLY pure visual artwork with no readable elements.';

export const getImagePrompt = (style, sceneDescription) => {
  return `${SAFETY_PROMPT_PREFIX}, ${style} style, ${sceneDescription}`;
};
