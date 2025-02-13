import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private readonly http: HttpClient) {}

  async getCurrentLocation(): Promise<{
    latitude: number,
    longitude: number,
    address: string
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await this.reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              address
            });
          } catch (error) {
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
          }
        },
        (error) => reject(new Error(this.getErrorMessage(error))),
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    });
  }

  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const response: any = await firstValueFrom(
        this.http.get(url, { headers: { 'User-Agent': 'YourAppName' } })
      );
      return response.display_name || 'Position actuelle';
    } catch {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Permission refusée - activez la géolocalisation';
      case error.POSITION_UNAVAILABLE:
        return 'Position indisponible';
      case error.TIMEOUT:
        return 'Délai de localisation dépassé';
      default:
        return 'Erreur de localisation';
    }
  }
}
