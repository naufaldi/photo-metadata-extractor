import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Add this debug line at the top of your POST function
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log(
  'API Key first 5 chars:',
  process.env.OPENAI_API_KEY?.substring(0, 5) + '...'
);
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate the image data is properly formatted
    if (!image.startsWith('data:image') && !image.match(/^[A-Za-z0-9+/=]+$/)) {
      return NextResponse.json(
        {
          error:
            'Invalid image format. Please provide a valid base64 encoded image.',
        },
        { status: 400 }
      );
    }

    // Set up proper error handling with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await openai.chat.completions.create(
        {
          model: 'gpt-4o-mini', // Updated to use GPT-4o instead of gpt-4-vision-preview
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image in detail and provide a comprehensive assessment in JSON format. Focus on extracting visual information that would help identify:

1. The main content and context of the photo
2. When and where it was likely taken
3. The social and visual elements present

Return ONLY a valid JSON object with this structure:
{
  "photoContent": {
    "mainSubject": "Primary subject of the photo",
    "description": "Detailed description of what's in the image (2-3 sentences)",
    "occasion": "Type of event/occasion if applicable (be specific)",
    "confidence": "Your confidence level in this analysis (High/Medium/Low)"
  },
  "temporalContext": {
    "timeOfDay": "Morning/Afternoon/Evening/Night",
    "probableYear": "Estimated year or decade based on visual cues",
    "season": "Season if determinable",
    "dayType": "Weekday/Weekend/Holiday inference"
  },
  "locationContext": {
    "environment": "Indoor/Outdoor/Urban/Rural",
    "probablePlace": "Specific type of place (be detailed)",
    "probableCity": "Possible city or region based on visual cues (if identifiable)",
    "culturalIndicators": "Cultural elements visible in the photo"
  },
  "visualElements": {
    "dominantColors": ["3-5 main colors in the image"],
    "lighting": "Quality and type of lighting",
    "composition": "Professional/Amateur, formal/casual",
    "peopleCount": "Approximate number of people if present"
  },
  "socialContext": {
    "groupDynamics": "Family/Friends/Colleagues/Strangers",
    "activity": "What people are doing in the photo",
    "mood": "Overall emotional tone",
    "formalityLevel": "Formal/Semi-formal/Casual gathering"
  }
}

Be specific and detailed in your analysis. If you're uncertain about any element, provide your best guess but indicate lower confidence. For probable city/location, look for architectural styles, signage, natural features, or other cultural indicators.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: image.startsWith('data:image')
                      ? image
                      : `data:image/jpeg;base64,${image}`,
                    // Note: 'detail' parameter is not needed for GPT-4o as it automatically
                    // processes images at high detail
                  },
                },
              ],
            },
          ],
          max_tokens: 1500,
          temperature: 0.2, // Lower temperature for more factual responses
          response_format: { type: 'json_object' }, // Ensure JSON response format
        },
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // With response_format: json_object, we can directly parse the content
      const content = response.choices[0].message.content || '{}';
      let analysisResult;

      try {
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Fallback to regex extraction if JSON parsing fails
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : '{}';
        analysisResult = JSON.parse(jsonString);
      }

      return NextResponse.json(analysisResult);
    } catch (apiError: any) {
      clearTimeout(timeoutId);

      if (apiError.name === 'AbortError') {
        return NextResponse.json(
          {
            error:
              'Request timed out. The image may be too complex or the service is currently busy.',
          },
          { status: 408 }
        );
      }

      console.error('OpenAI API error:', apiError);
      console.error('OpenAI API error details:', {
        message: apiError.message,
        type: apiError.type,
        code: apiError.code,
        param: apiError.param,
        stack: apiError.stack,
        response: apiError.response?.data,
      });
      return NextResponse.json(
        { error: `OpenAI API error: ${apiError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error analyzing photo:', error);
    return NextResponse.json(
      { error: `Failed to analyze photo: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    // Increase the body size limit for larger images (10MB)
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Increase the response timeout
    responseLimit: 30,
  },
};
