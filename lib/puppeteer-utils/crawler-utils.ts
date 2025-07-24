import { Page, ElementHandle } from 'puppeteer';

export interface WaitOptions {
  timeout?: number;
  visible?: boolean;
  hidden?: boolean;
}

export interface ClickOptions {
  delay?: number;
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
  waitAfter?: string;
}

export interface ScrollOptions {
  direction?: 'up' | 'down';
  distance?: number;
  smooth?: boolean;
  delay?: number;
}

export class CrawlerUtils {
  /**
   * Wait for element to appear on page
   */
  static async waitForElement(
    page: Page, 
    selector: string, 
    options: WaitOptions = {}
  ): Promise<boolean> {
    const { timeout = 5000, visible = true } = options;
    
    try {
      await page.waitForSelector(selector, { timeout, visible });
      return true;
    } catch (error) {
      console.warn(`⚠️  Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  /**
   * Extract text content from element
   */
  static async extractText(page: Page, selector: string): Promise<string> {
    try {
      const element = await page.$(selector);
      if (!element) return '';
      
      const text = await page.evaluate(el => el.textContent?.trim() || '', element);
      return text;
    } catch (error) {
      console.warn(`⚠️  Failed to extract text from ${selector}:`, error);
      return '';
    }
  }

  /**
   * Extract text from multiple elements
   */
  static async extractMultipleTexts(page: Page, selector: string): Promise<string[]> {
    try {
      return await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements).map(el => el.textContent?.trim() || '');
      }, selector);
    } catch (error) {
      console.warn(`⚠️  Failed to extract multiple texts from ${selector}:`, error);
      return [];
    }
  }

  /**
   * Extract attribute value from element
   */
  static async extractAttribute(
    page: Page, 
    selector: string, 
    attribute: string
  ): Promise<string> {
    try {
      const element = await page.$(selector);
      if (!element) return '';
      
      const value = await page.evaluate(
        (el, attr) => el.getAttribute(attr) || '', 
        element, 
        attribute
      );
      return value;
    } catch (error) {
      console.warn(`⚠️  Failed to extract ${attribute} from ${selector}:`, error);
      return '';
    }
  }

  /**
   * Click element and optionally wait for another element
   */
  static async clickAndWait(
    page: Page, 
    selector: string, 
    options: ClickOptions = {}
  ): Promise<void> {
    const { delay = 0, waitAfter } = options;
    
    try {
      await page.click(selector, { delay });
      
      if (waitAfter) {
        await this.waitForElement(page, waitAfter);
      }
    } catch (error) {
      console.error(`❌ Failed to click ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Scroll page in specified direction
   */
  static async scroll(page: Page, options: ScrollOptions = {}): Promise<void> {
    const { 
      direction = 'down', 
      distance = 500, 
      smooth = true, 
      delay = 1000 
    } = options;
    
    try {
      await page.evaluate((dir, dist, smoothScroll) => {
        const scrollTop = dir === 'down' ? dist : -dist;
        window.scrollBy({
          top: scrollTop,
          behavior: smoothScroll ? 'smooth' : 'auto'
        });
      }, direction, distance, smooth);
      
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error(`❌ Failed to scroll:`, error);
      throw error;
    }
  }

  /**
   * Scroll to bottom of page
   */
  static async scrollToBottom(page: Page, options: { maxScrolls?: number } = {}): Promise<void> {
    const { maxScrolls = 10 } = options;
    
    try {
      let scrollCount = 0;
      let previousHeight = 0;
      
      while (scrollCount < maxScrolls) {
        const currentHeight = await page.evaluate(() => document.body.scrollHeight);
        
        if (currentHeight === previousHeight) {
          break; // No more content to load
        }
        
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await page.waitForTimeout(1000);
        previousHeight = currentHeight;
        scrollCount++;
      }
    } catch (error) {
      console.error(`❌ Failed to scroll to bottom:`, error);
      throw error;
    }
  }

  /**
   * Wait for navigation to complete
   */
  static async waitForNavigation(
    page: Page, 
    options: { timeout?: number; waitUntil?: 'load' | 'networkidle0' | 'networkidle2' } = {}
  ): Promise<void> {
    const { timeout = 30000, waitUntil = 'networkidle2' } = options;
    
    try {
      await page.waitForNavigation({ timeout, waitUntil });
    } catch (error) {
      console.error(`❌ Navigation timeout:`, error);
      throw error;
    }
  }

  /**
   * Take screenshot of element or full page
   */
  static async takeScreenshot(
    page: Page, 
    options: {
      path?: string;
      selector?: string;
      fullPage?: boolean;
      quality?: number;
    } = {}
  ): Promise<Buffer> {
    const { 
      path, 
      selector, 
      fullPage = true, 
      quality = 80 
    } = options;
    
    try {
      let screenshotOptions: any = {
        type: 'jpeg',
        quality,
        fullPage
      };
      
      if (path) {
        screenshotOptions.path = path;
      }
      
      if (selector) {
        const element = await page.$(selector);
        if (element) {
          return await element.screenshot(screenshotOptions);
        }
      }
      
      return await page.screenshot(screenshotOptions);
    } catch (error) {
      console.error(`❌ Failed to take screenshot:`, error);
      throw error;
    }
  }

  /**
   * Type text with human-like delays
   */
  static async typeText(
    page: Page, 
    selector: string, 
    text: string, 
    options: { delay?: number; clear?: boolean } = {}
  ): Promise<void> {
    const { delay = 100, clear = true } = options;
    
    try {
      if (clear) {
        await page.click(selector, { clickCount: 3 }); // Select all
      }
      
      await page.type(selector, text, { delay });
    } catch (error) {
      console.error(`❌ Failed to type text into ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Wait for element to be visible and enabled
   */
  static async waitForInteractable(
    page: Page, 
    selector: string, 
    timeout: number = 5000
  ): Promise<boolean> {
    try {
      await page.waitForFunction(
        (sel) => {
          const element = document.querySelector(sel) as HTMLElement;
          return element && 
                 element.offsetParent !== null && // visible
                 !element.hasAttribute('disabled'); // enabled
        },
        { timeout },
        selector
      );
      return true;
    } catch (error) {
      console.warn(`⚠️  Element ${selector} not interactable within ${timeout}ms`);
      return false;
    }
  }

  /**
   * Get element count
   */
  static async getElementCount(page: Page, selector: string): Promise<number> {
    try {
      return await page.evaluate((sel) => {
        return document.querySelectorAll(sel).length;
      }, selector);
    } catch (error) {
      console.warn(`⚠️  Failed to count elements for ${selector}:`, error);
      return 0;
    }
  }
}