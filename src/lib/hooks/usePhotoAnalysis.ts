import { useState } from 'react';
import { EnhancedPhotoAnalysis } from '@/types/ai-type';
import { analyzeImage } from '../utils/image-processing';

export default function usePhotoAnalysis() {
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<EnhancedPhotoAnalysis | null>(null);

  const handleAnalyzePhoto = async (imageUrl: string) => {
    if (!imageUrl) return;

    setIsAnalyzingPhoto(true);
    try {
      const result = await analyzeImage(imageUrl);
      setPhotoAnalysis(result);
    } catch (error) {
      console.error("Error analyzing photo:", error);
      alert("Failed to analyze photo. Please try again.");
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const resetPhotoAnalysis = () => {
    setPhotoAnalysis(null);
  };

  return {
    isAnalyzingPhoto,
    photoAnalysis,
    handleAnalyzePhoto,
    resetPhotoAnalysis
  };
} 