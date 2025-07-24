import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

export interface BrowserConfig extends LaunchOptions {
  viewport?: {
    width: number;
    height: number;
  };
  userAgent?: string;
  defaultTimeout?: number;
  slowMo?: number;
  headless?: boolean;
}

export class BrowserManager {
  private browser: Browser | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig = {}) {
    this.config = {
      headless: false,
      slowMo: 100,
      // args: ['--no-sandbox', '--disable-setuid-sandbox'], // Removed for compatibility
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      defaultTimeout: 30000,
      ...config
    };
  }

  async launch(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch(this.config);
    
    // Handle browser events
    this.browser.on('disconnected', () => {
      console.log('🔌 Browser disconnected');
      this.browser = null;
    });

    return this.browser;
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      await this.launch();
    }

    if (!this.browser) {
      throw new Error('Failed to launch browser');
    }

    const page = await this.browser.newPage();
    
    // Configure page
    if (this.config.viewport) {
      await page.setViewport(this.config.viewport);
    }
    
    if (this.config.userAgent) {
      await page.setUserAgent(this.config.userAgent);
    }

    if (this.config.defaultTimeout) {
      page.setDefaultTimeout(this.config.defaultTimeout);
    }

    // Add page event listeners
    page.on('console', (msg) => {
      console.log(`📄 PAGE LOG: ${msg.text()}`);
    });

    page.on('pageerror', (error) => {
      console.error(`📄 PAGE ERROR: ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      console.warn(`📄 REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
    });

    return page;
  }

  async close(): Promise<void> {
    if (this.browser) {
      console.log('🔒 Closing browser...');
      await this.browser.close();
      this.browser = null;
    }
  }

  async closeAllPages(): Promise<void> {
    if (!this.browser) return;

    const pages = await this.browser.pages();
    await Promise.all(pages.map(page => page.close()));
  }

  getBrowser(): Browser | null {
    return this.browser;
  }

  isLaunched(): boolean {
    return this.browser !== null;
  }
}