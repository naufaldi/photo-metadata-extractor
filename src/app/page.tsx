// app/page.jsx - Main Page Component
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Share, Download } from 'lucide-react';
import EXIF from 'exif-js';
import MetadataDisplay from '@/components/home/meta-data';
import ImageUploader from '@/components/home/image-uploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { processMetadata, type MetadataType } from '@/lib/utils';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('upload');
  const [isMobile, setIsMobile] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || ((window as unknown) as { opera: string }).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

  // Clean up media stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Use tabValue in a useEffect to demonstrate it's being used
  useEffect(() => {
    console.log(`Current tab: ${tabValue}`);
  }, [tabValue]);

  const handleImageChange = async (file: File) => {
    setLoading(true);

    try {
      // Create URL from the file
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Extract EXIF data
      // @ts-expect-error - EXIF-js types are not properly defined
      EXIF.getData(file, function (this: { [key: string]: unknown }) {
        const allMetadata = EXIF.getAllTags(this);

        // Process the metadata into organized categories
        const processedMetadata = processMetadata(allMetadata, file);
        setMetadata(processedMetadata);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error processing image:", error);
      setLoading(false);
    }
  };

  const handleCameraCapture = async () => {
    if (isMobile) {
      if (cameraRef.current) {
        cameraRef.current.click();
      }
    } else {
      try {
        console.log("Starting webcam...");
        console.log("Browser:", navigator.userAgent);
        console.log("videoRef status:", videoRef.current ? "available" : "not available");

        // For macOS, use more specific constraints
        const isMacOS = /Mac OS X/.test(navigator.userAgent);
        console.log("Is macOS:", isMacOS);

        const constraints = {
          video: isMacOS ?
            {
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              frameRate: { ideal: 30, min: 15 },
              facingMode: "user"
            } :
            {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user"
            },
          audio: false
        };

        console.log("Using constraints:", JSON.stringify(constraints));

        try {
          // First try to enumerate devices to ensure camera is available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          console.log("Available video devices:", videoDevices.length);

          if (videoDevices.length === 0) {
            throw new Error("No video input devices found");
          }

          // Request webcam access with specific constraints
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

          // Double check videoRef is still available after async operation
          if (!videoRef.current) {
            console.error("Video reference is not available after getUserMedia");
            mediaStream.getTracks().forEach(track => track.stop());
            alert("Camera initialization failed. Please refresh the page and try again.");
            return;
          }

          // Set the stream as the video source
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;

          // For macOS Safari, we need to manually play the video
          if (isMacOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            console.log("Using Safari-specific video playback");
            try {
              await videoRef.current.play();
              console.log("Video playback started immediately");
            } catch (e) {
              console.error("Error playing video immediately:", e);
            }
          } else {
            // For other browsers, use the onloadedmetadata event
            videoRef.current.onloadedmetadata = async () => {
              console.log("Video metadata loaded");
              if (videoRef.current) {
                try {
                  await videoRef.current.play();
                  console.log("Video playback started after metadata loaded");
                } catch (e) {
                  console.error("Error playing video:", e);
                  alert("Could not start video playback. Please check your browser permissions.");
                }
              } else {
                console.error("Video reference lost during metadata loading");
              }
            };
          }

          setStream(mediaStream);
          setShowWebcam(true);
          console.log("Webcam started successfully");
        } catch (innerError: unknown) {
          console.error("Error during device access:", innerError);

          // Special handling for common macOS errors
          if (innerError instanceof Error) {
            if (innerError.name === 'NotFoundError' || innerError.name === 'DevicesNotFoundError') {
              alert("No camera found. Please connect a camera and try again.");
            } else if (innerError.name === 'NotAllowedError' || innerError.name === 'PermissionDeniedError') {
              alert("Camera access denied. Please allow camera access in your browser settings.");
            } else if (innerError.name === 'NotReadableError' || innerError.name === 'TrackStartError') {
              alert("Camera is in use by another application. Please close other applications using the camera.");
            } else {
              alert(`Camera error: ${innerError.message || innerError.name || "Unknown error"}`);
            }
          } else {
            alert("An unknown camera error occurred. Please try again.");
          }
          throw innerError;
        }
      } catch (error) {
        console.error("Error starting webcam:", error);
        alert("Failed to start webcam. Please check your browser permissions and try again.");
      }
    }
  };

  const handleTakePhoto = () => {
    console.log("Taking photo from webcam...");
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas reference is not available");
      alert("Cannot capture image. Please ensure webcam is active and try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Make sure video is playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions are not available");
      console.log("Video readyState:", video.readyState);
      alert("Cannot capture image. Please ensure webcam is active and try again.");
      return;
    }

    console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Could not get canvas context");
        alert("Failed to initialize photo capture. Please try again.");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("Photo captured successfully, blob size:", blob.size);
          const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
          handleImageChange(file);
        } else {
          console.error("Failed to create blob from canvas");
          alert("Failed to capture photo. Please try again.");
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("An error occurred while capturing the photo. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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

        <motion.div
          className="order-1 lg:order-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-lg overflow-hidden">
            <div className="bg-cyan-300 p-4 border-b-2 border-black">
              <Tabs defaultValue="upload" onValueChange={setTabValue}>
                <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
                  <TabsTrigger
                    className="data-[state=active]:bg-white data-[state=active]:shadow-[3px_3px_0px_0px_rgba(0,0,0)] border-2 border-black"
                    value="upload"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-white data-[state=active]:shadow-[3px_3px_0px_0px_rgba(0,0,0)] border-2 border-black"
                    value="camera"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isMobile ? "Take Photo" : "Use Webcam"}
                  </TabsTrigger>
                </TabsList>

                <CardContent className="p-4">
                  <TabsContent value="upload" className="mt-0">
                    <ImageUploader onImageChange={handleImageChange} loading={loading} />
                  </TabsContent>

                  <TabsContent value="camera" className="mt-0">
                    <div className="text-center py-6">
                      {/* Always render the video element but hide it when not in use */}
                      <div className={`flex flex-col items-center ${showWebcam ? 'block' : 'hidden'}`}>
                        <div className="relative mb-4 border-2 border-black rounded-lg overflow-hidden bg-black w-full max-w-xl mx-auto">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-auto max-h-[400px] object-contain"
                            style={{ minHeight: "300px", display: "block" }}
                          />
                          <div className="absolute top-2 right-2 flex items-center">
                            <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span className="text-white text-xs">LIVE</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Your webcam feed should appear above. If you don&apos;t see it, check your browser permissions.</p>
                        <div className="flex gap-4">
                          <Button
                            onClick={handleTakePhoto}
                            variant="brutalism"
                          >
                            <Camera className="mr-2 h-5 w-5" />
                            Take Photo
                          </Button>
                          <Button
                            onClick={() => {
                              if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                                setStream(null);
                                setShowWebcam(false);
                              }
                            }}
                            variant="outline"
                          >
                            Stop Camera
                          </Button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>

                      {!showWebcam && (
                        <Button
                          onClick={handleCameraCapture}
                          variant="brutalism"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          {isMobile ? "Open Camera" : "Start Webcam"}
                        </Button>
                      )}
                      <input
                        ref={cameraRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageChange(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </TabsContent>

                  {image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 rounded-lg overflow-hidden border-2 border-black"
                    >
                      <ScrollArea className="max-h-[400px]">
                        <Image src={image} alt="Uploaded" width={1000} height={1000} className="w-full h-auto" />
                      </ScrollArea>

                      <div className="flex justify-end p-2 gap-2 bg-white border-t-2 border-black">
                        <Button variant="outline" size="icon" className="border-2 border-black">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-2 border-black">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Tabs>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}