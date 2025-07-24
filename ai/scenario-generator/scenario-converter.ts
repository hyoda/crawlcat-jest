import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { GeneratedScenario } from './natural-language-generator';
// import { ScenarioStep, ScenarioAssertion } from './natural-language-generator'; // Reserved for future use

export interface ConversionOptions {
  outputFormat: 'jest' | 'playwright' | 'cypress';
  typescript: boolean;
  includeComments: boolean;
  includeImports: boolean;
  testFramework: 'jest' | 'mocha' | 'jasmine';
}

export interface ConvertedCode {
  filePath: string;
  content: string;
  dependencies: string[];
  testCommands: string[];
  metadata: {
    scenarioId: string;
    convertedAt: string;
    format: string;
    estimatedRunTime: number;
  };
}

export class ScenarioConverter {
  private templates: Map<string, string> = new Map();

  constructor() {
    this.initializeTemplates();
    this.registerHandlebarsHelpers();
  }

  private initializeTemplates(): void {
    // Jest + Puppeteer template
    this.templates.set('jest-puppeteer', `
import { BrowserManager } from '@lib/puppeteer-utils/browser-manager';
import { CrawlerUtils } from '@lib/puppeteer-utils/crawler-utils';
import { Page } from 'puppeteer';

describe('{{scenario.title}}', () => {
  let browserManager: BrowserManager;
  let page: Page;

  beforeAll(async () => {
    browserManager = new BrowserManager({{#if scenario.browserConfig}}{{{browserConfig}}}{{else}}{ headless: false }{{/if}});
    await browserManager.launch();
  });

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  afterAll(async () => {
    await browserManager.close();
  });

  {{#if options.includeComments}}
  /**
   * {{scenario.description}}
   * 
   * Domain: {{scenario.domain}}
   * Complexity: {{scenario.complexity}}
   * Estimated Duration: {{scenario.metadata.estimatedDuration}}s
   */
  {{/if}}
  it('{{scenario.title}}', async () => {
    {{#each scenario.steps}}
    {{> stepTemplate this}}
    {{/each}}

    {{#each scenario.assertions}}
    {{> assertionTemplate this}}
    {{/each}}
  }, {{multiply scenario.metadata.estimatedDuration 1000}});
});
    `);

    // Step template
    this.templates.set('stepTemplate', `
    {{#if description}}// {{description}}{{/if}}
    {{#switch action}}
      {{#case "navigate"}}
    await page.goto('{{target}}', { waitUntil: '{{parameters.waitUntil}}' });
    {{#each waitConditions}}
    await CrawlerUtils.waitForElement(page, '{{this}}');
    {{/each}}
      {{/case}}
      {{#case "click"}}
    await CrawlerUtils.clickAndWait(page, '{{target}}'{{#if waitConditions.[0]}}, { waitAfter: '{{waitConditions.[0]}}' }{{/if}});
      {{/case}}
      {{#case "type"}}
    await CrawlerUtils.typeText(page, '{{target}}', '{{parameters.text}}');
      {{/case}}
      {{#case "scroll"}}
    await CrawlerUtils.scroll(page, { direction: '{{parameters.direction}}', distance: {{parameters.distance}} });
      {{/case}}
      {{#case "wait"}}
    await CrawlerUtils.waitForElement(page, '{{target}}', { timeout: {{parameters.timeout}} });
      {{/case}}
      {{#case "screenshot"}}
    await CrawlerUtils.takeScreenshot(page, { path: 'e2e/outputs/screenshots/{{../scenario.id}}_step_{{id}}.png' });
      {{/case}}
      {{#default}}
    // Custom action: {{action}}
    await page.evaluate(() => {
      // Implement custom action here
      console.log('Custom action: {{action}}');
    });
      {{/default}}
    {{/switch}}
    `);

    // Assertion template
    this.templates.set('assertionTemplate', `
    {{#if description}}// {{description}}{{/if}}
    {{#switch type}}
      {{#case "element-exists"}}
    {{#if expected}}
    expect(await CrawlerUtils.waitForElement(page, '{{target}}')).toBe(true);
    {{else}}
    expect(await CrawlerUtils.waitForElement(page, '{{target}}')).toBe(false);
    {{/if}}
      {{/case}}
      {{#case "text-contains"}}
    const text_{{@index}} = await CrawlerUtils.extractText(page, '{{target}}');
    expect(text_{{@index}}).toContain('{{expected}}');
      {{/case}}
      {{#case "url-contains"}}
    expect(page.url()).toContain('{{expected}}');
      {{/case}}
      {{#case "count-equals"}}
    const count_{{@index}} = await CrawlerUtils.getElementCount(page, '{{target}}');
    expect(count_{{@index}}).toBe({{expected}});
      {{/case}}
      {{#case "custom"}}
    // Custom assertion: {{description}}
    const result_{{@index}} = await page.evaluate(() => {
      // Implement custom assertion logic here
      return true; // Replace with actual assertion logic
    });
    expect(result_{{@index}}).toBe({{expected}});
      {{/case}}
      {{#default}}
    // Unknown assertion type: {{type}}
    expect(true).toBe(true); // Placeholder
      {{/default}}
    {{/switch}}
    `);
  }

