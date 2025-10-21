import http from "https";
// Refactor Promise code to use async/await
export async function fetchWeatherData(city: string): Promise<any> {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
}
export async function fetchNews(): Promise<any> {
  const apiKey = "YOUR_API_KEY";
  const url = `https://dummyjson.com/posts`;
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
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
