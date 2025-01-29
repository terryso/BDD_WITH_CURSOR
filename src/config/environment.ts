export enum Environment {
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export interface EnvironmentConfig {
  apiBaseUrl: string;
  isTestMode: boolean;
}

export const getConfig = (env: Environment = Environment.TEST): EnvironmentConfig => {
  switch (env) {
    case Environment.TEST:
      return {
        apiBaseUrl: 'mock://api',
        isTestMode: true
      };
    case Environment.STAGING:
      return {
        apiBaseUrl: 'https://staging.gmgn.ai',
        isTestMode: false
      };
    case Environment.PRODUCTION:
      return {
        apiBaseUrl: 'https://gmgn.ai',
        isTestMode: false
      };
  }
}; 