"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
} from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
  country: string;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Weather icon mapping
const getWeatherIcon = (iconCode: string) => {
  const code = iconCode.slice(0, 2);
  switch (code) {
    case "01":
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case "02":
    case "03":
    case "04":
      return <Cloud className="h-4 w-4 text-gray-400" />;
    case "09":
    case "10":
      return <CloudRain className="h-4 w-4 text-blue-400" />;
    case "11":
      return <CloudLightning className="h-4 w-4 text-yellow-400" />;
    case "13":
      return <CloudSnow className="h-4 w-4 text-blue-200" />;
    case "50":
      return <CloudFog className="h-4 w-4 text-gray-400" />;
    default:
      return <Cloud className="h-4 w-4 text-gray-400" />;
  }
};

// Weather description translation
const translateWeather = (description: string): string => {
  const translations: Record<string, string> = {
    "clear sky": "Cerah",
    "few clouds": "Berawan Sebagian",
    "scattered clouds": "Berawan",
    "broken clouds": "Berawan Tebal",
    "overcast clouds": "Mendung",
    "shower rain": "Hujan Ringan",
    rain: "Hujan",
    "light rain": "Gerimis",
    "moderate rain": "Hujan Sedang",
    "heavy intensity rain": "Hujan Lebat",
    thunderstorm: "Badai Petir",
    snow: "Salju",
    mist: "Berkabut",
    fog: "Kabut",
    haze: "Kabut Asap",
    smoke: "Berasap",
    dust: "Berdebu",
  };
  return translations[description.toLowerCase()] || description;
};

export function LocationWeatherWidget() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get location and weather
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // First try to get location from IP (fallback)
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();

        let lat = ipData.latitude;
        let lon = ipData.longitude;
        let city = ipData.city;
        let country = ipData.country_name;

        // Try to get more accurate location from browser
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: false,
                  timeout: 5000,
                  maximumAge: 300000, // Cache for 5 minutes
                });
              }
            );
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            // Reverse geocode to get city name
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
            );
            const geoData = await geoResponse.json();
            city = geoData.city || geoData.locality || city;
            country = geoData.countryName || country;
          } catch {
            // Use IP-based location as fallback
            console.log("Using IP-based location");
          }
        }

        setLocation({ city, country, latitude: lat, longitude: lon });

        // Get weather data from Open-Meteo (free, no API key needed)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        // Map weather code to description and icon
        const weatherCode = weatherData.current.weather_code;
        const { description, icon } = getWeatherDescription(weatherCode);

        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          description,
          icon,
          city,
          country,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error getting location/weather:", err);
        setError("Tidak dapat memuat data");
        setLoading(false);
      }
    };

    getLocationAndWeather();
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-xs text-muted-foreground animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    );
  }

  if (error) {
    return null; // Hide widget on error
  }

  return (
    <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground flex-wrap">
      {/* Time & Date */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span className="font-medium">{formatTime(currentTime)}</span>
        <span className="hidden sm:inline text-muted-foreground/70">|</span>
        <span className="hidden sm:inline">{formatDate(currentTime)}</span>
      </div>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {location.city}, {location.country}
          </span>
        </div>
      )}

      {/* Weather */}
      {weather && (
        <div className="flex items-center gap-1.5">
          {getWeatherIcon(weather.icon)}
          <span>{weather.temp}°C</span>
          <span className="hidden md:inline text-muted-foreground/70">
            {translateWeather(weather.description)}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function to map Open-Meteo weather codes to descriptions
function getWeatherDescription(code: number): {
  description: string;
  icon: string;
} {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: "Clear sky", icon: "01d" },
    1: { description: "Mainly clear", icon: "02d" },
    2: { description: "Partly cloudy", icon: "03d" },
    3: { description: "Overcast", icon: "04d" },
    45: { description: "Fog", icon: "50d" },
    48: { description: "Depositing rime fog", icon: "50d" },
    51: { description: "Light drizzle", icon: "09d" },
    53: { description: "Moderate drizzle", icon: "09d" },
    55: { description: "Dense drizzle", icon: "09d" },
    61: { description: "Slight rain", icon: "10d" },
    63: { description: "Moderate rain", icon: "10d" },
    65: { description: "Heavy rain", icon: "10d" },
    71: { description: "Slight snow", icon: "13d" },
    73: { description: "Moderate snow", icon: "13d" },
    75: { description: "Heavy snow", icon: "13d" },
    80: { description: "Slight rain showers", icon: "09d" },
    81: { description: "Moderate rain showers", icon: "09d" },
    82: { description: "Violent rain showers", icon: "09d" },
    95: { description: "Thunderstorm", icon: "11d" },
    96: { description: "Thunderstorm with hail", icon: "11d" },
    99: { description: "Thunderstorm with heavy hail", icon: "11d" },
  };

  return weatherCodes[code] || { description: "Unknown", icon: "03d" };
}
