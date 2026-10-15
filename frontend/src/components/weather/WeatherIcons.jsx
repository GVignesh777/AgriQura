import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
  Droplets,
  AlertTriangle,
} from 'lucide-react';

export default function WeatherIcon({ icon = 'partly-cloudy', className = 'w-6 h-6' }) {
  switch (icon) {
    case 'clear-sky':
    case 'sunny':
      return <Sun className={`${className} text-amber-400`} />;
    case 'mainly-clear':
    case 'partly-cloudy':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'overcast':
    case 'cloudy':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} />;
    case 'rain-light':
    case 'showers-light':
      return <CloudDrizzle className={`${className} text-blue-400`} />;
    case 'rain-moderate':
    case 'showers-moderate':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'rain-heavy':
    case 'showers-heavy':
      return <CloudRain className={`${className} text-indigo-400 animate-pulse`} />;
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return <CloudLightning className={`${className} text-amber-400 animate-bounce`} />;
    case 'snow':
    case 'snow-heavy':
    case 'freezing-rain':
      return <Snowflake className={`${className} text-cyan-300`} />;
    case 'windy':
      return <Wind className={`${className} text-emerald-400`} />;
    default:
      return <CloudSun className={`${className} text-amber-300`} />;
  }
}
