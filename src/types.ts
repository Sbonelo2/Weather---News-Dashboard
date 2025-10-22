export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  hourly: {
    temperature_2m: number[];
    time: string[];
  };
}

export interface NewsData {
  posts: Array<{
    id: number;
    title: string;
    body: string;
  }>;
  total: number;
  skip: number;
  limit: number;
}

export class ApiResponseError extends Error {
  constructor(
    public code: string,
    message: string,
    public timestamp: string = new Date().toISOString()
  ) {
    super(message);
    this.name = "ApiResponseError";
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
    };
  }

  static format(error: Error | ApiResponseError | unknown): ApiError {
    if (error instanceof ApiResponseError) {
      return error.toJSON();
    }
    return {
      code: "UNKNOWN_ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      timestamp: new Date().toISOString(),
    };
  }
}
