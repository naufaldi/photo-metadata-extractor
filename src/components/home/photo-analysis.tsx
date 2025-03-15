'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Users,
  Palette,
  Eye,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedPhotoAnalysis } from '@/types/ai-type';

interface PhotoAnalysisProps {
  analysis: EnhancedPhotoAnalysis | null;
  isLoading: boolean;
}

export default function PhotoAnalysis({ analysis, isLoading }: PhotoAnalysisProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("photoContent");

  if (!analysis && !isLoading) return null;

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const SectionHeader = ({
    title,
    icon,
    section,
    color = "indigo"
  }: {
    title: string;
    icon: React.ReactNode;
    section: string;
    color?: string;
  }) => (
    <div
      className={`flex justify-between items-center p-3 bg-${color}-100 rounded-lg border-2 border-black cursor-pointer`}
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-bold flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
      >
        {expandedSection === section ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Button>
    </div>
  );

  return (
    <div className="mt-6">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-indigo-100 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
              <div className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse delay-300"></div>
              <span className="ml-2 font-medium">AI is analyzing your photo...</span>
            </div>
          </motion.div>
        ) : analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0)] overflow-hidden"
          >
            <div className="bg-indigo-300 p-4 border-b-2 border-black">
              <h2 className="text-2xl font-bold flex items-center">
                <Eye className="mr-2 h-6 w-6" /> AI Photo Analysis
              </h2>
              <p className="text-sm mt-1">AI-powered insights about your photo</p>
            </div>

            <div className="p-4 space-y-3">
              {/* Photo Content Section */}
              <div>
                <SectionHeader
                  title="What's in this Photo"
                  icon={<Info className="h-5 w-5" />}
                  section="photoContent"
                  color="blue"
                />

                <AnimatePresence>
                  {expandedSection === "photoContent" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-3 bg-white rounded-lg border-2 border-black"
                    >
                      <div className="mb-2">
                        <span className="font-bold">Main Subject:</span>
                        <p className="mt-1">{analysis.photoContent.mainSubject}</p>
                      </div>

                      <div className="mb-2">
                        <span className="font-bold">Description:</span>
                        <p className="mt-1">{analysis.photoContent.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <span className="font-bold">Occasion:</span>
                          <p>{analysis.photoContent.occasion}</p>
                        </div>
                        <div>
                          <span className="font-bold">Confidence:</span>
                          <p>{analysis.photoContent.confidence}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Temporal Context Section */}
              <div>
                <SectionHeader
                  title="When was it Taken"
                  icon={<Clock className="h-5 w-5" />}
                  section="temporalContext"
                  color="yellow"
                />

                <AnimatePresence>
                  {expandedSection === "temporalContext" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-3 bg-white rounded-lg border-2 border-black"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold">Time of Day:</span>
                          <p>{analysis.temporalContext.timeOfDay}</p>
                        </div>
                        <div>
                          <span className="font-bold">Season:</span>
                          <p>{analysis.temporalContext.season}</p>
                        </div>
                        <div>
                          <span className="font-bold">Probable Year/Era:</span>
                          <p>{analysis.temporalContext.probableYear}</p>
                        </div>
                        <div>
                          <span className="font-bold">Day Type:</span>
                          <p>{analysis.temporalContext.dayType}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Location Context Section */}
              <div>
                <SectionHeader
                  title="Where was it Taken"
                  icon={<MapPin className="h-5 w-5" />}
                  section="locationContext"
                  color="green"
                />

                <AnimatePresence>
                  {expandedSection === "locationContext" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-3 bg-white rounded-lg border-2 border-black"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <span className="font-bold">Environment:</span>
                          <p>{analysis.locationContext.environment}</p>
                        </div>
                        <div>
                          <span className="font-bold">Probable City/Region:</span>
                          <p>{analysis.locationContext.probableCity}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold">Probable Place:</span>
                        <p>{analysis.locationContext.probablePlace}</p>
                      </div>

                      <div className="mt-3">
                        <span className="font-bold">Cultural Indicators:</span>
                        <p>{analysis.locationContext.culturalIndicators}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Social Context Section */}
              <div>
                <SectionHeader
                  title="Social Context"
                  icon={<Users className="h-5 w-5" />}
                  section="socialContext"
                  color="pink"
                />

                <AnimatePresence>
                  {expandedSection === "socialContext" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-3 bg-white rounded-lg border-2 border-black"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold">Group Dynamics:</span>
                          <p>{analysis.socialContext.groupDynamics}</p>
                        </div>
                        <div>
                          <span className="font-bold">People Count:</span>
                          <p>{analysis.visualElements.peopleCount}</p>
                        </div>
                        <div>
                          <span className="font-bold">Activity:</span>
                          <p>{analysis.socialContext.activity}</p>
                        </div>
                        <div>
                          <span className="font-bold">Mood:</span>
                          <p>{analysis.socialContext.mood}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-bold">Formality Level:</span>
                        <p>{analysis.socialContext.formalityLevel}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Visual Elements Section */}
              <div>
                <SectionHeader
                  title="Visual Elements"
                  icon={<Palette className="h-5 w-5" />}
                  section="visualElements"
                  color="purple"
                />

                <AnimatePresence>
                  {expandedSection === "visualElements" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-3 bg-white rounded-lg border-2 border-black"
                    >
                      <div className="mb-3">
                        <span className="font-bold">Dominant Colors:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.visualElements.dominantColors.map((color, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold">Lighting:</span>
                          <p>{analysis.visualElements.lighting}</p>
                        </div>
                        <div>
                          <span className="font-bold">Composition:</span>
                          <p>{analysis.visualElements.composition}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}