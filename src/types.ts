export interface AnalysisResult {
  url: string;
  status: number;
  responseTime: number;
  contentType: string;
  seo: {
    title: string;
    description: string;
  };
  security: {
    https: boolean;
    hsts: boolean;
  };
  technologies: string[];
}