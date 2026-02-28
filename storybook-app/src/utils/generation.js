import { ACT_TITLES, SAFETY_PROMPT_PREFIX, NO_TEXT_INSTRUCTION } from './constants';
import insforge from '../lib/insforgeClient';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const WAVESPEED_API_KEY = import.meta.env.VITE_WAVESPEED_API_KEY;

async function openaiChat(messages, temperature = 0.7) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  return res.json();
}

export async function generateStoryStructure(prompt, childName) {
  const systemPrompt = `You are a children's storybook writer. Create a 4-act story structure based on the given idea. The story is for a toddler named ${childName}.

Output ONLY valid JSON with this exact structure:
{
  "title": "Story title",
  "acts": [
    {
      "actNumber": 1,
      "actTitle": "Introduction",
      "sceneDescription": "Brief visual scene description for image generation. CRITICAL: Describe ONLY visual elements like characters, colors, objects, setting, mood, and composition. NEVER mention text, words, letters, titles, speech bubbles, or anything readable. The image must be purely visual artwork.",
      "textContent": "The story text for this page (50-80 words, simple language, gentle rhythm)"
    },
    ... (4 acts total)
  ]
}

Act titles must be: Introduction, The Journey, The Gentle Conflict, The Sleepy Resolution.
Keep language simple, warm, and suitable for bedtime stories. Include ${childName} in the story naturally.`;

  try {
    const completion = await openaiChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create a bedtime story for a child named ${childName} based on: ${prompt}. Remember, the child's name is ${childName} — use it throughout the story.` },
    ]);

    const content = completion.choices[0].message.content;

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating story structure:', error);
    throw new Error('Failed to generate story structure');
  }
}

export async function generateActText(prompt, childName, actTitle, actNumber) {
  try {
    const completion = await openaiChat([
      {
        role: 'system',
        content: `You are a children's storybook writer. Write a single paragraph (50-80 words) for act ${actNumber} (${actTitle}) of a bedtime story for ${childName}. Use simple, warm language with gentle rhythm. Do not include act titles or labels, just the story text.`,
      },
      {
        role: 'user',
        content: `Story premise: ${prompt}\n\nWrite the ${actTitle} act.`,
      },
    ]);

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating act text:', error);
    throw new Error('Failed to generate text');
  }
}

export async function regenerateImageWithFeedback(originalPrompt, visualStyle, feedback) {
  const enhancedPrompt = `${SAFETY_PROMPT_PREFIX}, ${visualStyle} style, ${originalPrompt}. ${NO_TEXT_INSTRUCTION} User feedback for improvement: ${feedback}`;

  try {
    const result = await wavespeedGenerate(enhancedPrompt);
    const base64Image = result.data.outputs[0];

    if (!base64Image) {
      throw new Error('No image generated');
    }

    const raw = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    const blob = new Blob([buffer], { type: 'image/png' });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('story-images')
      .uploadAuto(blob);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    return uploadData.url;
  } catch (error) {
    console.error('Error regenerating image:', error);
    throw new Error('Failed to regenerate image');
  }
}

export async function regenerateTextWithFeedback(originalPrompt, childName, actTitle, actNumber, currentText, feedback) {
  try {
    const completion = await openaiChat([
      {
        role: 'system',
        content: `You are a children's storybook writer. Rewrite the following paragraph for act ${actNumber} (${actTitle}) of a bedtime story for ${childName}. Use simple, warm language with gentle rhythm. Apply the user's feedback to improve it. Do not include act titles or labels.`,
      },
      {
        role: 'user',
        content: `Story premise: ${originalPrompt}\n\nCurrent text: ${currentText}\n\nUser feedback: ${feedback}\n\nRewrite the text addressing the feedback.`,
      },
    ]);

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error regenerating text:', error);
    throw new Error('Failed to regenerate text');
  }
}

async function wavespeedGenerate(prompt) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(
      'https://api.wavespeed.ai/api/v3/wavespeed-ai/z-image/turbo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${WAVESPEED_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          resolution: '1k',
          output_format: 'png',
          enable_sync_mode: true,
          enable_base64_output: true,
        }),
      },
    );

    if (res.status === 429 && attempt < maxRetries - 1) {
      // Rate limited — wait before retrying
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Wavespeed API error: ${res.status} ${err}`);
    }

    return res.json();
  }
}

export async function generateImage(sceneDescription, visualStyle) {
  const prompt = `${SAFETY_PROMPT_PREFIX}, ${visualStyle} style, ${sceneDescription}. ${NO_TEXT_INSTRUCTION}`;

  try {
    const result = await wavespeedGenerate(prompt);
    const base64Image = result.data.outputs[0];

    if (!base64Image) {
      throw new Error('No image generated');
    }

    // Strip data URI prefix if present
    const raw = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 to Blob
    const buffer = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    const blob = new Blob([buffer], { type: 'image/png' });

    // Upload to InsForge storage
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('story-images')
      .uploadAuto(blob);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    return uploadData.url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

export async function generateFullStorybook(storybookId, userId, prompt, childName, visualStyle, callbacks = {}) {
  const { onProgress, onPageComplete, onError } = callbacks;

  try {
    // Step 1: Generate story structure
    onProgress?.('Crafting your story...');
    const structure = await generateStoryStructure(prompt, childName);

    // Step 2: Generate pages sequentially to avoid rate limits
    onProgress?.('Creating magical illustrations...');

    const pages = [];
    for (const act of structure.acts) {
      try {
        const imageUrl = await generateImage(act.sceneDescription, visualStyle);

        const page = {
          storybook_id: storybookId,
          page_number: act.actNumber,
          act_title: act.actTitle,
          text_content: act.textContent,
          image_url: imageUrl,
          image_prompt: act.sceneDescription,
        };

        onPageComplete?.(page);
        pages.push(page);
      } catch (err) {
        onError?.(`Failed to generate page ${act.actNumber}: ${err.message}`);
        pages.push({
          storybook_id: storybookId,
          page_number: act.actNumber,
          act_title: act.actTitle,
          text_content: act.textContent,
          image_url: null,
          image_prompt: act.sceneDescription,
        });
      }
    }
    
    return {
      title: structure.title,
      pages,
    };
  } catch (err) {
    onError?.(err.message);
    throw err;
  }
}
