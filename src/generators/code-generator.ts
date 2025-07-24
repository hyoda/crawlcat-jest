import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ProductInfo } from '../crawlers/ecommerce-crawler';

export interface CodeTemplate {
  name: string;
  template: string;
  outputPath: string;
  data: any;
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
    dependencies?: string[];
  };
}

export interface GenerationResult {
  filePath: string;
  content: string;
  size: number;
  linesOfCode: number;
  generatedAt: string;
  template: string;
}

export interface GenerationOptions {
  outputDir?: string;
  overwrite?: boolean;
  format?: boolean;
  typescript?: boolean;
  includeComments?: boolean;
  includeTypes?: boolean;
}

export class CodeGenerator {
  private templatesDir: string;
  private outputDir: string;
  private compiledTemplates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(options: { templatesDir?: string; outputDir?: string } = {}) {
    this.templatesDir = options.templatesDir || path.join(__dirname, '../../lib/code-templates');
    this.outputDir = options.outputDir || path.join(process.cwd(), 'e2e/outputs/generated');
    this.initializeHandlebarsHelpers();
  }

  private initializeHandlebarsHelpers(): void {
    // Register helper functions
    Handlebars.registerHelper('json', (context: any) => {
      return JSON.stringify(context, null, 2);
    });

    Handlebars.registerHelper('camelCase', (str: string) => {
      return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    });

    Handlebars.registerHelper('pascalCase', (str: string) => {
      const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    });

    Handlebars.registerHelper('kebabCase', (str: string) => {
      return str.replace(/([a-z])([A-Z])/g, '$1-$2')
                .replace(/[\s_]+/g, '-')
                .toLowerCase();
    });

    Handlebars.registerHelper('now', () => {
      return new Date().toISOString();
    });

    Handlebars.registerHelper('formatNumber', (num: number) => {
      return num.toLocaleString();
    });

    Handlebars.registerHelper('formatCurrency', (amount: number, currency: string = 'USD') => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    });

    Handlebars.registerHelper('ifEquals', function(this: any, arg1: any, arg2: any, options: any) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('ifGreaterThan', function(this: any, arg1: number, arg2: number, options: any) {
      return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('truncate', (str: string, length: number) => {
      if (!str || str.length <= length) return str;
      return str.substring(0, length) + '...';
    });

    Handlebars.registerHelper('times', function(this: any, n: number, options: any) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += options.fn({ index: i, count: i + 1 });
      }
      return result;
    });
  }

  /**
   * Load and compile a template
   */
  private async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    if (this.compiledTemplates.has(templateName)) {
      return this.compiledTemplates.get(templateName)!;
    }

    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);
    
    this.compiledTemplates.set(templateName, compiledTemplate);
    return compiledTemplate;
  }

  /**
   * Generate code from a template
   */
  async generateCode(
    template: CodeTemplate, 
    options: GenerationOptions = {}
  ): Promise<GenerationResult> {
    const {
      outputDir = this.outputDir,
      overwrite = true,
      format = true,
      includeComments = true
    } = options;

    console.log(`🔨 Generating code from template: ${template.name}`);

    try {
      // Load and compile template
      const compiledTemplate = await this.loadTemplate(template.template);
      
      // Prepare template data
      const templateData = {
        ...template.data,
        metadata: {
          generatedAt: new Date().toISOString(),
          generator: 'crawlcat-jest-codegen',
          version: '1.0.0',
          ...template.metadata
        },
        options: {
          includeComments,
          ...options
        }
      };

      // Generate code
      let generatedCode = compiledTemplate(templateData);
      
      // Format code if requested
      if (format) {
        generatedCode = this.formatCode(generatedCode);
      }

      // Determine output path
      const outputPath = path.resolve(outputDir, template.outputPath);
      
      // Check if file exists and overwrite is disabled
      if (!overwrite && await fs.pathExists(outputPath)) {
        throw new Error(`File already exists and overwrite is disabled: ${outputPath}`);
      }

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputPath));
      
      // Write generated code to file
      await fs.writeFile(outputPath, generatedCode, 'utf-8');

      // Calculate metrics
      const stats = await fs.stat(outputPath);
      const linesOfCode = generatedCode.split('\n').length;

      const result: GenerationResult = {
        filePath: outputPath,
        content: generatedCode,
        size: stats.size,
        linesOfCode,
        generatedAt: new Date().toISOString(),
        template: template.template
      };

      console.log(`✅ Generated: ${outputPath} (${linesOfCode} lines, ${stats.size} bytes)`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to generate code from template ${template.name}:`, error);
      throw error;
    }
  }

  /**
   * Generate multiple files from crawling results
   */
  async generateFromCrawlingResults(
    crawlingData: { products: ProductInfo[] },
    options: GenerationOptions = {}
  ): Promise<GenerationResult[]> {
    console.log(`🔨 Generating code from crawling results (${crawlingData.products.length} products)`);

    const templates: CodeTemplate[] = [
      {
        name: 'Product API',
        template: 'product-api',
        outputPath: 'api/product-api.ts',
        data: { products: crawlingData.products },
        metadata: {
          description: 'Generated Product API from crawling results',
          dependencies: ['express', '@types/express']
        }
      },
      {
        name: 'Database Schema',
        template: 'database-schema',
        outputPath: 'database/schema.sql',
        data: { products: crawlingData.products },
        metadata: {
          description: 'Generated database schema for products',
          dependencies: ['postgresql']
        }
      },
      {
        name: 'React Component',
        template: 'product-list-component',
        outputPath: 'components/ProductList.tsx',
        data: { products: crawlingData.products },
        metadata: {
          description: 'Generated React component for product listing',
          dependencies: ['react', '@types/react']
        }
      }
    ];

    const results: GenerationResult[] = [];

    for (const template of templates) {
      try {
        const result = await this.generateCode(template, options);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to generate ${template.name}:`, error);
        // Continue with other templates
      }
    }

    // Generate index file with all exports
    await this.generateIndexFile(results, options);

    console.log(`✅ Generated ${results.length}/${templates.length} files successfully`);
    return results;
  }

  /**
   * Generate an index file that exports all generated modules
   */
  private async generateIndexFile(
    results: GenerationResult[],
    options: GenerationOptions
  ): Promise<void> {
    const indexContent = `// Auto-generated index file
// Generated at: ${new Date().toISOString()}

${results.map(result => {
  const relativePath = './' + path.relative(
    path.dirname(path.join(this.outputDir, 'index.ts')),
    result.filePath
  ).replace(/\.(ts|tsx)$/, '');
  const exportName = path.basename(result.filePath, path.extname(result.filePath));
  
  if (result.filePath.endsWith('.ts') || result.filePath.endsWith('.tsx')) {
    return `export { default as ${exportName} } from '${relativePath}';`;
  }
  return `// ${exportName}: ${relativePath}`;
}).join('\n')}

