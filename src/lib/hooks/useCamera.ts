import { useState, useRef, useEffect } from 'react';

interface UseCameraOptions {
  onPhotoCapture?: (file: File) => void;
}

export default function useCamera({ onPhotoCapture }: UseCameraOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

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

  const startCamera = async () => {
    if (isMobile) {
      if (cameraRef.current) {
        cameraRef.current.click();
      }
    } else {
      try {
        // For macOS, use more specific constraints
        const isMacOS = /Mac OS X/.test(navigator.userAgent);
        
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

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');

          if (videoDevices.length === 0) {
            throw new Error("No video input devices found");
          }

          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

          if (!videoRef.current) {
            mediaStream.getTracks().forEach(track => track.stop());
            throw new Error("Video reference is not available");
          }

          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;

          if (isMacOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            try {
              await videoRef.current.play();
            } catch (error) {
              console.error("Error playing video immediately:", error);
              throw new Error("Error playing video immediately");
            }
          } else {
            videoRef.current.onloadedmetadata = async () => {
              if (videoRef.current) {
                try {
                  await videoRef.current.play();
                } catch (error) {
                  console.error("Error playing video:", error);
                  throw new Error("Error playing video");
                }
              }
            };
          }

          setStream(mediaStream);
          setShowWebcam(true);
        } catch (innerError: unknown) {
          handleCameraError(innerError);
          throw innerError;
        }
      } catch (error) {
        console.error("Error starting webcam:", error);
        alert("Failed to start webcam. Please check your browser permissions and try again.");
      }
    }
  };

  const handleCameraError = (error: unknown) => {
    if (error instanceof Error) {
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert("No camera found. Please connect a camera and try again.");
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert("Camera access denied. Please allow camera access in your browser settings.");
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        alert("Camera is in use by another application. Please close other applications using the camera.");
      } else {
        alert(`Camera error: ${error.message || error.name || "Unknown error"}`);
      }
    } else {
      alert("An unknown camera error occurred. Please try again.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setShowWebcam(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      alert("Cannot capture image. Please ensure webcam is active and try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Make sure video is playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Cannot capture image. Please ensure webcam is active and try again.");
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert("Failed to initialize photo capture. Please try again.");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
          if (onPhotoCapture) {
            onPhotoCapture(file);
          }
        } else {
          alert("Failed to capture photo. Please try again.");
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("An error occurred while capturing the photo. Please try again.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onPhotoCapture) {
      onPhotoCapture(e.target.files[0]);
    }
  };

  return {
    videoRef,
    canvasRef,
    cameraRef,
    showWebcam,
    isMobile,
    startCamera,
    stopCamera,
    takePhoto,
    handleFileInputChange
  };
} 