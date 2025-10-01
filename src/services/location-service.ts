import api from "@/api";
import { LocationModel } from "@/domain/models/LocationModel";

export interface LocationResult {
  success: boolean;
  countryCode?: string;
  error?: string;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

/**
 * Service for handling user location detection and management.
 * Provides methods for geolocation, country detection, and location persistence.
 */
export class LocationService {
  private static readonly GEOLOCATION_TIMEOUT = 10000; // 10 seconds
  private static readonly GEOLOCATION_OPTIONS: PositionOptions = {
    enableHighAccuracy: false,
    timeout: LocationService.GEOLOCATION_TIMEOUT,
    maximumAge: 300000, // 5 minutes
  };

  /**
   * Attempts to get the user's current location using browser geolocation API.
   * @returns Promise resolving to LocationResult with success status and country code
   */
  public async getCurrentLocation(): Promise<LocationResult> {
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        return {
          success: false,
          error: "Geolocation not supported by this browser",
        };
      }

      // Get user's coordinates
      const position = await this.getCurrentPosition();

      // Convert coordinates to country code
      const countryCode = await this.coordinatesToCountry(position);

      return {
        success: true,
        countryCode,
      };
    } catch (error) {
      console.error("Failed to get current location:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Wraps the browser's geolocation API in a Promise for async/await usage.
   * Resolves with latitude and longitude if successful, or rejects with an error message.
   */
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Failed to get location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        LocationService.GEOLOCATION_OPTIONS
      );
    });
  }

  /**
   * Converts latitude/longitude coordinates to country code using backend API
   * @param position The latitude/longitude coordinates
   * @returns Promise resolving to country code string
   */
  private async coordinatesToCountry(
    position: GeolocationPosition
  ): Promise<string> {
    try {
      // Use relative path, let api handle baseURL
      const response = await api.post("/api/location/coordinates-to-country", {
        latitude: position.latitude,
        longitude: position.longitude,
      });
      return response.data.country_code;
    } catch (error) {
      console.error("Failed to convert coordinates to country:", error);
      throw new Error("Failed to determine country from location");
    }
  }

  /**
   * Validates if a country code is valid (basic validation)
   * @param countryCode The country code to validate
   * @returns boolean indicating if the country code is valid
   */
  public isValidCountryCode(countryCode: string): boolean {
    // Basic validation - country codes are typically 2 characters
    return (
      typeof countryCode === "string" &&
      countryCode.length === 2 &&
      /^[a-zA-Z]{2}$/.test(countryCode)
    );
  }

  /**
   * Retrieves all current locations available for products.
   */
  async getLocations(): Promise<LocationModel[]> {
    try {
      const response = await api.get("/api/location");
      return response.data;
    } catch (error) {
      throw new Error("Failed to get product locations.");
    }
  }
}
