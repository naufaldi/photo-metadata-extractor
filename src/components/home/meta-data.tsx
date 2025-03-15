// components/MetadataDisplay.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, Aperture, Clock, Code } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// Define the metadata type
interface MetadataProps {
  metadata: {
    basic: {
      filename: string;
      filesize: string;
      filetype: string;
      dimensions: string;
      dateTime: string;
    };
    location: {
      latitude: string;
      longitude: string;
      altitude: string;
    };
    camera: {
      make: string;
      model: string;
      aperture: string;
      shutterSpeed: string;
      iso: string;
      focalLength: string;
      flash: string;
    };
    software: {
      software: string;
      creator: string;
      copyright: string;
    };
    raw: Record<string, unknown>;
  } | null;
}

const MetadataDisplay = ({ metadata }: MetadataProps) => {
  const [viewMode, setViewMode] = useState('basic');

  if (!metadata) return null;

  const { basic, location, camera, software, raw } = metadata;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div>
      <Tabs defaultValue="basic" value={viewMode} onValueChange={setViewMode} className="mb-4">
        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
          <TabsTrigger
            className="data-[state=active]:bg-black data-[state=active]:text-white border-2 border-black"
            value="basic"
          >
            Basic View
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-black data-[state=active]:text-white border-2 border-black"
            value="advanced"
          >
            Advanced View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Core Metadata */}
            <motion.div
              variants={itemVariants}
              className="grid gap-4"
            >
              {/* File Info */}
              <div className="p-4 bg-pink-200 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <Clock className="mr-2" /> File Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Filename:</span>
                    <span>{basic.filename}</span>
                  </div>
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">File Type:</span>
                    <span>{basic.filetype}</span>
                  </div>
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">File Size:</span>
                    <span>{basic.filesize}</span>
                  </div>
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Dimensions:</span>
                    <span>{basic.dimensions}</span>
                  </div>
                </div>
                <div className="mt-2 bg-white p-2 rounded border-2 border-black">
                  <span className="font-semibold block">Date Taken:</span>
                  <span>{basic.dateTime}</span>
                </div>
              </div>

              {/* Location Info */}
              <div className="p-4 bg-blue-200 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <MapPin className="mr-2" /> Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Latitude:</span>
                    <span>{location.latitude}</span>
                  </div>
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Longitude:</span>
                    <span>{location.longitude}</span>
                  </div>
                </div>
                <div className="mt-2 bg-white p-2 rounded border-2 border-black">
                  <span className="font-semibold block">Altitude:</span>
                  <span>{location.altitude}</span>
                </div>

              </div>

              {/* Camera Info */}
              <div className="p-4 bg-green-200 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <Camera className="mr-2" /> Device Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Make:</span>
                    <span>{camera.make}</span>
                  </div>
                  <div className="bg-white p-2 rounded border-2 border-black">
                    <span className="font-semibold block">Model:</span>
                    <span>{camera.model}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="camera-settings" className="border-2 border-black mb-4 rounded-lg overflow-hidden">
              <AccordionTrigger className="bg-green-200 px-4 hover:no-underline hover:bg-green-300">
                <div className="flex items-center font-bold">
                  <Aperture className="mr-2 h-5 w-5" /> Camera Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Aperture:</span>
                    <span>{camera.aperture}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Shutter Speed:</span>
                    <span>{camera.shutterSpeed}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">ISO:</span>
                    <span>{camera.iso}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Focal Length:</span>
                    <span>{camera.focalLength}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Flash:</span>
                    <span>{camera.flash}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="software-info" className="border-2 border-black mb-4 rounded-lg overflow-hidden">
              <AccordionTrigger className="bg-yellow-200 px-4 hover:no-underline hover:bg-yellow-300">
                <div className="flex items-center font-bold">
                  <Code className="mr-2 h-5 w-5" /> Software Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Software:</span>
                    <span>{software.software}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Creator:</span>
                    <span>{software.creator}</span>
                  </div>
                  <div className="p-2 bg-gray-100 rounded border border-gray-300">
                    <span className="font-semibold block">Copyright:</span>
                    <span>{software.copyright}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="raw-data" className="border-2 border-black rounded-lg overflow-hidden">
              <AccordionTrigger className="bg-purple-200 px-4 hover:no-underline hover:bg-purple-300">
                <div className="flex items-center font-bold">
                  <Code className="mr-2 h-5 w-5" /> Raw Metadata
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4 h-[430px] overflow-y-auto">
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{JSON.stringify(raw, null, 2)}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetadataDisplay;