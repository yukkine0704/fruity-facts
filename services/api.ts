import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const FRUITYVICE_BASE_URL = __DEV__
  ? "https://www.fruityvice.com/api/"
  : "https://www.fruityvice.com/api/";

export const fruityApiClient: AxiosInstance = axios.create({
  baseURL: FRUITYVICE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const FDC_BASE_URL = "https://api.nal.usda.gov/fdc";
const FDC_API_KEY = process.env.VITE_FDC_API_KEY;
export const fdcApiClient: AxiosInstance = axios.create({
  baseURL: FDC_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

fruityApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(
      `🍎 FruityVice Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ FruityVice Request Error:", error);
    return Promise.reject(error);
  }
);

fruityApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ FruityVice Response: ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error("❌ FruityVice Response Error:", error.response?.status);
    return Promise.reject(error);
  }
);

fdcApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.params) {
      config.params = {};
    }
    config.params.api_key = FDC_API_KEY;

    console.log(
      `🥕 FDC Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ FDC Request Error:", error);
    return Promise.reject(error);
  }
);

fdcApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ FDC Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ FDC Response Error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.log("🔐 Invalid API key for FDC API");
    }

    if (error.response?.status === 404) {
      console.log("🔍 Food not found in FDC database");
    }

    return Promise.reject(error);
  }
);

export default fruityApiClient;
