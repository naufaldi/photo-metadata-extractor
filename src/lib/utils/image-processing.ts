import EXIF from 'exif-js';
import { processMetadata, MetadataType } from '../utils';
import { analyzePhotoContext } from '@/api/ai-services';
import { EnhancedPhotoAnalysis } from '@/types/ai-type';

interface ImageMetadataResult {
  imageUrl: string;
  metadata: MetadataType;
}

/**
 * Process an image file to extract metadata
 */
export const extractImageMetadata = async (file: File): Promise<ImageMetadataResult> => {
  return new Promise((resolve, reject) => {
    try {
      // Create URL from the file
      const imageUrl = URL.createObjectURL(file);
      
      // Extract EXIF data
      // @ts-expect-error - EXIF-js types are not properly defined
      EXIF.getData(file, function (this: { [key: string]: unknown }) {
        try {
          const allMetadata = EXIF.getAllTags(this);
          const processedMetadata = processMetadata(allMetadata, file);
          resolve({
            imageUrl,
            metadata: processedMetadata
          });
        } catch (error) {
          console.error("Error processing EXIF data:", error);
          reject(error);
        }
      });
    } catch (error) {
      console.error("Error creating object URL:", error);
      reject(error);
    }
  });
};

/**
 * Convert an image URL to base64 format for AI processing
 */
export const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      try {
        // Remove the data URL prefix
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Analyze a photo using AI services
 */
export const analyzeImage = async (imageUrl: string): Promise<EnhancedPhotoAnalysis> => {
  try {
    const base64String = await imageUrlToBase64(imageUrl);
    return await analyzePhotoContext(base64String);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze photo. Please try again.");
  }
}; 