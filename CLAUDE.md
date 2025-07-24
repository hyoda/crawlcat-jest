# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jest and Puppeteer learning project (`crawlcat-jest`) focused on scenario-based testing, web crawling automation, and code generation. The project follows a structured approach from basic Jest testing to advanced Puppeteer crawling with automated code generation workflows, including AI-powered natural language scenario generation.

## Commands

### Testing Commands
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Puppeteer
- `npm run test:coverage` - Generate test coverage report

### Development Commands
- `npm run lint` - Run linting (if configured)
- `npm run typecheck` - Run TypeScript type checking (if configured)
- `npm run generate:code` - Generate code from crawling results

### AI-Powered Commands
- `npm run ai:generate-scenario` - Generate test scenario from natural language description
- `npm run ai:convert-scenario` - Convert natural language scenario to code
- `npm run ai:review-code` - AI-powered code review
- `npm run ai:expand-testcases` - Generate additional test cases using AI

### Puppeteer-specific Commands
- Tests should be run with sufficient timeout (30 seconds for complex crawling scenarios)
- Use `headless: false` during development to observe browser behavior
- Screenshots and generated code are saved to `e2e/outputs/`

## Architecture

### Core Structure
The project follows a multi-layered architecture:

1. **Basic Testing Layer** (`src/__tests__/`): Unit tests using Jest
2. **Utility Libraries** (`lib/`): Reusable Puppeteer utilities and helpers
3. **Crawling Logic** (`src/crawlers/`): Business logic for web scraping
4. **Code Generation** (`src/generators/`): Template-based code generation from crawling results
5. **E2E Scenarios** (`e2e/scenarios/`): End-to-end testing scenarios
6. **AI Integration** (`ai/`): Natural language scenario generation and AI-powered tools

### Key Components

**BrowserManager** (`lib/puppeteer-utils/browser-manager.ts`): Centralized browser lifecycle management
- Handles browser launch/close operations
- Provides consistent page setup with viewport and user agent configuration

**CrawlerUtils** (`lib/puppeteer-utils/crawler-utils.ts`): Utility functions for common crawling operations
- Element waiting and text extraction
- Click and scroll automation
- Error handling for missing elements

**EcommerceCrawler** (`src/crawlers/ecommerce-crawler.ts`): Domain-specific crawling logic
- Product information extraction
- Pagination handling
- Price monitoring capabilities

**CodeGenerator** (`src/generators/code-generator.ts`): Template-based code generation
- Uses Handlebars templates for code generation
- Generates API classes, database schemas, and React components from crawling data

**NaturalLanguageScenarioGenerator** (`ai/scenario-generator/natural-language-generator.ts`): AI-powered scenario generation
- Converts natural language descriptions to structured test scenarios
- Supports multiple domains (e-commerce, news, social media)
- Handles complexity levels (basic, intermediate, advanced)

**ScenarioConverter** (`ai/scenario-generator/scenario-converter.ts`): Natural language to code conversion
- Transforms natural language scenarios into executable test code
- Generates Jest tests, crawler logic, and validation code
- Maintains code quality and best practices

### Test Organization

Tests are organized by complexity and purpose:
- **Unit Tests**: Basic functionality testing with Jest matchers
- **Crawling Tests**: Puppeteer-based web scraping validation
- **Integration Tests**: Full workflow from crawling to code generation
- **Scenario Tests**: End-to-end user flow automation
- **AI-Generated Tests**: Tests created from natural language descriptions

### Data Flow

1. **Natural Language Input**: User describes desired test scenario in plain English
2. **AI Processing**: NaturalLanguageScenarioGenerator creates structured scenario
3. **Code Conversion**: ScenarioConverter transforms scenario into executable code
4. **Crawling Phase**: Puppeteer extracts structured data from web pages
5. **Validation Phase**: DataValidator ensures data quality and completeness  
6. **Generation Phase**: CodeGenerator creates functional code from templates
7. **Testing Phase**: Generated code is validated and tested automatically

## Development Guidelines

### Testing Patterns
- Use `beforeAll`/`afterAll` for expensive setup like browser launching
- Use `beforeEach`/`afterEach` for test isolation (new pages, cleanup)
- Always use `expect.assertions()` for async error testing
- Screenshots should be saved to `e2e/outputs/` for debugging

### Puppeteer Best Practices
- Always wait for elements before interacting (`waitForSelector`)
- Use meaningful timeouts (5000ms default, 30000ms for complex operations)
- Handle navigation with `waitForNavigation` after click events
- Use `page.evaluate()` for client-side data extraction

