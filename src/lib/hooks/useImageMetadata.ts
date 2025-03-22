import { useState } from 'react';
import { MetadataType } from '../utils';
import { extractImageMetadata } from '../utils/image-processing';
import usePhotoAnalysis from './usePhotoAnalysis';

export default function useImageMetadata() {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const { 
    isAnalyzingPhoto, 
    photoAnalysis, 
    handleAnalyzePhoto, 
    resetPhotoAnalysis 
  } = usePhotoAnalysis();

  const handleImageChange = async (file: File) => {
    setLoading(true);
    resetPhotoAnalysis();
    
    try {
      const result = await extractImageMetadata(file);
      setImage(result.imageUrl);
      setMetadata(result.metadata);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  const handleHideMap = () => {
    setShowMap(false);
  };

  const handleAnalyzeCurrentPhoto = async () => {
    if (image) {
      await handleAnalyzePhoto(image);
    }
  };

  return {
    image,
    metadata,
    loading,
    showMap,
    isAnalyzingPhoto,
    photoAnalysis,
    handleImageChange,
    handleShowMap,
    handleHideMap,
    handleAnalyzeCurrentPhoto
  };
} 