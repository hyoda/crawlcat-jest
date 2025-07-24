#!/usr/bin/env node

import * as readline from 'readline';
import { NaturalLanguageScenarioGenerator, ScenarioRequirements } from './natural-language-generator';
import { ScenarioConverter, ConversionOptions } from './scenario-converter';

class ScenarioGeneratorCLI {
  private generator: NaturalLanguageScenarioGenerator;
  private converter: ScenarioConverter;
  private rl: readline.Interface;

  constructor() {
    this.generator = new NaturalLanguageScenarioGenerator();
    this.converter = new ScenarioConverter();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start(): Promise<void> {
    console.log('🤖 AI-Powered Test Scenario Generator');
    console.log('=====================================\n');

    try {
      await this.showMainMenu();
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      this.rl.close();
    }
  }

  private async showMainMenu(): Promise<void> {
    console.log('Choose an option:');
    console.log('1. Generate new scenario from natural language');
    console.log('2. Convert scenario to test code');
    console.log('3. List existing scenarios');
    console.log('4. Batch convert scenarios');
    console.log('5. Exit\n');

    const choice = await this.prompt('Enter your choice (1-5): ');

    switch (choice.trim()) {
      case '1':
        await this.generateScenario();
        break;
      case '2':
        await this.convertScenario();
        break;
      case '3':
        await this.listScenarios();
        break;
      case '4':
        await this.batchConvert();
        break;
      case '5':
        console.log('👋 Goodbye!');
        return;
      default:
        console.log('❌ Invalid choice. Please try again.\n');
        await this.showMainMenu();
    }
  }

  private async generateScenario(): Promise<void> {
    console.log('\n📝 Generate New Scenario');
    console.log('=========================\n');

    // Get natural language description
    const description = await this.prompt('자연어로 테스트 시나리오를 설명해주세요:\n> ');

    if (!description.trim()) {
      console.log('❌ Description cannot be empty.\n');
      return this.showMainMenu();
    }

    // Get domain
    console.log('\n도메인을 선택해주세요:');
    console.log('1. E-commerce (전자상거래)');
    console.log('2. News (뉴스)');
    console.log('3. Social Media (소셜미디어)');
    console.log('4. General (일반)');

    const domainChoice = await this.prompt('선택 (1-4): ');
    const domainMap = {
      '1': 'e-commerce',
      '2': 'news',
      '3': 'social-media',
      '4': 'general'
    };
    const domain = domainMap[domainChoice.trim() as keyof typeof domainMap] || 'general';

    // Get complexity
    console.log('\n복잡도를 선택해주세요:');
    console.log('1. Basic (기본)');
    console.log('2. Intermediate (중급)');
    console.log('3. Advanced (고급)');

    const complexityChoice = await this.prompt('선택 (1-3): ');
    const complexityMap = {
      '1': 'basic',
      '2': 'intermediate',
      '3': 'advanced'
    };
    const complexity = complexityMap[complexityChoice.trim() as keyof typeof complexityMap] || 'basic';

    // Create requirements
    const requirements: ScenarioRequirements = {
      description,
      domain: domain as any,
      complexity: complexity as any,
      language: 'ko',
      expectedActions: [],
      expectedResults: []
    };

    console.log('\n🔄 Generating scenario...');

    try {
      const scenario = await this.generator.generateScenario(requirements);
      
      console.log('\n✅ Scenario generated successfully!');
      console.log(`📋 Title: ${scenario.title}`);
      console.log(`🆔 ID: ${scenario.id}`);
      console.log(`📊 Steps: ${scenario.steps.length}`);
      console.log(`🔍 Assertions: ${scenario.assertions.length}`);
      console.log(`⏱️  Estimated Duration: ${scenario.metadata.estimatedDuration}s`);

      // Ask if user wants to convert to code
      const shouldConvert = await this.prompt('\n코드로 변환하시겠습니까? (y/n): ');
      if (shouldConvert.toLowerCase() === 'y' || shouldConvert.toLowerCase() === 'yes') {
        await this.convertScenarioById(scenario.id);
      }

    } catch (error) {
      console.error('❌ Failed to generate scenario:', error);
    }

    console.log('\n');
    await this.showMainMenu();
  }

  private async convertScenario(): Promise<void> {
    console.log('\n🔄 Convert Scenario to Code');
    console.log('============================\n');

    // List available scenarios
    const scenarios = await this.generator.listScenarios();
    
    if (scenarios.length === 0) {
      console.log('❌ No scenarios found. Generate one first.\n');
      return this.showMainMenu();
    }

    console.log('Available scenarios:');
    scenarios.forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.title} (${scenario.id})`);
    });

    const choice = await this.prompt('\nSelect scenario to convert (number): ');
    const selectedIndex = parseInt(choice.trim()) - 1;

    if (selectedIndex < 0 || selectedIndex >= scenarios.length) {
      console.log('❌ Invalid selection.\n');
      return this.showMainMenu();
    }

    await this.convertScenarioById(scenarios[selectedIndex].id);
    await this.showMainMenu();
  }

  private async convertScenarioById(scenarioId: string): Promise<void> {
    const scenario = await this.generator.loadScenario(scenarioId);
    
    if (!scenario) {
      console.log('❌ Scenario not found.\n');
      return;
    }

    // Get conversion options
    const options: ConversionOptions = await this.getConversionOptions();

    console.log('\n🔄 Converting scenario to code...');

    try {
      const convertedCode = await this.converter.convertScenario(scenario, options);
      
      console.log('\n✅ Scenario converted successfully!');
      console.log(`📁 File: ${convertedCode.filePath}`);
      console.log(`🧪 Test Commands:`);
      convertedCode.testCommands.forEach(cmd => console.log(`  - ${cmd}`));

      // Validate converted code
      const validation = await this.converter.validateConvertedCode(convertedCode);
      
      if (validation.isValid) {
        console.log('✅ Code validation passed');
      } else {
        console.log('⚠️  Code validation warnings:');
        validation.errors.forEach(error => console.log(`  - ❌ ${error}`));
        validation.warnings.forEach(warning => console.log(`  - ⚠️  ${warning}`));
      }

    } catch (error) {
      console.error('❌ Failed to convert scenario:', error);
    }
  }

  private async getConversionOptions(): Promise<ConversionOptions> {
    console.log('\n⚙️  Conversion Options');
    console.log('======================');

    // TypeScript
    const useTypeScript = await this.prompt('Use TypeScript? (y/n) [y]: ');
    const typescript = useTypeScript.toLowerCase() !== 'n';

    // Include comments
    const includeCommentsInput = await this.prompt('Include comments? (y/n) [y]: ');
    const includeComments = includeCommentsInput.toLowerCase() !== 'n';

    return {
      outputFormat: 'jest',
      typescript,
      includeComments,
      includeImports: true,
      testFramework: 'jest'
    };
  }

  private async listScenarios(): Promise<void> {
    console.log('\n📋 Existing Scenarios');
    console.log('=====================\n');

    try {
      const scenarios = await this.generator.listScenarios();
      
      if (scenarios.length === 0) {
        console.log('❌ No scenarios found.');
      } else {
        scenarios.forEach((scenario, index) => {
          console.log(`${index + 1}. ${scenario.title}`);
          console.log(`   🆔 ID: ${scenario.id}`);
          console.log(`   🏷️  Domain: ${scenario.domain}`);
          console.log(`   📊 Complexity: ${scenario.complexity}`);
          console.log(`   ⏱️  Duration: ${scenario.metadata.estimatedDuration}s`);
          console.log(`   📅 Created: ${new Date(scenario.metadata.createdAt).toLocaleString()}`);
          console.log('');
        });
      }
    } catch (error) {
      console.error('❌ Failed to list scenarios:', error);
    }

    console.log('');
    await this.showMainMenu();
  }

  private async batchConvert(): Promise<void> {
    console.log('\n🔄 Batch Convert Scenarios');
    console.log('===========================\n');

    try {
      const scenarios = await this.generator.listScenarios();
      
      if (scenarios.length === 0) {
        console.log('❌ No scenarios found.\n');
        return this.showMainMenu();
      }

      console.log(`Found ${scenarios.length} scenarios to convert.`);
      const confirm = await this.prompt('Proceed with batch conversion? (y/n): ');
      
      if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        console.log('❌ Batch conversion cancelled.\n');
        return this.showMainMenu();
      }

      const options = await this.getConversionOptions();
      
      console.log('\n🔄 Converting scenarios...');
      const results = await this.converter.convertBatch(scenarios, options);
      
      console.log(`\n✅ Batch conversion completed!`);
      console.log(`📊 Successfully converted: ${results.length}/${scenarios.length} scenarios`);
      
      if (results.length > 0) {
        console.log('\n📁 Generated files:');
        results.forEach(result => {
          console.log(`  - ${result.filePath}`);
        });
      }

    } catch (error) {
      console.error('❌ Batch conversion failed:', error);
    }

    console.log('');
    await this.showMainMenu();
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new ScenarioGeneratorCLI();
  cli.start().catch(console.error);
}

export { ScenarioGeneratorCLI };