  private registerHandlebarsHelpers(): void {
    // Register Handlebars partials
    Handlebars.registerPartial('stepTemplate', this.templates.get('stepTemplate') || '');
    Handlebars.registerPartial('assertionTemplate', this.templates.get('assertionTemplate') || '');

    // Register helper functions
    Handlebars.registerHelper('switch', function(this: any, value: any, options: any) {
      this._switch_value_ = value;
      const html = options.fn(this);
      delete this._switch_value_;
      return html;
    });

    Handlebars.registerHelper('case', function(this: any, value: any, options: any) {
      if (value === this._switch_value_) {
        return options.fn(this);
      }
    });

    Handlebars.registerHelper('default', function(this: any, options: any) {
      return options.fn(this);
    });

    Handlebars.registerHelper('multiply', function(a: number, b: number) {
      return a * b;
    });

    Handlebars.registerHelper('json', function(context: any) {
      return JSON.stringify(context, null, 2);
    });
  }

  async convertScenario(
    scenario: GeneratedScenario,
    options: ConversionOptions = {
      outputFormat: 'jest',
      typescript: true,
      includeComments: true,
      includeImports: true,
      testFramework: 'jest'
    }
  ): Promise<ConvertedCode> {
    console.log(`🔄 Converting scenario: ${scenario.title}`);

    // Select appropriate template
    const templateKey = `${options.testFramework}-puppeteer`;
    const template = this.templates.get(templateKey);
    
    if (!template) {
      throw new Error(`Template not found for ${templateKey}`);
    }

    // Compile template
    const compiledTemplate = Handlebars.compile(template);
    
    // Generate code
    const code = compiledTemplate({
      scenario,
      options,
      browserConfig: this.generateBrowserConfig(scenario),
      imports: this.generateImports(options)
    });

    // Generate file path
    const fileName = this.generateFileName(scenario, options);
    const filePath = path.join(
      process.cwd(),
      'e2e',
      'scenarios',
      'converted',
      fileName
    );

    // Ensure directory exists
    await fs.ensureDir(path.dirname(filePath));

    // Write file
    await fs.writeFile(filePath, this.formatCode(code));

    // Generate metadata
    const convertedCode: ConvertedCode = {
      filePath,
      content: code,
      dependencies: this.extractDependencies(scenario, options),
      testCommands: this.generateTestCommands(fileName, options),
      metadata: {
        scenarioId: scenario.id,
        convertedAt: new Date().toISOString(),
        format: `${options.testFramework}-${options.outputFormat}`,
        estimatedRunTime: scenario.metadata.estimatedDuration
      }
    };

    console.log(`✅ Converted scenario to: ${filePath}`);
    return convertedCode;
  }

  private generateBrowserConfig(scenario: GeneratedScenario): string {
    const config = {
      headless: scenario.complexity === 'basic',
      slowMo: scenario.complexity === 'advanced' ? 150 : 100,
      defaultTimeout: scenario.metadata.estimatedDuration * 1000
    };

    return JSON.stringify(config, null, 4);
  }

  private generateImports(options: ConversionOptions): string[] {
    const imports = [
      "import { BrowserManager } from '@lib/puppeteer-utils/browser-manager';",
      "import { CrawlerUtils } from '@lib/puppeteer-utils/crawler-utils';",
      "import { Page } from 'puppeteer';"
    ];

    if (options.testFramework === 'jest') {
      imports.push("import '@testing-library/jest-dom';");
    }

    return imports;
  }

