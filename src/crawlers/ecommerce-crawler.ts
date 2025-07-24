import { Page } from 'puppeteer';
import { CrawlerUtils } from '@lib/puppeteer-utils/crawler-utils';

export interface ProductInfo {
  id?: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  availability: string;
  imageUrl: string;
  description?: string;
  brand?: string;
  category?: string;
  features?: string[];
  specifications?: Record<string, string>;
  seller?: string;
  discount?: number;
  url?: string;
  extractedAt: string;
}

export interface CrawlingOptions {
  maxPages?: number;
  delay?: number;
  includeImages?: boolean;
  includeReviews?: boolean;
  includeSpecifications?: boolean;
  currency?: string;
}

export interface PriceHistoryEntry {
  productId: string;
  price: number;
  currency: string;
  date: string;
  source: string;
  availability: string;
}

export class EcommerceCrawler {
  private options: CrawlingOptions;

  constructor(options: CrawlingOptions = {}) {
    this.options = {
      maxPages: 3,
      delay: 1000,
      includeImages: true,
      includeReviews: true,
      includeSpecifications: false,
      currency: 'USD',
      ...options
    };
  }

  /**
   * Extract product information from a single product page
   */
  async extractProductInfo(page: Page, selectors?: any): Promise<ProductInfo> {
    console.log('🔍 Extracting product information...');

    // Default selectors (can be overridden for different sites)
    const defaultSelectors = {
      title: '#productTitle, .product-title, h1[data-testid="product-title"]',
      price: '.a-price-whole, .price, [data-testid="price"]',
      originalPrice: '.a-price.a-text-price .a-offscreen, .original-price',
      rating: '.a-icon-alt, .rating, [data-testid="rating"]',
      reviewCount: '#acrCustomerReviewText, .review-count, [data-testid="review-count"]',
      availability: '#availability span, .availability, [data-testid="availability"]',
      image: '#landingImage, .product-image img, [data-testid="product-image"]',
      description: '#feature-bullets ul, .product-description, [data-testid="description"]',
      brand: '.a-row .a-span9 span, .brand, [data-testid="brand"]',
      category: '.a-breadcrumb, .breadcrumb, [data-testid="breadcrumb"]'
    };

    const activeSelectors = { ...defaultSelectors, ...selectors };

    try {
      // Extract basic information
      const title = await CrawlerUtils.extractText(page, activeSelectors.title);
      const priceText = await CrawlerUtils.extractText(page, activeSelectors.price);
      const price = this.parsePrice(priceText);
      
      const originalPriceText = await CrawlerUtils.extractText(page, activeSelectors.originalPrice);
      const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

      // Extract rating and reviews
      const ratingText = await CrawlerUtils.extractText(page, activeSelectors.rating);
      const rating = this.parseRating(ratingText);
      
      const reviewText = await CrawlerUtils.extractText(page, activeSelectors.reviewCount);
      const reviewCount = this.parseReviewCount(reviewText);

      // Extract availability
      const availability = await CrawlerUtils.extractText(page, activeSelectors.availability);

      // Extract image URL
      const imageUrl = await CrawlerUtils.extractAttribute(page, activeSelectors.image, 'src');

      // Extract additional information if requested
      let description, brand, category;
      
      if (this.options.includeSpecifications) {
        description = await CrawlerUtils.extractText(page, activeSelectors.description);
        brand = await CrawlerUtils.extractText(page, activeSelectors.brand);
        category = await CrawlerUtils.extractText(page, activeSelectors.category);
      }

      const productInfo: ProductInfo = {
        title: title || 'Unknown Product',
        price,
        originalPrice,
        currency: this.options.currency || 'USD',
        rating,
        reviewCount,
        availability: availability || 'Unknown',
        imageUrl: imageUrl || '',
        description,
        brand,
        category,
        url: page.url(),
        extractedAt: new Date().toISOString()
      };

      // Calculate discount if original price is available
      if (originalPrice && originalPrice > price) {
        productInfo.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      }

      console.log(`✅ Extracted product: ${title}`);
      return productInfo;

    } catch (error) {
      console.error('❌ Failed to extract product information:', error);
      throw error;
    }
  }

