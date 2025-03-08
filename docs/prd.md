# Product Requirements Document: Photo Metadata Extractor

## Overview

A responsive, mobile-first web application that extracts and displays metadata from user photos. The application will allow users to upload existing photos or take new ones, then extract and display key information such as filename, geolocation, timestamp, and device information.

## Target Platforms

- Primary: Mobile web (responsive design)
- Secondary: Desktop web

## Key Features

### 1. Photo Input Methods

- **Upload existing photo**: Users can select photos from their device storage
- **Take new photo**: Users can use their device camera to take a new photo directly from the app

### 2. Core Metadata Extraction

The application will extract and display:

- Image filename
- Geographic coordinates (latitude/longitude)
- Date and time the photo was taken
- Device information (camera/phone model)

### 3. Example Visualization

- Interactive example showing extracted metadata from sample images
- Clear visualization of what information will be available before users upload their own photos

### 4. Detailed Metadata View

- Comprehensive display of all available metadata
- Option to toggle between basic and advanced information views

## Technical Requirements

### Frontend Stack

- Next.js (latest version)
- React 19
- Tailwind CSS v4
- shadcn/ui component library

### Metadata Extraction

- Use of Exif.js or similar library to extract EXIF metadata
- Fallback mechanisms for photos without complete metadata
- Proper error handling for corrupted images or unsupported formats

### Responsive Design

- Mobile-first approach using Tailwind's responsive classes
- Optimized UI for various screen sizes and orientations
- Touch-friendly controls for mobile users

## Additional Extractable Metadata

Beyond the core requirements, the application could extract:

1. **Technical Photo Information**

   - Resolution/dimensions (width × height)
   - File size
   - Image format (JPEG, PNG, etc.)
   - Color space information

2. **Camera Settings**

   - Aperture (f-stop)
   - Shutter speed
   - ISO setting
   - Focal length
   - Flash information (on/off)
   - White balance setting

3. **Location Context**

   - Reverse geocoding to show actual location name
   - Altitude information
   - Direction/compass heading (if available)

4. **Software Information**

   - Software used to edit the photo
   - Editing history (if available)

5. **Advanced Metadata**

   - Copyright information
   - Camera serial number (if present)
   - Lens model
   - Owner information (if embedded)

6. **AI-Enhanced Features**
   - Image content analysis/tagging
   - Scene recognition
   - Object detection
   - Face detection (with privacy controls)

## User Flow

1. User lands on application homepage
2. User views example metadata extraction to understand the app's functionality
3. User selects either "Upload Photo" or "Take Photo"
4. After photo acquisition, application processes and displays extracted metadata
5. User can toggle between basic/advanced views or explore additional information
6. Option to download metadata as JSON or share results

## Layout Requirements

### Desktop Layout

1. Two-column grid layout:
   - Right side: Photo display area taking approximately 50% of screen width
   - Left side: Metadata information panel
   - Core metadata (filename, coordinates, time, device) displayed prominently at top
   - "Show more" toggle/accordion to reveal advanced metadata information in a grid layout below basic information
   - Each metadata category organized in its own card/section within the grid

### Mobile Layout

1. Vertical stack layout (top to bottom):
   - Basic metadata information (filename, coordinates, time, device) at the top
   - "Show more" toggle/accordion to expand and show advanced metadata
   - Advanced information sections displayed in collapsible panels
   - Photo displayed at the bottom of the screen
   - Swipe gestures to toggle between metadata sections
   - Pinch-to-zoom functionality for the photo

## Additional Features

### 1. Location Context

- **Precise Location Visualization**: A button next to the coordinates that opens an embedded map showing exactly where the photo was taken
- **Location Type Inference**: AI-assisted suggestions about the environment (coffee shop, park, street, indoors, outdoors)
- **Distance from User**: How far the photo location is from the user's current location
- **Popular Landmarks**: Identification of nearby landmarks if the photo was taken near one

### 2. Temporal Context

- **Time Context**: Not just the exact time but contextual information like "Late Evening" or "Early Morning"
- **Day of Week**: Indicating if it was a weekend or weekday which provides social context
- **Season Detection**: Based on date and possibly image analysis
- **Cultural Events**: Flag if the photo was taken during major holidays or events based on the date

### 3. Authenticity Indicators

- **Metadata Integrity Check**: Visual indicator showing if metadata appears complete or if it's been stripped/modified
- **Platform Fingerprint**: Detection of social media processing signatures (many platforms strip or modify EXIF data)
- **Editing History**: Information about whether and when the photo was edited after being taken
- **AI-Generated Content Warning**: Detection of patterns consistent with AI-generated images

### 4. Privacy Awareness

- **Privacy Alert System**: Warning if sensitive location data is present (like home location)
- **Explanation of Missing Data**: Contextual explanation for why data might be missing ("This image likely came from WhatsApp, which removes metadata")
- **Data Sharing Guide**: Information about what metadata might be shared when they post this photo online

### 5. Social Context

- **Device Popularity**: Information about how common the device is (providing socioeconomic context)
- **App Detection**: Identifying if the photo was taken with a specific app (Instagram, Snapchat) versus the native camera
- **Common Usage Patterns**: Information about typical uses for images with similar characteristics

### 6. Environmental Context

- **Weather Conditions**: Cross-referencing the location and time with historical weather data
- **Light Conditions**: Estimation of natural lighting conditions based on time, date, and exposure data
- **Urban/Rural Classification**: Classification of the environment based on coordinates

### 7. Correlation Features

- **Image Series Detection**: Identifying if the image belongs to a series taken at the same time/place
- **Similar Images**: Finding other images with similar metadata characteristics in the user's library
- **Timeline Visualization**: Placing the image in context with other images from the same day

### 8. Forensic Analysis Features

- **Inconsistency Detection**: Flagging inconsistencies between metadata elements that might indicate tampering
- **Darkweb/Screenshot Detection**: Identifying patterns consistent with screenshots or images downloaded from suspicious sources
- **Visual vs Metadata Comparison**: AI-assisted comparison between visual elements and metadata (e.g., does the lighting match the time of day?)
