// Environment configuration for different deployment environments

interface Config {
  apiUrl: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getConfig = (): Config => {
  // Get API URL from environment variable or use default
  const apiUrl = "https://www.cheriyanphotography.com/api";

  const environment = import.meta.env.NODE_ENV || "production";

  return {
    apiUrl,
    environment,
    isProduction: environment === "production",
  };
};

export const config = getConfig();

// Export individual values for convenience
export const { apiUrl, environment, isDevelopment, isProduction } = config;
