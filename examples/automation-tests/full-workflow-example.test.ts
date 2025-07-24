/**
 * Full Workflow Automation Test Example
 * 
 * This file demonstrates a complete end-to-end workflow:
 * - Web crawling with Puppeteer
 * - Data validation and processing
 * - Code generation from crawled data
 * - Generated code validation
 * - Integration testing of the entire pipeline
 */

import { BrowserManager } from '@lib/puppeteer-utils/browser-manager';
import { CrawlerUtils } from '@lib/puppeteer-utils/crawler-utils';
import { EcommerceCrawler, ProductInfo } from '@/crawlers/ecommerce-crawler';
import { CodeGenerator } from '@/generators/code-generator';
import { Page } from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

// Mock data validator for demonstration
class DataValidator {
  validateProducts(products: ProductInfo[]): {
    isValid: boolean;
    validProducts: ProductInfo[];
    errors: string[];
  } {
    const errors: string[] = [];
    const validProducts: ProductInfo[] = [];

    for (const product of products) {
      const productErrors = this.validateProduct(product);
      
      if (productErrors.length === 0) {
        validProducts.push(product);
      } else {
        errors.push(`Product "${product.title}": ${productErrors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      validProducts,
      errors
    };
  }

  private validateProduct(product: ProductInfo): string[] {
    const errors: string[] = [];

    if (!product.title || product.title.length < 3) {
      errors.push('Title too short');
    }

    if (product.price <= 0) {
      errors.push('Invalid price');
    }

    if (product.rating < 0 || product.rating > 5) {
      errors.push('Invalid rating');
    }

    return errors;
  }
}

describe('Full Workflow Integration Test', () => {
  let browserManager: BrowserManager;
  let page: Page;
  let crawler: EcommerceCrawler;
  let codeGenerator: CodeGenerator;
  let validator: DataValidator;

  beforeAll(async () => {
    console.log('🚀 Initializing full workflow test environment...');
    
    browserManager = new BrowserManager({
      headless: false,
      slowMo: 50,
      defaultTimeout: 15000
    });

    await browserManager.launch();
    
    crawler = new EcommerceCrawler({
      maxPages: 2,
      includeImages: true,
      includeReviews: true
    });

    codeGenerator = new CodeGenerator({
      outputDir: path.join(process.cwd(), 'e2e/outputs/workflow-test')
    });

    validator = new DataValidator();

    console.log('✅ Workflow environment initialized');
  }, 30000);

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    if (page && !page.isClosed()) {
      await page.close();
    }
  });

  afterAll(async () => {
    await browserManager.close();
    console.log('🔒 Workflow test environment cleaned up');
  });

  describe('Complete Workflow: Crawl → Validate → Generate → Test', () => {
    test('should execute full workflow successfully', async () => {
      console.log('🎯 Starting complete workflow test...');

      // Step 1: Web Crawling
      console.log('📡 Step 1: Crawling product data...');
      
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Take initial screenshot
      await CrawlerUtils.takeScreenshot(page, {
        path: 'e2e/outputs/screenshots/workflow-step1-crawling.png',
        fullPage: true
      });

      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const rawProducts = await crawler.extractProductList(page, 2, customSelectors);
      
      expect(rawProducts).toBeDefined();
      expect(rawProducts.length).toBeGreaterThan(0);
      
      console.log(`✅ Crawled ${rawProducts.length} raw products`);

      // Step 2: Data Validation
      console.log('🔍 Step 2: Validating crawled data...');
      
      const validationResult = validator.validateProducts(rawProducts);
      
      expect(validationResult).toBeDefined();
      expect(validationResult.validProducts.length).toBeGreaterThan(0);
      
      if (validationResult.errors.length > 0) {
        console.log(`⚠️ Validation warnings: ${validationResult.errors.length}`);
        validationResult.errors.slice(0, 3).forEach(error => {
          console.log(`  - ${error}`);
        });
      }

      const validProducts = validationResult.validProducts;
      console.log(`✅ Validated ${validProducts.length} products`);

      // Step 3: Code Generation
      console.log('🔨 Step 3: Generating code from crawled data...');
      
      const generationResults = await codeGenerator.generateFromCrawlingResults(
        { products: validProducts },
        {
          typescript: true,
          includeComments: true,
          includeTypes: true,
          overwrite: true
        }
      );

      expect(generationResults).toBeDefined();
      expect(generationResults.length).toBeGreaterThan(0);

      console.log(`✅ Generated ${generationResults.length} code files:`);
      generationResults.forEach(result => {
        console.log(`  - ${path.basename(result.filePath)} (${result.linesOfCode} lines)`);
      });

      // Step 4: Generated Code Validation
      console.log('🧪 Step 4: Validating generated code...');
      
      for (const result of generationResults) {
        const validation = await codeGenerator.validateGeneratedCode(result);
        
        expect(validation.isValid).toBe(true);
        
        if (validation.warnings.length > 0) {
          console.log(`⚠️ Warnings for ${path.basename(result.filePath)}:`);
          validation.warnings.forEach(warning => {
            console.log(`  - ${warning}`);
          });
        }

        if (validation.errors.length > 0) {
          console.log(`❌ Errors for ${path.basename(result.filePath)}:`);
          validation.errors.forEach(error => {
            console.log(`  - ${error}`);
          });
        }
      }

      console.log('✅ All generated code validated successfully');

      // Step 5: Integration Testing
      console.log('🔗 Step 5: Testing generated code integration...');
      
      await this.testGeneratedCodeIntegration(generationResults, validProducts);

      console.log('🎉 Complete workflow executed successfully!');

      // Final metrics
      console.log('\n📊 Workflow Metrics:');
      console.log(`  - Products crawled: ${rawProducts.length}`);
      console.log(`  - Products validated: ${validProducts.length}`);
      console.log(`  - Code files generated: ${generationResults.length}`);
      console.log(`  - Total lines of code: ${generationResults.reduce((sum, r) => sum + r.linesOfCode, 0)}`);

    }, 60000); // 1 minute timeout for complete workflow

    async testGeneratedCodeIntegration(
      generationResults: any[],
      products: ProductInfo[]
    ): Promise<void> {
      // Test 1: API file should be importable and functional
      const apiResult = generationResults.find(r => r.filePath.includes('product-api'));
      if (apiResult) {
        expect(await fs.pathExists(apiResult.filePath)).toBe(true);
        
        const apiContent = await fs.readFile(apiResult.filePath, 'utf-8');
        expect(apiContent).toContain('export class ProductAPI');
        expect(apiContent).toContain('getAllProducts');
        expect(apiContent).toContain('searchProducts');
      }

      // Test 2: Database schema should be valid SQL
      const schemaResult = generationResults.find(r => r.filePath.includes('schema.sql'));
      if (schemaResult) {
        const schemaContent = await fs.readFile(schemaResult.filePath, 'utf-8');
        expect(schemaContent).toContain('CREATE TABLE');
        expect(schemaContent).toContain('products');
        expect(schemaContent).toMatch(/INSERT INTO.*products/);
      }

      // Test 3: React component should have proper structure
      const componentResult = generationResults.find(r => r.filePath.includes('ProductList'));
      if (componentResult) {
        const componentContent = await fs.readFile(componentResult.filePath, 'utf-8');
        expect(componentContent).toContain('import React');
        expect(componentContent).toContain('export default ProductList');
        expect(componentContent).toContain('useState');
      }

      console.log('✅ Generated code integration tests passed');
    }
  });

  describe('Workflow Error Handling and Recovery', () => {
    test('should handle partial failures gracefully', async () => {
      console.log('🧪 Testing workflow error handling...');

      // Simulate crawling with potential errors
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Intentionally use selectors that might fail
      const problematicSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.nonexistent-next-button', // This will fail
        productLink: 'h3 a'
      };

      let products: ProductInfo[] = [];
      
      try {
        products = await crawler.extractProductList(page, 1, problematicSelectors);
      } catch (error) {
        console.log('⚠️ Expected crawling error (partial failure):', error.message);
        
        // Fallback: try with working selectors
        const workingSelectors = {
          productContainer: 'article.product_pod',
          nextButton: '.next a',
          productLink: 'h3 a'
        };
        
        products = await crawler.extractProductList(page, 1, workingSelectors);
      }

      expect(products.length).toBeGreaterThan(0);
      console.log('✅ Recovered from partial failure and extracted products');

      // Continue with code generation even with fewer products
      const generationResults = await codeGenerator.generateFromCrawlingResults(
        { products: products.slice(0, 5) }, // Use only first 5 products
        { typescript: true, includeComments: true }
      );

      expect(generationResults.length).toBeGreaterThan(0);
      console.log('✅ Code generation succeeded despite partial data');
    }, 30000);

    test('should validate data quality thresholds', async () => {
      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const products = await crawler.extractProductList(page, 1, customSelectors);
      const validationResult = validator.validateProducts(products);

      // Quality thresholds
      const validationRate = validationResult.validProducts.length / products.length;
      const minimumValidationRate = 0.8; // 80% of products should be valid

      expect(validationRate).toBeGreaterThanOrEqual(minimumValidationRate);

      console.log(`📊 Data quality metrics:`);
      console.log(`  - Total products: ${products.length}`);
      console.log(`  - Valid products: ${validationResult.validProducts.length}`);
      console.log(`  - Validation rate: ${(validationRate * 100).toFixed(1)}%`);
      console.log(`  - Validation errors: ${validationResult.errors.length}`);

      if (validationRate < minimumValidationRate) {
        console.log('❌ Data quality below threshold');
        validationResult.errors.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log('✅ Data quality meets threshold');
      }
    }, 20000);
  });

  describe('Performance and Scalability Tests', () => {
    test('should handle large datasets efficiently', async () => {
      const startTime = Date.now();

      await page.goto('https://books.toscrape.com/', {
        waitUntil: 'networkidle2'
      });

      // Extract more products to test performance
      const customSelectors = {
        productContainer: 'article.product_pod',
        nextButton: '.next a',
        productLink: 'h3 a'
      };

      const products = await crawler.extractProductList(page, 3, customSelectors); // 3 pages
      const extractionTime = Date.now() - startTime;

      const validationStart = Date.now();
      const validationResult = validator.validateProducts(products);
      const validationTime = Date.now() - validationStart;

      const generationStart = Date.now();
      const generationResults = await codeGenerator.generateFromCrawlingResults(
        { products: validationResult.validProducts }
      );
      const generationTime = Date.now() - generationStart;

      const totalTime = Date.now() - startTime;

      // Performance assertions
      expect(extractionTime).toBeLessThan(45000); // Less than 45 seconds
      expect(validationTime).toBeLessThan(5000);  // Less than 5 seconds
      expect(generationTime).toBeLessThan(10000); // Less than 10 seconds

      console.log('⚡ Performance metrics:');
      console.log(`  - Products processed: ${products.length}`);
      console.log(`  - Extraction time: ${(extractionTime / 1000).toFixed(2)}s`);
      console.log(`  - Validation time: ${(validationTime / 1000).toFixed(2)}s`);
      console.log(`  - Generation time: ${(generationTime / 1000).toFixed(2)}s`);
      console.log(`  - Total workflow time: ${(totalTime / 1000).toFixed(2)}s`);
      console.log(`  - Throughput: ${(products.length / (totalTime / 1000)).toFixed(2)} products/second`);

      expect(generationResults.length).toBeGreaterThan(0);
    }, 90000); // Extended timeout for performance test
  });

  describe('Parallel Processing and Batch Operations', () => {
    test('should support batch processing workflows', async () => {
      console.log('🔄 Testing batch processing workflow...');

      // Simulate multiple crawling sessions
      const batchSessions = [
        'https://books.toscrape.com/catalogue/page-1.html',
        'https://books.toscrape.com/catalogue/page-2.html'
      ];

      const batchResults: ProductInfo[][] = [];

      for (const sessionUrl of batchSessions) {
        try {
          await page.goto(sessionUrl, { waitUntil: 'networkidle2' });
          
          const customSelectors = {
            productContainer: 'article.product_pod',
            nextButton: '.next a',
            productLink: 'h3 a'
          };

          const sessionProducts = await crawler.extractProductList(page, 1, customSelectors);
          batchResults.push(sessionProducts);
          
          console.log(`✅ Batch session ${batchResults.length}: ${sessionProducts.length} products`);
        } catch (error) {
          console.log(`⚠️ Batch session failed: ${error.message}`);
          batchResults.push([]); // Add empty result for failed session
        }
      }

      // Combine all batch results
      const allProducts = batchResults.flat();
      expect(allProducts.length).toBeGreaterThan(0);

      // Validate combined dataset
      const validationResult = validator.validateProducts(allProducts);
      expect(validationResult.validProducts.length).toBeGreaterThan(0);

      // Generate code from combined dataset
      const generationResults = await codeGenerator.generateFromCrawlingResults(
        { products: validationResult.validProducts }
      );

      expect(generationResults.length).toBeGreaterThan(0);

      console.log('✅ Batch processing workflow completed successfully');
      console.log(`📊 Batch results: ${allProducts.length} total products from ${batchSessions.length} sessions`);
    }, 45000);
  });
});