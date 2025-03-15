import { EnhancedPhotoAnalysis } from '@/types/ai-type';

export async function analyzePhotoContext(
  imageBase64: string
): Promise<EnhancedPhotoAnalysis> {
  try {
    const response = await fetch('/api/analyze-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing photo:', error);
    return {
      photoContent: {
        mainSubject: 'Unknown',
        description: 'Could not analyze the image.',
        occasion: 'Unknown',
        confidence: 'Low',
      },
      temporalContext: {
        timeOfDay: 'Unknown',
        probableYear: 'Unknown',
        season: 'Unknown',
        dayType: 'Unknown',
      },
      locationContext: {
        environment: 'Unknown',
        probablePlace: 'Unknown',
        probableCity: 'Unknown',
        culturalIndicators: 'Unknown',
      },
      visualElements: {
        dominantColors: ['Unknown'],
        lighting: 'Unknown',
        composition: 'Unknown',
        peopleCount: 'Unknown',
      },
      socialContext: {
        groupDynamics: 'Unknown',
        activity: 'Unknown',
        mood: 'Unknown',
        formalityLevel: 'Unknown',
      },
    };
  }
}
