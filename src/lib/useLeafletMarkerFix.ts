import { useEffect } from 'react';
import L from 'leaflet';

export function useLeafletMarkerFix() {
  useEffect(() => {
    // Fix for Leaflet marker icons in Next.js
    // This is needed because Next.js doesn't handle Leaflet's assets properly
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
}

export default useLeafletMarkerFix;
