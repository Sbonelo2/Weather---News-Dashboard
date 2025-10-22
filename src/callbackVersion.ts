import { log } from "console";
import http from "https";
import { ApiResponseError, WeatherData, NewsData } from "./types.js";

// Get city from command line arguments
const city = process.argv[2];
if (!city) {
  log("Error: Please provide a city name as an argument");
  log("Usage: node dist/callbackVersion.js <city>");
  process.exit(1);
}

type ErrorCallback<T> = (
  error: ApiResponseError | null,
  data: T | null
) => void;

function fetchWeatherData(
  city: string,
  callback: ErrorCallback<WeatherData>
): void {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;

  http
    .get(url, (res) => {
      if (res.statusCode !== 200) {
        callback(
          new ApiResponseError(
            "WEATHER_API_ERROR",
            `Failed to fetch weather data: HTTP ${res.statusCode}`
          ),
          null
        );
        return;
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data) as WeatherData;
          callback(null, parsedData);
        } catch (error) {
          callback(
            new ApiResponseError(
              "INVALID_JSON",
              "Failed to parse weather API response"
            ),
            null
          );
        }
      });
    })
    .on("error", (err) => {
      callback(
        new ApiResponseError(
          "NETWORK_ERROR",
          `Network error while fetching weather data: ${err.message}`
        ),
        null
      );
    });
}
function fetchNews(callback: ErrorCallback<NewsData>): void {
  const apiKey = "YOUR_API_KEY";
  const url = `https://dummyjson.com/posts`;

  http
    .get(url, (res) => {
      if (res.statusCode !== 200) {
        callback(
          new ApiResponseError(
            "NEWS_API_ERROR",
            `Failed to fetch news data: HTTP ${res.statusCode}`
          ),
          null
        );
        return;
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data) as NewsData;
          callback(null, parsedData);
        } catch (error) {
          callback(
            new ApiResponseError(
              "INVALID_JSON",
              "Failed to parse news API response"
            ),
            null
          );
        }
      });
    })
    .on("error", (err) => {
      callback(
        new ApiResponseError(
          "NETWORK_ERROR",
          `Network error while fetching news data: ${err.message}`
        ),
        null
      );
    });
}
// Run the application with the provided city
fetchWeatherData(city, (weatherError, weatherData) => {
  if (weatherError) {
    log("Weather Error:", ApiResponseError.format(weatherError));
    return;
  }

  log("Weather Data:", weatherData);

  fetchNews((newsError, newsData) => {
    if (newsError) {
      log("News Error:", ApiResponseError.format(newsError));
      return;
    }

    log("News Data:", newsData);
  });
});
