import { WeatherData } from "./types.js";
import { ApiResponseError } from "./types.js";
import http from "https";

export function formatWeatherSummary(city: string, data: WeatherData): string {
  // pick the first available time index as "current" for this simple example
  const times = data.hourly.time || [];
  const temps = data.hourly.temperature_2m || [];
  const humidities = data.hourly.relativehumidity_2m || [];
  const idx = 0; // assume data starts at current hour

  const temp = typeof temps[idx] === "number" ? temps[idx] : null;
  const humidity = typeof humidities[idx] === "number" ? humidities[idx] : null;

  const lines: string[] = [];
  lines.push(`Weather for ${city}:`);

  if (temp !== null) {
    let emoji = "🌤️";
    let advice = "";
    if (temp <= 0) {
      emoji = "❄️";
      advice = "Dress very warmly.";
    } else if (temp <= 10) {
      emoji = "🧥";
      advice = "It's chilly — wear a jacket.";
    } else if (temp <= 20) {
      emoji = "🌤️";
      advice = "Light layers recommended.";
    } else if (temp <= 30) {
      emoji = "☀️";
      advice = "Warm — stay hydrated.";
    } else {
      emoji = "🔥";
      advice = "Very hot — avoid prolonged sun exposure.";
    }

    lines.push(`${emoji} Temperature: ${temp}°C — ${advice}`);
  } else {
    lines.push("Temperature: N/A");
  }

  if (humidity !== null) {
    let humidityNote = "";
    if (humidity < 30) humidityNote = "Dry air — consider moisturizing.";
    else if (humidity <= 60) humidityNote = "Comfortable humidity.";
    else humidityNote = "Humid — it may feel warmer than it is.";

    lines.push(`💧 Humidity: ${humidity}% — ${humidityNote}`);
  } else {
    lines.push("Humidity: N/A");
  }

  // small summary suggestion
  if (temp !== null && humidity !== null) {
    if (temp > 25 && humidity > 70) {
      lines.push("Heat index high — take care when exercising outdoors.");
    } else if (temp < 5 && humidity > 80) {
      lines.push("Cold and damp — watch for icy surfaces.");
    }
  }

  return lines.join("\n");
}

export async function getCoordinates(
  city: string
): Promise<{ latitude: number; longitude: number }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;
  return new Promise((resolve, reject) => {
    http
      .get(url, (res: any) => {
        let body = "";
        res.on("data", (chunk: any) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed && parsed.results && parsed.results.length > 0) {
              const r = parsed.results[0];
              resolve({ latitude: r.latitude, longitude: r.longitude });
            } else {
              reject(
                new ApiResponseError(
                  "GEOCODE_NOT_FOUND",
                  `Could not find coordinates for city: ${city}`
                )
              );
            }
          } catch (err) {
            reject(
              new ApiResponseError(
                "INVALID_JSON",
                "Failed to parse geocoding response"
              )
            );
          }
        });
      })
      .on("error", (err: any) => {
        reject(
          new ApiResponseError(
            "NETWORK_ERROR",
            `Network error during geocoding: ${err.message}`
          )
        );
      });
  });
}
