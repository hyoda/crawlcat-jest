/**
 * E-commerce Crawling Test Example
 * 
 * This file demonstrates how to use Jest + Puppeteer for e-commerce crawling:
 * - Browser automation with BrowserManager
 * - Product information extraction
 * - Error handling and retries
 * - Screenshot capture
 * - Data validation
 */

import { BrowserManager } from '@lib/puppeteer-utils/browser-manager';
import { CrawlerUtils } from '@lib/puppeteer-utils/crawler-utils';
import { EcommerceCrawler, ProductInfo } from '@/crawlers/ecommerce-crawler';
import { Page } from 'puppeteer';

describe('E-commerce Crawling Example', () => {
  let browserManager: BrowserManager;
  let page: Page;
  let crawler: EcommerceCrawler;

  // Setup browser and crawler before all tests
  beforeAll(async () => {
    browserManager = new BrowserManager({
      defaultTimeout: 10000
      // args: ['--no-sandbox', '--disable-setuid-sandbox'] // Removed for compatibility
    });

    await browserManager.launch();
    crawler = new EcommerceCrawler({
      maxPages: 2,
      includeImages: true,
      includeReviews: true,
      currency: 'USD'
    });

    console.log('🚀 Browser launched and crawler initialized');
  }, 30000); // 30 second timeout for browser launch

  // Create new page for each test
  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  // Close page after each test
  afterEach(async () => {
    if (page && !page.isClosed()) {
      await page.close();
    }
  });

  // Close browser after all tests
  afterAll(async () => {
    await browserManager.close();
    console.log('🔒 Browser closed');
  });

  describe('Basic Product Information Extraction', () => {
    test('should extract product info from example e-commerce site', async () => {
      // Navigate to example product page
      await page.goto('https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html', {
        waitUntil: 'networkidle2'
      });

      // Take screenshot for debugging
      await CrawlerUtils.takeScreenshot(page, {
        path: 'e2e/outputs/screenshots/product-page.png',
        fullPage: true
      });

      // Extract product information using custom selectors for this site
      const customSelectors = {
        title: 'h1',
        price: '.price_color',
        rating: '.star-rating',
        availability: '.availability',
        image: '#product_gallery img',
        description: '#product_description + p'
      };

      const productInfo = await crawler.extractProductInfo(page, customSelectors);

      // Validate extracted data
      expect(productInfo).toBeDefined();
      expect(productInfo.title).toBeTruthy();
      expect(productInfo.title).toContain('A Light in the Attic');
      
      expect(productInfo.price).toBeGreaterThan(0);
      expect(productInfo.currency).toBe('USD');
      
      expect(productInfo.imageUrl).toBeTruthy();
      expect(productInfo.availability).toBeTruthy();
      
      expect(productInfo.extractedAt).toBeTruthy();
      expect(new Date(productInfo.extractedAt)).toBeInstanceOf(Date);

      console.log('✅ Extracted product:', {
        title: productInfo.title,
        price: `$${productInfo.price}`,
        rating: productInfo.rating,
        availability: productInfo.availability
      });
    }, 15000);

    test('should handle missing elements gracefully', async () => {
      // Navigate to a simple page without product structure
      await page.goto('https://httpbin.org/html', {
        waitUntil: 'networkidle2'
      });

      // Try to extract product info with default selectors
      const productInfo = await crawler.extractProductInfo(page);

      // Should not throw error, but return default values
      expect(productInfo).toBeDefined();
      expect(productInfo.title).toBe('Unknown Product');
      expect(productInfo.price).toBe(0);
      expect(productInfo.rating).toBe(0);
      expect(productInfo.reviewCount).toBe(0);
    }, 10000);
  });

  describe('Product List Extraction', () => {
    test('should extract multiple products from catalog page', async () => {
      // Navigate to books catalog
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Take screenshot of catalog page
      await CrawlerUtils.takeScreenshot(page, {
        path: 'e2e/outputs/screenshots/catalog-page.png',
        fullPage: true
      });

      // Custom selectors for books.toscrape.com
      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const products = await crawler.extractProductList(page, 2, customSelectors);

      // Validate results
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);

      // Validate individual product structure
      const firstProduct = products[0];
      expect(firstProduct).toHaveProperty('title');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('imageUrl');
      expect(firstProduct).toHaveProperty('extractedAt');

      // Check that we got reasonable data
      expect(firstProduct.title).toBeTruthy();
      expect(firstProduct.price).toBeGreaterThanOrEqual(0);

      console.log(`✅ Extracted ${products.length} products from catalog`);
      
      // Log sample products
      products.slice(0, 3).forEach((product, index) => {
        console.log(`📖 Product ${index + 1}:`, {
          title: product.title.substring(0, 50) + '...',
          price: `$${product.price}`
        });
      });
    }, 25000);

    test('should handle pagination correctly', async () => {
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Extract products from first page only
      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const singlePageProducts = await crawler.extractProductList(page, 1, customSelectors);
      
      // Now extract from multiple pages
      const multiPageProducts = await crawler.extractProductList(page, 2, customSelectors);

      expect(multiPageProducts.length).toBeGreaterThan(singlePageProducts.length);
      
      console.log(`📄 Single page: ${singlePageProducts.length} products`);
      console.log(`📄 Multi page: ${multiPageProducts.length} products`);
    }, 30000);
  });

  describe('Advanced Crawling Features', () => {
    test('should handle dynamic content loading', async () => {
      // Navigate to a page that might have dynamic content
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Wait for specific elements to ensure page is fully loaded
      const hasProducts = await CrawlerUtils.waitForElement(page, 'article.product_pod', {
        timeout: 10000
      });

      expect(hasProducts).toBe(true);

      // Scroll to bottom to trigger any lazy loading
      await CrawlerUtils.scrollToBottom(page);

      // Wait a bit more for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      const productCount = await CrawlerUtils.getElementCount(page, 'article.product_pod');
      expect(productCount).toBeGreaterThan(0);

      console.log(`📊 Found ${productCount} products after dynamic loading`);
    }, 15000);

    test('should capture screenshots at different stages', async () => {
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Initial page load screenshot
      await CrawlerUtils.takeScreenshot(page, {
        path: 'e2e/outputs/screenshots/stage1-initial-load.png'
      });

      // Click on first product
      const firstProductLink = await page.$('article.product_pod h3 a');
      if (firstProductLink) {
        await firstProductLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Product detail page screenshot
        await CrawlerUtils.takeScreenshot(page, {
          path: 'e2e/outputs/screenshots/stage2-product-detail.png'
        });
      }

      // Verify screenshots were created
      const fs = require('fs');
      expect(fs.existsSync('e2e/outputs/screenshots/stage1-initial-load.png')).toBe(true);
      expect(fs.existsSync('e2e/outputs/screenshots/stage2-product-detail.png')).toBe(true);
    }, 15000);
  });

  describe('Error Handling and Recovery', () => {
    test('should handle network errors gracefully', async () => {
      // Try to navigate to non-existent page
      try {
        await page.goto('https://nonexistent-ecommerce-site-12345.com', {
          waitUntil: 'networkidle2',
          timeout: 5000
        });
      } catch (error) {
        expect(error).toBeDefined();
        console.log('⚠️ Expected network error caught:', (error as Error).message);
      }

      // Should still be able to navigate to valid page
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      const title = await page.title();
      expect(title).toBeTruthy();
    }, 15000);

    test('should retry failed operations', async () => {
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      let attempts = 0;
      const maxAttempts = 3;

      const attemptExtraction = async (): Promise<ProductInfo[]> => {
        attempts++;
        console.log(`🔄 Attempt ${attempts}/${maxAttempts}`);

        try {
          const customSelectors = {
            productContainer: 'article.product_pod',
            nextButton: '.next a',
            productLink: 'h3 a'
          };

          return await crawler.extractProductList(page, 1, customSelectors);
        } catch (error) {
          if (attempts < maxAttempts) {
            console.log(`⚠️ Attempt ${attempts} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
            return attemptExtraction();
          }
          throw error;
        }
      };

      const products = await attemptExtraction();
      
      expect(products).toBeDefined();
      expect(products.length).toBeGreaterThan(0);
      expect(attempts).toBeLessThanOrEqual(maxAttempts);
      
      console.log(`✅ Successfully extracted ${products.length} products in ${attempts} attempts`);
    }, 20000);
  });

  describe('Data Validation and Quality', () => {
    test('should validate extracted product data quality', async () => {
      await page.goto('https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html', {
        waitUntil: 'networkidle2'
      });

      const customSelectors = {
        title: 'h1',
        price: '.price_color',
        rating: '.star-rating',
        availability: '.availability',
        image: '#product_gallery img'
      };

      const productInfo = await crawler.extractProductInfo(page, customSelectors);

      // Data validation tests
      expect(productInfo.title).toMatch(/^.{3,}$/); // At least 3 characters
      expect(productInfo.price).toBeGreaterThan(0);
      expect(productInfo.price).toBeLessThan(1000); // Reasonable price range
      
      // URL validation
      if (productInfo.imageUrl) {
        expect(productInfo.imageUrl).toMatch(/^https?:\/\/.+/);
      }

      // Date validation
      const extractedDate = new Date(productInfo.extractedAt);
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      
      expect(extractedDate).toBeInstanceOf(Date);
      expect(extractedDate.getTime()).toBeGreaterThanOrEqual(oneMinuteAgo.getTime());
      expect(extractedDate.getTime()).toBeLessThanOrEqual(now.getTime());

      console.log('✅ Data validation passed for product:', productInfo.title);
    }, 15000);

    test('should detect and handle duplicate products', async () => {
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const products = await crawler.extractProductList(page, 1, customSelectors);

      // Check for duplicate titles
      const titles = products.map(p => p.title);
      const uniqueTitles = [...new Set(titles)];
      
      expect(uniqueTitles.length).toBe(titles.length); // No duplicates expected

      console.log(`📊 Extracted ${products.length} unique products`);
    }, 15000);
  });
});