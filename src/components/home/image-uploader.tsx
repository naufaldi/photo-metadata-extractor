// components/ImageUploader.jsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcons } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  loading: boolean;
}

const ImageUploader = ({ onImageChange, loading }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageChange(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      <form
        className="w-full flex flex-col items-center justify-center"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <motion.div
          className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer min-h-[200px] ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onButtonClick}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          animate={{
            borderColor: dragActive ? '#3B82F6' : '#D1D5DB',
            backgroundColor: dragActive ? '#EFF6FF' : '#F9FAFB'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {loading ? (
            <div className="text-center w-full max-w-xs">
              <p className="mb-4 font-medium">Processing image...</p>
              <Progress value={66} className="h-2 mb-2" />
            </div>
          ) : (
            <>
              <div className="p-4 bg-blue-400 rounded-lg mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <Upload className="text-black w-10 h-10" />
              </div>
              <p className="font-medium mb-2">Drag & drop an image here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <Button
                type="button"
                className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all"
                onClick={onButtonClick}
              >
                <ImageIcons className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
            </>
          )}
        </motion.div>
      </form>
    </div>
  );
};

export default ImageUploader;