export const generatedFiles = [
${results.map(result => `  {
    name: '${path.basename(result.filePath)}',
    path: '${result.filePath}',
    template: '${result.template}',
    linesOfCode: ${result.linesOfCode},
    size: ${result.size}
  }`).join(',\n')}
];
`;

    const indexPath = path.join(this.outputDir, 'index.ts');
    await fs.ensureDir(path.dirname(indexPath));
    await fs.writeFile(indexPath, indexContent);
    
    console.log(`📄 Generated index file: ${indexPath}`);
  }

  /**
   * Generate test code from scenario
   */
  async generateTestFromScenario(scenario: any, options: GenerationOptions = {}): Promise<GenerationResult> {
    const template: CodeTemplate = {
      name: 'Scenario Test',
      template: 'scenario-test',
      outputPath: `tests/${scenario.id}.test.ts`,
      data: { scenario },
      metadata: {
        description: `Generated test for scenario: ${scenario.title}`,
        dependencies: ['jest', 'puppeteer', '@types/jest', '@types/puppeteer']
      }
    };

    return await this.generateCode(template, options);
  }

  /**
   * Format generated code
   */
  private formatCode(code: string): string {
    return code
      // Remove excessive blank lines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      // Ensure consistent indentation
      .replace(/\t/g, '  ')
      // Add final newline
      .trim() + '\n';
  }

  /**
   * Validate generated code
   */
  async validateGeneratedCode(result: GenerationResult): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if file exists
      if (!await fs.pathExists(result.filePath)) {
        errors.push('Generated file does not exist');
        return { isValid: false, errors, warnings };
      }

      // Check file size
      if (result.size === 0) {
        errors.push('Generated file is empty');
      }

      // Basic syntax checks for TypeScript/JavaScript
      const content = result.content;
      const ext = path.extname(result.filePath);

      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        // Check for basic syntax issues
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          errors.push('Mismatched braces');
        }

        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
          errors.push('Mismatched parentheses');
        }

        // Check for TypeScript-specific issues
        if (ext === '.ts' || ext === '.tsx') {
          if (!content.includes('export') && !content.includes('import')) {
            warnings.push('No imports or exports found');
          }
        }
      }

      // Check for SQL files
      if (ext === '.sql') {
        if (!content.toLowerCase().includes('create') && 
            !content.toLowerCase().includes('insert') && 
            !content.toLowerCase().includes('select')) {
          warnings.push('SQL file may be incomplete');
        }
      }

    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * List available templates
   */
  async listTemplates(): Promise<string[]> {
    try {
      await fs.ensureDir(this.templatesDir);
      const files = await fs.readdir(this.templatesDir);
      return files
        .filter(file => file.endsWith('.hbs'))
        .map(file => file.replace('.hbs', ''));
    } catch (error) {
      console.error('Failed to list templates:', error);
      return [];
    }
  }

  /**
   * Get template content for preview
   */
  async getTemplateContent(templateName: string): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template not found: ${templateName}`);
    }

    return await fs.readFile(templatePath, 'utf-8');
  }
}