import { ACT_TITLES, SAFETY_PROMPT_PREFIX, NO_TEXT_INSTRUCTION } from './constants';
import insforge from '../lib/insforgeClient';

async function openaiChat(messages, temperature = 0.7) {
  const { data, error } = await insforge.functions.invoke('openai-chat', {
    body: { messages, temperature },
  });

  if (error) throw new Error(`OpenAI function error: ${error.message}`);
  return data;
}

async function wavespeedGenerate(prompt) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data, error } = await insforge.functions.invoke('wavespeed-image', {
      body: { prompt },
    });

    if (error) {
      console.error(`Wavespeed attempt ${attempt + 1} failed:`, error);
      if (attempt === maxRetries - 1) throw new Error(`Wavespeed function error: ${error.message}`);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }

    if (!data?.data?.outputs || !Array.isArray(data.data.outputs)) {
      console.error('Invalid Wavespeed response structure:', data);
      throw new Error('Invalid response from image function');
    }

    return data;
  }
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

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

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

    if (!base64Image) throw new Error('No image generated');

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

export async function generateImage(sceneDescription, visualStyle) {
  const prompt = `${SAFETY_PROMPT_PREFIX}, ${visualStyle} style, ${sceneDescription}. ${NO_TEXT_INSTRUCTION}`;

  try {
    console.log('Generating image with prompt:', prompt.substring(0, 100) + '...');
    const result = await wavespeedGenerate(prompt);
    const base64Image = result.data.outputs[0];

    if (!base64Image) throw new Error('No image generated');

    const raw = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    const blob = new Blob([buffer], { type: 'image/png' });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('story-images')
      .uploadAuto(blob);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image to storage');
    }

    console.log('Image uploaded successfully:', uploadData.url);
    return uploadData.url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export async function generateFullStorybook(storybookId, userId, prompt, childName, visualStyle, callbacks = {}) {
  const { onProgress, onPageComplete, onError } = callbacks;

  try {
    onProgress?.('Crafting your story...');
    console.log('Starting story generation for:', childName, 'with prompt:', prompt);

    const structure = await generateStoryStructure(prompt, childName);
    console.log('Story structure generated:', structure.title, 'with', structure.acts?.length, 'acts');

    if (!structure.acts || structure.acts.length === 0) {
      throw new Error('No story acts were generated');
    }

    onProgress?.('Creating magical illustrations...');

    const pages = [];
    for (const act of structure.acts) {
      try {
        onProgress?.(`Creating page ${act.actNumber} of 4...`);
        console.log(`Generating page ${act.actNumber}: ${act.actTitle}`);

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
        console.log(`Page ${act.actNumber} completed successfully`);
      } catch (err) {
        console.error(`Failed to generate page ${act.actNumber}:`, err);
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

    console.log('Storybook generation complete:', pages.length, 'pages');
    return {
      title: structure.title,
      pages,
    };
  } catch (err) {
    console.error('Story generation failed:', err);
    onError?.(err.message);
    throw err;
  }
}
