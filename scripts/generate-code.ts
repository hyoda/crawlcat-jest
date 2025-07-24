#!/usr/bin/env ts-node

/**
 * Code Generation Script
 * 
 * This script demonstrates how to use the CodeGenerator to create
 * production-ready code from sample data or crawled results.
 */

import { CodeGenerator } from '../src/generators/code-generator';
import { ProductInfo } from '../src/crawlers/ecommerce-crawler';
import * as path from 'path';

// Sample product data for demonstration
const sampleProducts: ProductInfo[] = [
  {
    id: '1',
    title: 'MacBook Pro 16-inch',
    price: 2399.00,
    originalPrice: 2599.00,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 1250,
    availability: 'In Stock',
    imageUrl: 'https://example.com/macbook-pro.jpg',
    description: 'Powerful laptop for professionals with M2 Pro chip',
    brand: 'Apple',
    category: 'Laptops',
    discount: 8,
    url: 'https://example.com/macbook-pro-16',
    extractedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Dell XPS 13',
    price: 1299.00,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 890,
    availability: 'In Stock',
    imageUrl: 'https://example.com/dell-xps-13.jpg',
    description: 'Compact and powerful ultrabook for everyday use',
    brand: 'Dell',
    category: 'Laptops',
    url: 'https://example.com/dell-xps-13',
    extractedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Logitech MX Master 3',
    price: 99.99,
    originalPrice: 119.99,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 2100,
    availability: 'In Stock',
    imageUrl: 'https://example.com/mx-master-3.jpg',
    description: 'Advanced wireless mouse for power users',
    brand: 'Logitech',
    category: 'Accessories',
    discount: 17,
    url: 'https://example.com/mx-master-3',
    extractedAt: new Date().toISOString()
  }
];

async function main() {
  console.log('🔨 Starting code generation script...\n');

  try {
    // Initialize CodeGenerator
    const generator = new CodeGenerator({
      outputDir: path.join(process.cwd(), 'e2e/outputs/generated')
    });

    console.log('📋 Available templates:');
    const templates = await generator.listTemplates();
    templates.forEach(template => {
      console.log(`   - ${template}`);
    });
    console.log('');

    // Generate code from sample data
    console.log('🚀 Generating code from sample product data...\n');
    
    const results = await generator.generateFromCrawlingResults(
      { products: sampleProducts },
      {
        typescript: true,
        includeComments: true,
        includeTypes: true,
        overwrite: true,
        format: true
      }
    );

    console.log(`✅ Successfully generated ${results.length} files:\n`);
    
    let totalLines = 0;
    let totalSize = 0;

    for (const result of results) {
      console.log(`📄 ${path.basename(result.filePath)}`);
      console.log(`   Path: ${result.filePath}`);
      console.log(`   Lines: ${result.linesOfCode}`);
      console.log(`   Size: ${result.size} bytes`);
      console.log(`   Template: ${result.template}`);
      
      totalLines += result.linesOfCode;
      totalSize += result.size;

      // Validate generated code
      const validation = await generator.validateGeneratedCode(result);
      
      if (validation.isValid) {
        console.log(`   Status: ✅ Valid`);
      } else {
        console.log(`   Status: ⚠️  Issues found`);
        validation.errors.forEach(error => {
          console.log(`     ❌ ${error}`);
        });
      }

      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          console.log(`     ⚠️  ${warning}`);
        });
      }

      console.log('');
    }

    // Summary statistics
    console.log('📊 Generation Summary:');
    console.log(`   Files created: ${results.length}`);
    console.log(`   Total lines of code: ${totalLines.toLocaleString()}`);
    console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Average file size: ${(totalSize / results.length / 1024).toFixed(2)} KB`);
    console.log('');

    // Show usage instructions
    console.log('🎯 Next Steps:');
    console.log('');
    console.log('1. Review generated files:');
    results.forEach(result => {
      console.log(`   cat "${result.filePath}"`);
    });

    console.log('');
    console.log('2. Test generated API (if available):');
    const apiResult = results.find(r => r.filePath.includes('product-api'));
    if (apiResult) {
      console.log(`   ts-node -e "import api from '${apiResult.filePath}'; console.log(api.getAllProducts())"`);
    }

    console.log('');
    console.log('3. Run database schema (if available):');
    const schemaResult = results.find(r => r.filePath.includes('schema.sql'));
    if (schemaResult) {
      console.log(`   mysql < "${schemaResult.filePath}"`);
    }

    console.log('');
    console.log('4. Use React component (if available):');
    const componentResult = results.find(r => r.filePath.includes('ProductList'));
    if (componentResult) {
      console.log(`   import ProductList from '${componentResult.filePath}';`);
    }

    console.log('');
    console.log('✨ Code generation completed successfully!');

  } catch (error) {
    console.error('❌ Code generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

export { main as generateCode };