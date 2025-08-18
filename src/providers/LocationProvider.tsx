import React, { useEffect, useRef } from "react";
import { locationState } from "@/domain/state";
import { LocationService } from "@/services/location-service";
import { Constants } from "@/domain/constants";

interface LocationProviderProps {
  children: React.ReactNode;
}

/**
 * LocationProvider component that handles app-level location detection.
 * This component should wrap the entire app to ensure location is detected
 * once when the app initializes, regardless of which page the user lands on.
 */
export const LocationProvider: React.FC<LocationProviderProps> = ({ 
  children
}) => {
  const location = locationState((state) => state.userLocation);
  const setLocation = locationState((state) => state.setLocation);
  const locationService = useRef(new LocationService());
  const hasAttemptedLocation = useRef(false);
  

  useEffect(() => {
    // Check if we should attempt location detection
    const shouldDetectLocation = !hasAttemptedLocation.current && (
      location === null            // No location stored
    );

    if (shouldDetectLocation) {
      hasAttemptedLocation.current = true;
      detectUserLocation();
    }
  }, [location, setLocation]);

  /**
   * Attempts to detect the user's location using the LocationService.
   * This runs silently in the background without blocking the UI.
   */
  const detectUserLocation = async () => {
    try {
      const result = await locationService.current.getCurrentLocation();
      
      if (result.success && result.countryCode) {
        setLocation(result.countryCode);
        // Store the detection timestamp
        localStorage.setItem(Constants.LOCAL_STORAGE_LOCATION_LAST_DETECTION, Date.now().toString());
      }
    } catch (error) {
      // Do not set any fallback location on error.
    }
  };
  // This provider doesn't render any UI, it just manages location detection
  return <>{children}</>;
};

export default LocationProvider;
