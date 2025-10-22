import http from "https";
import { ApiResponseError, WeatherData, NewsData } from "./types.js";

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;

  try {
    const data = await new Promise<WeatherData>((resolve, reject) => {
      http
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(
              new ApiResponseError(
                "WEATHER_API_ERROR",
                `Failed to fetch weather data: HTTP ${res.statusCode}`
              )
            );
            return;
          }

          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(
                new ApiResponseError(
                  "INVALID_JSON",
                  "Failed to parse weather API response"
                )
              );
            }
          });
        })
        .on("error", (err) => {
          reject(
            new ApiResponseError(
              "NETWORK_ERROR",
              `Network error while fetching weather data: ${err.message}`
            )
          );
        });
    });

    return data;
  } catch (error) {
    throw ApiResponseError.format(error);
  }
}
export async function fetchNews(): Promise<NewsData> {
  const apiKey = "YOUR_API_KEY";
  const url = `https://dummyjson.com/posts`;

  try {
    const data = await new Promise<NewsData>((resolve, reject) => {
      http
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(
              new ApiResponseError(
                "NEWS_API_ERROR",
                `Failed to fetch news data: HTTP ${res.statusCode}`
              )
            );
            return;
          }

          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(
                new ApiResponseError(
                  "INVALID_JSON",
                  "Failed to parse news API response"
                )
              );
            }
          });
        })
        .on("error", (err) => {
          reject(
            new ApiResponseError(
              "NETWORK_ERROR",
              `Network error while fetching news data: ${err.message}`
            )
          );
        });
    });

    return data;
  } catch (error) {
    throw ApiResponseError.format(error);
  }
}
// Example usage:
async function displayData() {
  try {
    const weatherData = await fetchWeatherData("London");
    console.log("Weather Data:", weatherData);
    const newsData = await fetchNews();
    console.log("News Data:", newsData);
  } catch (error) {
    console.error("Error:", error);
  }
}
displayData();
