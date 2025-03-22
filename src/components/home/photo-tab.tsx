import { motion } from 'framer-motion';
import { Camera, Upload, Share, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUploader from './image-uploader';
import Image from 'next/image';
import useCamera from '@/lib/hooks/useCamera';

interface PhotoTabProps {
  image: string | null;
  loading: boolean;
  onImageChange: (file: File) => void;
}

export default function PhotoTab({ image, loading, onImageChange }: PhotoTabProps) {
  const {
    videoRef,
    canvasRef,
    cameraRef,
    showWebcam,
    isMobile,
    startCamera,
    stopCamera,
    takePhoto,
    handleFileInputChange
  } = useCamera({
    onPhotoCapture: onImageChange
  });

  return (
    <Tabs defaultValue="upload">
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

      <TabsContent value="upload" className="mt-4">
        <ImageUploader onImageChange={onImageChange} loading={loading} />
      </TabsContent>

      <TabsContent value="camera" className="mt-4">
        <div className="text-center py-6">
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
            <p className="text-sm text-gray-500 mb-4">
              Your webcam feed should appear above. If you don&apos;t see it, check your browser permissions.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={takePhoto}
                variant="brutalism"
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
              >
                Stop Camera
              </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {!showWebcam && (
            <Button
              onClick={startCamera}
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
            onChange={handleFileInputChange}
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
            <Button 
              variant="outline" 
              size="icon" 
              className="border-2 border-black"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Shared Photo',
                    text: 'Check out this photo!',
                    url: image
                  }).catch(error => console.log('Error sharing', error));
                } else {
                  alert('Web Share API not supported in your browser');
                }
              }}
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-2 border-black"
              onClick={() => {
                const link = document.createElement('a');
                link.href = image;
                link.download = 'downloaded-photo.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </Tabs>
  );
} 