  private generateFileName(scenario: GeneratedScenario, options: ConversionOptions): string {
    const sanitizedTitle = scenario.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const extension = options.typescript ? '.test.ts' : '.test.js';
    return `${sanitizedTitle}${extension}`;
  }

  private formatCode(code: string): string {
    // Basic code formatting
    return code
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive empty lines
      .replace(/^\s+$/gm, '') // Remove empty lines with whitespace
      .trim();
  }

  private extractDependencies(scenario: GeneratedScenario, options: ConversionOptions): string[] {
    const dependencies = [
      'jest',
      'puppeteer',
      '@testing-library/jest-dom'
    ];

    if (options.typescript) {
      dependencies.push('@types/jest', '@types/puppeteer');
    }

    // Add domain-specific dependencies
    if (scenario.domain === 'e-commerce') {
      dependencies.push('cheerio'); // For HTML parsing
    }

    return dependencies;
  }

  private generateTestCommands(fileName: string, options: ConversionOptions): string[] {
    const commands = [
      `npm test -- ${fileName}`,
      `npm run test:e2e -- --testNamePattern="${fileName}"`
    ];

    if (options.includeComments) {
      commands.push(`npm run test:coverage -- ${fileName}`);
    }

    return commands;
  }

  async convertBatch(
    scenarios: GeneratedScenario[],
    options: ConversionOptions = {
      outputFormat: 'jest',
      typescript: true,
      includeComments: true,
      includeImports: true,
      testFramework: 'jest'
    }
  ): Promise<ConvertedCode[]> {
    console.log(`🔄 Converting ${scenarios.length} scenarios...`);

    const results: ConvertedCode[] = [];
    
    for (const scenario of scenarios) {
      try {
        const convertedCode = await this.convertScenario(scenario, options);
        results.push(convertedCode);
      } catch (error) {
        console.error(`❌ Failed to convert scenario ${scenario.id}:`, error);
      }
    }

    // Generate index file for batch
    await this.generateBatchIndex(results, options);

    console.log(`✅ Converted ${results.length} scenarios successfully`);
    return results;
  }

  private async generateBatchIndex(
    convertedCodes: ConvertedCode[],
    options: ConversionOptions
  ): Promise<void> {
    const indexContent = `
// Auto-generated test index
// Generated at: ${new Date().toISOString()}

describe('AI Generated Test Suite', () => {
  ${convertedCodes.map(code => `
  describe('${path.basename(code.filePath, path.extname(code.filePath))}', () => {
    // Test file: ${code.filePath}
    // Scenario ID: ${code.metadata.scenarioId}
    // Estimated runtime: ${code.metadata.estimatedRunTime}s
  });`).join('\n')}
});

export const generatedTests = [
  ${convertedCodes.map(code => `{
    filePath: '${code.filePath}',
    scenarioId: '${code.metadata.scenarioId}',
    estimatedRunTime: ${code.metadata.estimatedRunTime}
  }`).join(',\n  ')}
];
    `;

    const indexPath = path.join(
      process.cwd(),
      'e2e',
      'scenarios',
      'converted',
      `index.${options.typescript ? 'ts' : 'js'}`
    );

    await fs.writeFile(indexPath, indexContent);
    console.log(`📄 Generated batch index: ${indexPath}`);
  }

  async validateConvertedCode(convertedCode: ConvertedCode): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if file exists
      if (!await fs.pathExists(convertedCode.filePath)) {
        errors.push('Generated file does not exist');
      }

      // Basic syntax validation (simplified)
      const content = convertedCode.content;
      
      if (!content.includes('describe(')) {
        errors.push('Missing describe block');
      }

      if (!content.includes('it(')) {
        errors.push('Missing test case');
      }

      if (!content.includes('expect(')) {
        warnings.push('No assertions found');
      }

      // Check for required imports
      const requiredImports = ['BrowserManager', 'CrawlerUtils'];
      for (const importName of requiredImports) {
        if (!content.includes(importName)) {
          errors.push(`Missing import: ${importName}`);
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
}