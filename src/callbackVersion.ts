import { log } from "console";
import http from "https";
function fetchWeatherData(city: string, callback: (data: any) => void): void {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;
  http
    .get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        callback(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.error(err);
      callback(null);
    });
}
function fetchNews(callback: (data: any) => void): void {
  const apiKey = "YOUR_API_KEY";
  const url = `https://dummyjson.com/posts`;
  http
    .get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        callback(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.error(err);
      callback(null);
    });
}
fetchWeatherData("London", (weatherData) => {
  if (weatherData) {
    log("Weather Data:", weatherData);
    fetchNews((newsData) => {
      if (newsData) {
        log("News Data:", newsData);
      }
    });
  }
});
// Example usage:
