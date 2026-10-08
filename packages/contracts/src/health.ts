export interface SystemHealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTimeMs?: number;
      error?: string;
    };
    storage?: {
      status: 'up' | 'down';
      bucket?: string;
    };
  };
}