### Code Generation
- Templates are stored in `lib/code-templates/` as Handlebars files
- Generated code should be placed in `e2e/outputs/generated/`
- All generated code must be validated before use
- Template data should be validated through DataValidator

### AI Learning Integration
The project incorporates AI-assisted learning strategies:
- **Natural Language Scenario Generation**: Convert plain English descriptions to test scenarios
- **AI-Powered Code Review**: Automated code quality analysis and improvement suggestions
- **Error Analysis and Debugging**: AI assistance for troubleshooting test failures
- **Scenario Expansion**: Generate additional test cases and edge cases
- **Code Quality Improvement**: AI feedback for better test structure and coverage

### Natural Language Workflow
The AI integration follows a structured workflow:
1. **Input Processing**: Parse natural language description into structured requirements
2. **Scenario Generation**: Create detailed test scenario with steps and expectations
3. **Code Conversion**: Transform scenario into executable Jest + Puppeteer code
4. **Validation**: Ensure generated code follows best practices and project conventions
5. **Execution**: Run generated tests and collect results
6. **Iteration**: Use AI feedback to improve and expand test scenarios

## File Structure Conventions

```
crawlcat-jest/
├── src/
│   ├── crawlers/           # Domain-specific crawling logic
│   ├── generators/         # Code generation utilities  
│   ├── utils/              # General utility functions
│   └── __tests__/          # Unit tests
├── e2e/
│   ├── scenarios/          # E2E test scenarios
│   │   ├── ai-generated/   # AI-generated scenarios
│   │   ├── natural-language/ # Natural language scenarios
│   │   └── converted/      # Converted scenarios
│   ├── pages/             # Page object models
│   ├── fixtures/          # Test data
│   └── outputs/           # Screenshots and generated code
├── ai/
│   ├── scenario-generator/ # Natural language scenario generation
│   ├── prompt-templates/   # AI prompt templates
│   ├── test-case-generator/ # Test case generation
│   └── code-reviewer/     # AI code review
├── lib/
│   ├── puppeteer-utils/   # Puppeteer helper functions
│   ├── code-templates/    # Handlebars templates
│   └── validators/        # Data validation logic
├── prompts/
│   ├── scenario-prompts/  # Scenario generation prompts
│   ├── test-prompts/      # Test generation prompts
│   └── review-prompts/    # Review prompts
└── examples/              # Learning examples and tutorials
```

## Dependencies

### Core Testing
- `jest`: Testing framework
- `puppeteer`: Browser automation
- `@testing-library/jest-dom`: DOM testing utilities

### Code Generation  
- `handlebars`: Template engine
- `fs-extra`: Enhanced file system operations
- `cheerio`: Server-side HTML parsing

### AI Integration
- `openai`: OpenAI API integration for natural language processing
- `langchain`: Framework for building AI applications
- `prompts`: Prompt management and templating

### TypeScript Support
- `@types/jest`, `@types/puppeteer`: Type definitions
- `ts-jest`: TypeScript Jest transformer

## Learning Progression

The project is designed for progressive learning:
1. **Basic Jest** → Unit testing fundamentals
2. **Async Testing** → Promise and mock handling  
3. **Puppeteer Basics** → Browser automation
4. **Complex Scenarios** → Multi-step crawling workflows
5. **Code Generation** → Template-based development
6. **Natural Language AI** → AI-powered scenario generation
7. **CI/CD Integration** → Automated testing pipelines

Each stage builds upon the previous, with comprehensive examples and AI-guided learning prompts available in the documentation files.

## AI Integration Examples

### Natural Language Scenario Generation
```typescript
// User input: "크롤링 아마존에서 노트북 상품들을 가져와서 가격 비교해줘"
const workflow = new NaturalLanguageWorkflow();
const result = await workflow.createScenarioFromNaturalLanguage(
  "크롤링 아마존에서 노트북 상품들을 가져와서 가격 비교해줘",
  "e-commerce"
);
// Result: Complete test scenario with Jest + Puppeteer code
```

### AI-Powered Code Review
```typescript
// AI reviews generated code and suggests improvements
const reviewer = new AICodeReviewer();
const review = await reviewer.reviewCode(generatedTestCode);
// Result: Code quality analysis and improvement suggestions
```

### Test Case Expansion
```typescript
// AI generates additional test cases for edge scenarios
const expander = new TestCaseExpander();
const additionalTests = await expander.expandTestCases(existingTest);
// Result: Additional test cases for better coverage
```