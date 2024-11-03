export interface TechnologyStack {
  languages: string[];
  frameworks: string[];
  libraries: string[];
  cms?: string;
}

export interface Database {
  type: string;
  size?: string;
  optimizations?: string[];
}

export interface Integration {
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'deprecated';
}

export interface Plugin {
  name: string;
  version: string;
  status: 'active' | 'inactive';
}

export interface ContentAsset {
  type: 'image' | 'video' | 'document';
  location: string;
  size?: string;
}

export interface SEOData {
  keywords: string[];
  metadata: Record<string, string>;
  ranking?: number;
}

export interface Navigation {
  primary: string[];
  secondary: string[];
  tertiary?: string[];
}

export interface Performance {
  loadTime: string;
  cacheStrategy?: string;
  bottlenecks?: string[];
}

export interface Security {
  ssl: boolean;
  protocols: string[];
  vulnerabilities?: string[];
}

export interface Analytics {
  provider: string;
  metrics: Record<string, number>;
}

export interface SiteAudit {
  id: string;
  url: string;
  lastUpdated: Date;
  stack: TechnologyStack;
  database: Database;
  integrations: Integration[];
  plugins: Plugin[];
  content: {
    assets: ContentAsset[];
    seo: SEOData;
  };
  navigation: Navigation;
  performance: Performance;
  security: Security;
  analytics: Analytics;
  totalPages: number;
}