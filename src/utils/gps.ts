// Live GPS Geolocation Utility for MARS SPORTS

export interface GpsLocation {
  latitude: number;
  longitude: number;
  region: string;
  country: string;
  cityName: string;
}

class GpsManager {
  public async getLivePosition(): Promise<GpsLocation> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        // Fallback default (e.g. Africa / Cairo or South Africa or Europe)
        resolve({
          latitude: -26.2041,
          longitude: 28.0473,
          region: 'Africa',
          country: 'South Africa',
          cityName: 'Johannesburg',
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Estimate region based on longitude/latitude
          let region = 'Europe';
          let country = 'United Kingdom';
          let cityName = 'London';

          if (lat >= -35 && lat <= 37 && lng >= -25 && lng <= 55) {
            region = 'Africa';
            country = lat < 0 ? 'South Africa' : 'Egypt / Nigeria';
            cityName = lat < 0 ? 'Johannesburg' : 'Cairo';
          } else if (lng >= -125 && lng <= -65) {
            region = 'Americas';
            country = 'United States';
            cityName = 'New York';
          } else if (lng >= 60 && lng <= 150) {
            region = 'Asia / Oceania';
            country = 'Singapore';
            cityName = 'Singapore';
          }

          resolve({
            latitude: Number(lat.toFixed(4)),
            longitude: Number(lng.toFixed(4)),
            region,
            country,
            cityName,
          });
        },
        () => {
          // Fallback on permission denial or error
          resolve({
            latitude: 30.0444,
            longitude: 31.2357,
            region: 'Africa',
            country: 'Egypt',
            cityName: 'Cairo',
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
}

export const gpsManager = new GpsManager();
