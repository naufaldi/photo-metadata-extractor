import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

export function convertDMSToDD(dms: number[], ref: string): string {
  if (!dms || dms.length < 3) return 'Unknown';

  const degrees = dms[0];
  const minutes = dms[1];
  const seconds = dms[2];

  let dd = degrees + minutes / 60 + seconds / 3600;

  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }

  return dd.toFixed(6);
}

export type ExifDataType = Record<string, unknown>;

export interface MetadataType {
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
}

export function processMetadata(
  exifData: ExifDataType,
  file: File
): MetadataType {
  const basicMetadata = {
    filename: file.name,
    filesize: formatFileSize(file.size),
    filetype: file.type,
    dimensions:
      exifData.PixelXDimension && exifData.PixelYDimension
        ? `${exifData.PixelXDimension} × ${exifData.PixelYDimension}`
        : 'Unknown',
    dateTime: (exifData.DateTime as string) || 'Unknown',
  };

  const locationMetadata = {
    latitude: exifData.GPSLatitude
      ? convertDMSToDD(
          exifData.GPSLatitude as number[],
          exifData.GPSLatitudeRef as string
        )
      : 'Unknown',
    longitude: exifData.GPSLongitude
      ? convertDMSToDD(
          exifData.GPSLongitude as number[],
          exifData.GPSLongitudeRef as string
        )
      : 'Unknown',
    altitude: exifData.GPSAltitude ? `${exifData.GPSAltitude} m` : 'Unknown',
  };

  const cameraMetadata = {
    make: (exifData.Make as string) || 'Unknown',
    model: (exifData.Model as string) || 'Unknown',
    aperture: exifData.FNumber ? `f/${exifData.FNumber}` : 'Unknown',
    shutterSpeed: exifData.ExposureTime
      ? `1/${Math.round(1 / (exifData.ExposureTime as number))}`
      : 'Unknown',
    iso: (exifData.ISOSpeedRatings as string) || 'Unknown',
    focalLength: exifData.FocalLength
      ? `${exifData.FocalLength} mm`
      : 'Unknown',
    flash:
      exifData.Flash !== undefined
        ? (exifData.Flash as number) === 1
          ? 'On'
          : 'Off'
        : 'Unknown',
  };

  const softwareMetadata = {
    software: (exifData.Software as string) || 'Unknown',
    creator: (exifData.Artist as string) || 'Unknown',
    copyright: (exifData.Copyright as string) || 'Unknown',
  };

  return {
    basic: basicMetadata,
    location: locationMetadata,
    camera: cameraMetadata,
    software: softwareMetadata,
    raw: exifData,
  };
}