  /**
   * Extract multiple products from search results or category pages
   */
  async extractProductList(
    page: Page, 
    maxPages: number = this.options.maxPages || 3,
    selectors?: any
  ): Promise<ProductInfo[]> {
    console.log(`🔍 Extracting product list (max ${maxPages} pages)...`);

    const defaultSelectors = {
      productContainer: '[data-component-type="s-search-result"], .product-item, [data-testid="product-item"]',
      nextButton: '.a-pagination .a-last a, .next-page, [data-testid="next-page"]',
      productLink: 'h2 a, .product-link, [data-testid="product-link"]'
    };

    const activeSelectors = { ...defaultSelectors, ...selectors };
    const products: ProductInfo[] = [];

    try {
      for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
        console.log(`📄 Processing page ${currentPage}/${maxPages}`);

        // Wait for products to load
        const hasProducts = await CrawlerUtils.waitForElement(page, activeSelectors.productContainer);
        if (!hasProducts) {
          console.log('⚠️ No products found on this page');
          break;
        }

        // Extract products from current page
        const pageProducts = await this.extractProductsFromPage(page, activeSelectors);
        products.push(...pageProducts);

        console.log(`✅ Extracted ${pageProducts.length} products from page ${currentPage}`);

        // Navigate to next page if not the last iteration
        if (currentPage < maxPages) {
          const hasNextPage = await this.navigateToNextPage(page, activeSelectors.nextButton);
          if (!hasNextPage) {
            console.log('ℹ️ No more pages available');
            break;
          }

          // Wait between page navigations
          await page.waitForTimeout(this.options.delay || 1000);
        }
      }

      console.log(`✅ Total products extracted: ${products.length}`);
      return products;

    } catch (error) {
      console.error('❌ Failed to extract product list:', error);
      throw error;
    }
  }

  /**
   * Extract products from current page
   */
  private async extractProductsFromPage(page: Page, selectors: any): Promise<ProductInfo[]> {
    const products: ProductInfo[] = [];

    try {
      const productElements = await page.$$(selectors.productContainer);
      
      for (let i = 0; i < productElements.length; i++) {
        try {
          const productInfo = await this.extractProductFromElement(productElements[i], page);
          if (productInfo.title) {
            products.push(productInfo);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to extract product ${i + 1}:`, error);
        }
      }

    } catch (error) {
      console.error('❌ Failed to extract products from page:', error);
    }

    return products;
  }

  /**
   * Extract product information from a single element
   */
  private async extractProductFromElement(element: any, page: Page): Promise<ProductInfo> {
    return await page.evaluate((el) => {
      // Extract information from product element
      const titleEl = el.querySelector('h2 a span, .product-title, [data-testid="product-title"]');
      const priceEl = el.querySelector('.a-price-whole, .price, [data-testid="price"]');
      const ratingEl = el.querySelector('.a-icon-alt, .rating, [data-testid="rating"]');
      const reviewEl = el.querySelector('.a-size-base, .review-count, [data-testid="review-count"]');
      const imgEl = el.querySelector('img');
      const linkEl = el.querySelector('h2 a, .product-link, [data-testid="product-link"]');

      const title = titleEl?.textContent?.trim() || '';
      const priceText = priceEl?.textContent?.trim() || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const ratingText = ratingEl?.textContent?.trim() || '0';
      const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || '0') || 0;
      const reviewText = reviewEl?.textContent?.trim() || '0';
      const reviewCount = parseInt(reviewText.match(/(\d+)/)?.[1] || '0') || 0;
      const imageUrl = (imgEl as HTMLImageElement)?.src || '';
      const productUrl = (linkEl as HTMLAnchorElement)?.href || '';

      return {
        title,
        price,
        currency: 'USD', // Default currency
        rating,
        reviewCount,
        availability: 'In Stock', // Default availability
        imageUrl,
        url: productUrl,
        extractedAt: new Date().toISOString()
      };
    }, element);
  }

  /**
   * Navigate to next page
   */
  private async navigateToNextPage(page: Page, nextButtonSelector: string): Promise<boolean> {
    try {
      const nextButton = await page.$(nextButtonSelector);
      if (!nextButton) {
        return false;
      }

      // Check if next button is clickable
      const isClickable = await page.evaluate((btn) => {
        return btn && !btn.hasAttribute('disabled') && 
               !btn.classList.contains('disabled');
      }, nextButton);

      if (!isClickable) {
        return false;
      }

      // Click and wait for navigation
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        nextButton.click()
      ]);

      return true;

    } catch (error) {
      console.warn('⚠️ Failed to navigate to next page:', error);
      return false;
    }
  }

  /**
   * Monitor price changes for a product
   */
  async monitorPrice(page: Page, productUrl: string, intervalMinutes: number = 60): Promise<void> {
    console.log(`📊 Starting price monitoring for: ${productUrl}`);

    while (true) {
      try {
        await page.goto(productUrl, { waitUntil: 'networkidle2' });
        const productInfo = await this.extractProductInfo(page);
        
        // Save price history
        await this.savePriceHistory({
          productId: this.generateProductId(productUrl),
          price: productInfo.price,
          currency: productInfo.currency,
          date: new Date().toISOString(),
          source: page.url(),
          availability: productInfo.availability
        });

        console.log(`💰 Price check: $${productInfo.price} (${productInfo.availability})`);

        // Wait for next check
        await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));

      } catch (error) {
        console.error('❌ Price monitoring error:', error);
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait 5 minutes on error
      }
    }
  }

  /**
   * Get price history for a product
   */
  async getPriceHistory(productId: string): Promise<PriceHistoryEntry[]> {
    // In a real implementation, this would query a database
    // For now, return empty array
    console.log(`📊 Getting price history for product: ${productId}`);
    return [];
  }

  /**
   * Utility methods
   */
  private parsePrice(priceText: string): number {
    if (!priceText) return 0;
    const cleanedPrice = priceText.replace(/[^0-9.]/g, '');
    return parseFloat(cleanedPrice) || 0;
  }

  private parseRating(ratingText: string): number {
    if (!ratingText) return 0;
    const match = ratingText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  private parseReviewCount(reviewText: string): number {
    if (!reviewText) return 0;
    const match = reviewText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private generateProductId(url: string): string {
    // Extract product ID from URL or generate hash
    const match = url.match(/\/dp\/([A-Z0-9]+)/);
    if (match) {
      return match[1];
    }
    
    // Generate hash from URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private async savePriceHistory(entry: PriceHistoryEntry): Promise<void> {
    // In a real implementation, this would save to a database
    console.log('💾 Saving price history:', entry);
  }
}