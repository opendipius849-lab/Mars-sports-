import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCw, Globe } from 'lucide-react';
import { gpsManager, GpsLocation } from '../utils/gps';

interface GpsBannerProps {
  onRegionDetected: (region: string) => void;
}

export const GpsBanner: React.FC<GpsBannerProps> = ({ onRegionDetected }) => {
  const [gpsData, setGpsData] = useState<GpsLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchGps = async () => {
    setIsLoading(true);
    const loc = await gpsManager.getLivePosition();
    setGpsData(loc);
    setIsLoading(false);
    onRegionDetected(loc.region);
  };

  useEffect(() => {
    fetchGps();
  }, []);

  if (!gpsData) return null;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-xs py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
          </span>
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              Live GPS: <strong className="text-white">{gpsData.cityName}, {gpsData.country}</strong>
            </span>
            <span className="hidden md:inline text-slate-500 font-mono text-[10px]">
              ({gpsData.latitude}°, {gpsData.longitude}°)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
            Region: {gpsData.region}
          </span>
          <button
            onClick={fetchGps}
            disabled={isLoading}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh GPS Location"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
