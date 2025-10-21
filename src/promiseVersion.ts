import http from "https";
export function fetchWeatherData(city: string): Promise<any> {
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
export function fetchNews(): Promise<any> {
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
fetchWeatherData("London")
  .then((weatherData) => {
    console.log("Weather Data:", weatherData);
    return fetchNews();
  })
  .then((newsData) => {
    console.log("News Data:", newsData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
// Implement Promise.all() and Promise.race() examples
Promise.all([fetchWeatherData("London"), fetchNews()])
  .then(([weatherData, newsData]) => {
    console.log("Promise.all - Weather Data:", weatherData);
    console.log("Promise.all - News Data:", newsData);
  })
  .catch((error) => {
    console.error("Promise.all Error:", error);
  });
Promise.race([fetchWeatherData("London"), fetchNews()])
  .then((firstData) => {
    console.log("Promise.race - First Data:", firstData);
  })
  .catch((error) => {
    console.error("Promise.race Error:", error);
  });
