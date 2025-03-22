'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Brain } from 'lucide-react';
import MetadataDisplay from '@/components/home/meta-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import PhotoAnalysis from '@/components/home/photo-analysis';
import PhotoTab from '@/components/home/photo-tab';
import useImageMetadata from '@/lib/hooks/useImageMetadata';

// Dynamically import the LocationMap component with no SSR
const LocationMap = dynamic(() => import('@/components/home/location-map'), { ssr: false });

export default function Home() {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useImageMetadata();

  // Scroll to map section with smooth animation when map is shown
  const handleShowMapWithScroll = () => {
    handleShowMap();
    // Scroll to map section with smooth animation
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl h-full overflow-y-auto overflow-x-hidden">
      <motion.header
        className="mb-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-yellow-300 inline-block px-4 py-2 rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)]">
          Photo Metadata Extractor
        </h1>
        <p className="text-lg mt-2 max-w-xl mx-auto">
          Upload a photo or take a new one to extract and display metadata information.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Metadata Card */}
        <motion.div
          className="order-2 lg:order-1"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-lg overflow-hidden">
            <div className="bg-purple-300 p-4 border-b-2 border-black">
              <h2 className="text-2xl font-bold">Metadata Information</h2>
            </div>
            <CardContent className="p-4">
              {metadata ? (
                <MetadataDisplay metadata={metadata} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg mb-4">No image selected</p>
                  <p>Upload or capture a photo to see its metadata.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Photo Upload/Camera Card */}
        <motion.div
          className="order-1 lg:order-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-lg overflow-hidden">
            <div className="bg-cyan-300 p-4 border-b-2 border-black">
              <PhotoTab 
                image={image}
                loading={loading}
                onImageChange={handleImageChange}
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Map Section - Full Width */}
      {metadata && metadata.location.latitude !== 'Unknown' && metadata.location.longitude !== 'Unknown' && (
        <div className="mt-12" ref={mapSectionRef}>
          <AnimatePresence>
            {!showMap ? (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Button
                  onClick={handleShowMapWithScroll}
                  variant="brutalism"
                  className="flex items-center px-6 py-3 text-lg"
                >
                  <MapPin className="mr-2 h-6 w-6" />
                  Show Location on Map
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-lg overflow-hidden">
                  <div className="bg-blue-300 p-4 border-b-2 border-black flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center">
                      <MapPin className="mr-2 h-6 w-6" /> Location Visualization
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-black"
                      onClick={handleHideMap}
                    >
                      Hide Map
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    <div className="h-[500px]">
                      <LocationMap
                        latitude={metadata.location.latitude}
                        longitude={metadata.location.longitude}
                        alwaysShow={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* AI Analysis Button */}
      {image && metadata && !photoAnalysis && !isAnalyzingPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-8 mb-4"
        >
          <Button
            onClick={handleAnalyzeCurrentPhoto}
            variant="brutalism"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3"
          >
            <Brain className="mr-2 h-5 w-5" />
            Analyze Photo with AI
          </Button>
        </motion.div>
      )}

      {/* AI Analysis Results */}
      {image && (
        <PhotoAnalysis
          analysis={photoAnalysis}
          isLoading={isAnalyzingPhoto}
        />
      )}
    </div>
  );
}