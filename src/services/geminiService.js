import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta';

if (!API_KEY) {
  console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env file');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generate storyboard from pet image
 * @param {File} imageFile - Uploaded pet image file
 * @returns {Promise<Object>} Storyboard data with frames
 */
export async function generateStoryboard(imageFile, userStory = '', lang = 'en') {
  if (!API_KEY) {
    throw new Error('Gemini API is not initialized. Please check your API key.');
  }

  try {
    // Convert image file to base64
    const imageData = await fileToGenerativePart(imageFile);

    const storyContext = userStory
      ? `\n\nThe user has provided the following story/description for this pet. Use this as the narrative basis for the 9-frame storyboard. Design scenes that bring this story to life:\n"${userStory}"\n\nCreate 9 frames that tell this story visually, choosing the best camera angles, scenes, and moments to match the narrative.`
      : `\n\nThe 9 frames follow this sequence:
Frame 1: Front-facing hero portrait
Frame 2: Extreme close-up of eyes or nose
Frame 3: Environmental shot in a cozy living room
Frame 4: Interaction with a human hand
Frame 5: Top-down view looking up
Frame 6: Action shot in motion
Frame 7: Detail shot of paws, tail, or ears
Frame 8: Profile silhouette with dramatic lighting
Frame 9: Relaxed sleeping or resting`;

    const langInstruction = lang === 'ko'
      ? `\n\nIMPORTANT: Write ALL text content (petName, title, visualDescription, action, dialogue, transition) in Korean (한국어). The entire response must be in Korean.`
      : `\n\nIMPORTANT: Write ALL text content in English.`;

    const prompt = `You are a professional pet photography storyboard expert.
Analyze the provided pet image and create an engaging 9-frame pet photography storyboard.

Identify the animal's species, breed, fur markings, eye color, and distinctive features from the photo.

Each frame must include:
1. Frame number (1-9)
2. Scene title (concise and impactful)
3. Visual description (animal pose, background, lighting, camera angle)
4. Action/movement (what is happening in the frame)
5. Mood or narration (emotional tone of the scene)
6. Transition effect (how to move to the next frame)
${storyContext}${langInstruction}

Respond ONLY in the following JSON format (no other text):
{
  "petName": "Animal description (e.g. Golden Retriever, Tabby Cat)",
  "frames": [
    {
      "frameNumber": 1,
      "title": "Scene title",
      "visualDescription": "Visual description",
      "action": "Action/movement",
      "dialogue": "Mood or narration",
      "transition": "Transition effect"
    }
  ]
}`;

    // Use REST API with gemini-3-pro-image-preview model
    const response = await fetch(
      `${API_ENDPOINT}/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
                imageData,
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['TEXT'],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API call failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract text from response
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No response received.');
    }

    const parts = candidates[0]?.content?.parts;
    if (!parts) {
      throw new Error('Invalid response data.');
    }

    const textPart = parts.find((part) => part.text);
    if (!textPart) {
      throw new Error('No text response found.');
    }

    const text = textPart.text;

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON response received.');
    }

    const storyboardData = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!storyboardData.frames || !Array.isArray(storyboardData.frames)) {
      throw new Error('Invalid storyboard frame data.');
    }

    return storyboardData;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Storyboard generation failed: ${error.message}`);
  }
}

/**
 * Convert file to Generative AI part
 * @param {File} file - Image file
 * @returns {Promise<Object>} Generative part object
 */
async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate complete storyboard grid image (3x3 grid with 9 frames)
 * @param {File} referenceImage - Original pet image
 * @param {string} petName - Description of the pet
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export async function generateStoryboardGrid(referenceImage, petName = 'pet', userStory = '', frames = []) {
  if (!API_KEY) {
    throw new Error('Gemini API is not initialized. Please check your API key.');
  }

  try {
    // Convert reference image to base64
    const imageData = await fileToGenerativePart(referenceImage);

    let frameDescriptions;
    if (frames.length === 9) {
      frameDescriptions = frames.map((f) =>
        `FRAME ${f.frameNumber}:\n${f.title}. ${f.visualDescription} ${f.action}`
      ).join('\n\n');
    } else {
      frameDescriptions = `FRAME 1:
Front-facing hero shot (Portrait). A classic studio portrait with the animal looking directly at the camera. Calm, confident, and engaging eye contact. Neutral studio background.

FRAME 2:
Extreme close-up (Macro) focusing on the eyes or nose. Highlighting the texture of the wet nose or the depth of the iris. Sharp details, soft focus on the edges.

FRAME 3:
Environmental shot. The animal sitting or lying comfortably in a cozy, stylish living room setting. Soft natural light coming from a window. Warm and homey atmosphere.

FRAME 4:
Interaction shot. A human hand is gently petting the animal's head or shaking paws. The focus remains on the animal's happy or trusting reaction. Minimalist composition.

FRAME 5:
High-angle shot (Top-down view). The camera looks straight down at the animal looking up with "puppy eyes" (or curious cat eyes). Cute, symmetrical, and endearing perspective.

FRAME 6:
Action shot. The animal in motion—catching a treat, running towards the camera, or jumping. Ears flapping, dynamic pose, frozen in time with a fast shutter speed.

FRAME 7:
Detail shot focusing on a specific body part like the paw pads (beans), tail, or ear texture. Abstract and artistic composition emphasizing softness and fur detail.

FRAME 8:
Profile silhouette or artistic lighting. The animal looking to the side, lit by a dramatic rim light or moody lighting. Editorial and sophisticated.

FRAME 9:
Relaxed sleeping or resting shot. The animal curled up or stretched out on a soft cushion or rug. Peaceful, serene, and comfortable.`;
    }

    const storyContext = userStory
      ? `\n\nStory context: "${userStory}"\nEach frame should reflect this story's narrative and mood.\n`
      : '';

    const prompt = `Create ONE final image.

A clean 3×3 storyboard grid with nine equal sized panels on [4:5] ratio.

Use the reference image as the base character reference. Keep the same animal, breed, fur markings, eye color, body shape, and overall personality across all nine panels exactly as the reference. The animal must remain clearly recognizable in every frame. Distinctive features like spots, ear shape, and snout length must stay exactly the same.

This storyboard is a high-end pet photography portfolio. The focus is on the animal's expression, texture, and distinct personality rather than just a simple portrait. The overall look should feel warm, cinematic, and professional.
${storyContext}
${frameDescriptions}

CAMERA & STYLE:
Ultra high-quality animal photography with a DSLR look (Canon EOS R5 or Sony A7R IV). 85mm lens for portraits, 35mm for environmental shots. Soft, diffused lighting to highlight fur texture. Natural color palette (creams, browns, warm greys) that complements the animal's fur. Consistent visual language across all nine panels.

OUTPUT:
A clean 3×3 grid with no borders, no text, no captions, and no watermarks.`;

    // Use REST API for image generation with reference image
    const response = await fetch(
      `${API_ENDPOINT}/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
                imageData,
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
            imageConfig: {
              imageSize: '1K',
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Image generation failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract image data from response
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No image generation result received.');
    }

    const parts = candidates[0]?.content?.parts;
    if (!parts) {
      throw new Error('Invalid response data.');
    }

    // Find the image part
    const imagePart = parts.find((part) => part.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      throw new Error('No generated image found.');
    }

    // Convert to data URL
    const { data: base64Data, mimeType } = imagePart.inlineData;
    const dataURL = `data:${mimeType};base64,${base64Data}`;

    return dataURL;
  } catch (error) {
    console.error('Storyboard grid generation error:', error);
    throw new Error(`Storyboard grid generation failed: ${error.message}`);
  }
}

/**
 * Generate image for a storyboard frame
 * @param {Object} frame - Storyboard frame with visual description
 * @param {string} petName - Description of the pet
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export async function generateFrameImage(frame, petName = 'pet') {
  if (!API_KEY) {
    throw new Error('Gemini API is not initialized. Please check your API key.');
  }

  try {
    const frameDescriptions = {
      1: 'Front-facing hero shot (Portrait). A classic studio portrait with the animal looking directly at the camera. Calm, confident, and engaging eye contact. Neutral studio background.',
      2: 'Extreme close-up (Macro) focusing on the eyes or nose. Highlighting the texture of the wet nose or the depth of the iris. Sharp details, soft focus on the edges.',
      3: 'Environmental shot. The animal sitting or lying comfortably in a cozy, stylish living room setting. Soft natural light coming from a window. Warm and homey atmosphere.',
      4: 'Interaction shot. A human hand is gently petting the animal\'s head or shaking paws. The focus remains on the animal\'s happy or trusting reaction. Minimalist composition.',
      5: 'High-angle shot (Top-down view). The camera looks straight down at the animal looking up with endearing eyes. Cute, symmetrical, and endearing perspective.',
      6: 'Action shot. The animal in motion—catching a treat, running towards the camera, or jumping. Ears flapping, dynamic pose, frozen in time with a fast shutter speed.',
      7: 'Detail shot focusing on a specific body part like the paw pads (beans), tail, or ear texture. Abstract and artistic composition emphasizing softness and fur detail.',
      8: 'Profile silhouette or artistic lighting. The animal looking to the side, lit by a dramatic rim light or moody lighting. Editorial and sophisticated.',
      9: 'Relaxed sleeping or resting shot. The animal curled up or stretched out on a soft cushion or rug. Peaceful, serene, and comfortable.',
    };

    const frameDescription = frameDescriptions[frame.frameNumber] || frameDescriptions[1];

    const prompt = `Create a professional, high-quality pet photography storyboard frame.

Pet: ${petName}
Scene Title: ${frame.title}
Visual Description: ${frame.visualDescription}
Action: ${frame.action}

Frame Style: ${frameDescription}

Style requirements:
- Ultra high-quality animal photography with a DSLR look (Canon EOS R5 or Sony A7R IV)
- 85mm lens for portraits, 35mm for environmental shots
- Soft, diffused lighting to highlight fur texture
- Natural color palette (creams, browns, warm greys) that complements the animal's fur
- Warm, cinematic, and professional feel
- Controlled depth of field, precise lighting
- Focus on the animal's expression, texture, and distinct personality

Create a realistic, photographic image that matches this pet storyboard frame description.`;

    // Use REST API for image generation
    const response = await fetch(
      `${API_ENDPOINT}/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
            imageConfig: {
              imageSize: '1K',
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Image generation failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract image data from response
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No image generation result received.');
    }

    const parts = candidates[0]?.content?.parts;
    if (!parts) {
      throw new Error('Invalid response data.');
    }

    // Find the image part
    const imagePart = parts.find((part) => part.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      throw new Error('No generated image found.');
    }

    // Convert to data URL
    const { data: base64Data, mimeType } = imagePart.inlineData;
    const dataURL = `data:${mimeType};base64,${base64Data}`;

    return dataURL;
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Download base64 image as file
 * @param {string} dataURL - Base64 data URL
 * @param {string} filename - Filename for download
 */
export function downloadImage(dataURL, filename) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
