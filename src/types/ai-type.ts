export interface EnhancedPhotoAnalysis {
  // Core photo content identification
  photoContent: {
    mainSubject: string; // Primary subject of the photo (e.g., "Group of students", "Beach sunset")
    description: string; // Detailed description of what's in the image
    occasion: string; // Type of event/occasion (e.g., "Graduation", "Birthday party", "Casual gathering")
    confidence: string; // Confidence level (High/Medium/Low)
  };

  // Temporal information
  temporalContext: {
    timeOfDay: string; // Morning/Afternoon/Evening/Night
    probableYear: string; // Estimated year or decade based on visual cues
    season: string; // Season if determinable (Spring/Summer/Fall/Winter)
    dayType: string; // Weekday/Weekend/Holiday inference
  };

  // Location information
  locationContext: {
    environment: string; // Indoor/Outdoor/Urban/Rural
    probablePlace: string; // Specific type of place (restaurant, cafe, beach, park)
    probableCity: string; // Possible city or region based on visual cues
    culturalIndicators: string; // Cultural elements visible in the photo
  };

  // Visual elements
  visualElements: {
    dominantColors: string[]; // 3-5 main colors in the image
    lighting: string; // Natural/Artificial/Mixed, quality of light
    composition: string; // Formal/Casual, Professional/Amateur
    peopleCount: string; // Approximate number of people if present
  };

  // Social context
  socialContext: {
    groupDynamics: string; // Family/Friends/Colleagues/Strangers
    activity: string; // What people are doing (dining, posing, celebrating)
    mood: string; // Overall emotional tone (joyful, serious, relaxed)
    formalityLevel: string; // Formal/Semi-formal/Casual gathering
  };
}
