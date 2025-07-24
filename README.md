# 🤖 CrawlCat Jest - AI-Powered Testing Framework

[![Jest](https://img.shields.io/badge/Jest-29.7.0-red.svg)](https://jestjs.io/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-21.5.2-green.svg)](https://pptr.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![AI-Powered](https://img.shields.io/badge/AI-Powered-purple.svg)](#ai-features)

An advanced Jest and Puppeteer learning project that combines traditional web crawling with AI-powered natural language scenario generation. Transform plain English descriptions into executable test code, crawl real websites, and automatically generate production-ready code from your data.

## 🌟 Features

### 🧪 Core Testing Capabilities
- **Jest Fundamentals**: Comprehensive examples from basic unit tests to complex integration scenarios
- **Puppeteer Automation**: Full browser automation with advanced crawling utilities
- **E2E Testing**: Complete end-to-end test scenarios with real-world examples
- **Performance Testing**: Built-in performance monitoring and scalability testing

### 🤖 AI-Powered Innovation
- **Natural Language Scenarios**: Convert plain English descriptions to test scenarios
- **Automatic Code Generation**: Generate APIs, database schemas, and React components from crawled data
- **Smart Test Expansion**: AI-generated edge cases and additional test scenarios
- **Code Review Assistant**: Automated code quality analysis and improvement suggestions

### 🕷️ Advanced Web Crawling
- **Intelligent Browser Management**: Automated browser lifecycle with error recovery
- **Multi-Site Crawling**: Support for various e-commerce, news, and social media sites
- **Data Validation**: Built-in data quality assurance and validation pipelines
- **Screenshot Capture**: Automated visual documentation of crawling sessions

### 🔧 Code Generation Engine
- **Template System**: Handlebars-based code generation with customizable templates
- **Multiple Outputs**: Generate TypeScript APIs, SQL schemas, React components, and Jest tests
- **Production Ready**: Generated code follows best practices and includes comprehensive documentation

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd crawlcat-jest

# Install dependencies
npm install

# Build the project
npm run build
```

### Basic Usage

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:e2e              # E2E tests only
npm run test:coverage         # With coverage report

# AI-powered commands
npm run ai:generate-scenario  # Generate scenario from natural language
npm run ai:convert-scenario   # Convert scenario to executable code
npm run ai:review-code       # AI code review
```

### Your First AI-Generated Test

1. **Generate a scenario from natural language:**
```bash
npm run ai:generate-scenario
```

2. **Describe your test in Korean or English:**
```text
아마존에서 노트북을 검색하고 가격을 비교해서 가장 저렴한 제품을 찾아줘
(Search for laptops on Amazon, compare prices, and find the cheapest product)
```

3. **Convert to executable code:**
```bash
npm run ai:convert-scenario
```

4. **Run your generated test:**
```bash
npm test -- --testPathPattern=converted
```

## 📁 Project Structure

```
crawlcat-jest/
├── 🤖 ai/                    # AI integration components
│   ├── scenario-generator/   # Natural language processing
│   ├── code-reviewer/       # AI code review
│   └── test-case-generator/ # Test expansion
├── 📚 examples/              # Learning examples
│   ├── basic-tests/         # Jest fundamentals
│   ├── crawling-tests/      # Puppeteer examples
│   └── automation-tests/    # Full workflow demos
├── 🔧 lib/                   # Core utilities
│   ├── puppeteer-utils/     # Browser automation
│   ├── code-templates/      # Generation templates
│   └── validators/          # Data validation
├── 🕷️ src/                   # Main source code
│   ├── crawlers/            # Crawling logic
│   ├── generators/          # Code generation
│   └── utils/               # Utility functions
└── 🧪 e2e/                   # Test scenarios
    ├── scenarios/           # Test definitions
    ├── outputs/            # Generated code & screenshots
    └── fixtures/           # Test data
```

## 🎯 Learning Path

### 1. **Jest Fundamentals** (Start Here)
```bash
# Run basic Jest examples
npm test examples/basic-tests/

# Learn: describe, test, expect, matchers, async testing
```

### 2. **Puppeteer Automation**
```bash
# Run crawling examples
npm test examples/crawling-tests/

# Learn: Browser automation, element interaction, data extraction
```

### 3. **AI-Powered Scenarios**
```bash
# Generate your first AI scenario
npm run ai:generate-scenario

# Learn: Natural language processing, scenario conversion
```

### 4. **Full Workflow Integration**
```bash
# Run complete workflow
npm test examples/automation-tests/

# Learn: Crawl → Validate → Generate → Test pipeline
```

### 5. **Advanced Code Generation**
```bash
# Generate production code from crawled data
npm run generate:code

# Learn: Template systems, code validation, integration testing
```

## 🤖 AI Features Deep Dive

### Natural Language Scenario Generation

Transform everyday language into comprehensive test scenarios:

```typescript
// Input: "크롤링 쇼핑몰에서 할인 상품만 찾아서 정렬해줘"
// Output: Complete Jest + Puppeteer test with:
// - Navigation to shopping site
// - Product filtering by discount
// - Price comparison and sorting
// - Data validation and assertions
```

### Intelligent Code Generation

Generate production-ready code from crawled data:

```typescript
// From crawled product data, generate:
// ✅ TypeScript API with full CRUD operations
// ✅ SQL database schema with indexes and procedures
// ✅ React components with hooks and state management
// ✅ Comprehensive Jest test suites
// ✅ Documentation and usage examples
```

### AI-Powered Code Review

Automated analysis and improvement suggestions:

```typescript
// AI reviews your code for:
// ✅ Best practices compliance
// ✅ Performance optimizations
// ✅ Security vulnerabilities
// ✅ Test coverage gaps
// ✅ Code maintainability
```

## 🌐 Supported Crawling Scenarios

### E-commerce
- Product information extraction
- Price monitoring and comparison
- Review analysis and sentiment tracking
- Inventory status monitoring

### News & Media
- Article content extraction
- Author and publication data
- Comment and engagement metrics
- Content categorization

### Social Media
- Post and comment extraction
- User profile analysis
- Engagement tracking
- Trending content identification

### Custom Sites
- Flexible selector configuration
- Dynamic content handling
- API integration support
- Custom validation rules

## 🧪 Testing Examples

### Basic Jest Test
```typescript
describe('Calculator', () => {
  test('should add numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### Puppeteer Crawling Test
```typescript
describe('E-commerce Crawling', () => {
  test('should extract product information', async () => {
    await page.goto('https://example-shop.com');
    const products = await crawler.extractProductList(page);
    expect(products.length).toBeGreaterThan(0);
  });
});
```

### AI-Generated Scenario Test
```typescript
// Generated from: "아마존에서 베스트셀러 책들을 찾아줘"
describe('Amazon Bestseller Books', () => {
  test('should find bestseller books with ratings', async () => {
    await page.goto('https://amazon.com/best-sellers-books');
    const books = await crawler.extractBookList(page);
    
    books.forEach(book => {
      expect(book.title).toBeTruthy();
      expect(book.rating).toBeGreaterThan(4.0);
      expect(book.salesRank).toBeLessThanOrEqual(100);
    });
  });
});
```

## 🔧 Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts']
};
```

### Browser Configuration
```typescript
// Browser settings for different scenarios
const config = {
  development: { headless: false, slowMo: 100 },
  testing: { headless: true, timeout: 30000 },
  production: { headless: true, timeout: 60000 }
};
```

### AI Configuration
```typescript
// AI model settings
const aiConfig = {
  language: 'ko', // or 'en'
  complexity: 'intermediate', // basic, intermediate, advanced
  domain: 'e-commerce' // e-commerce, news, social-media, general
};
```

## 📊 Performance Monitoring

Built-in performance tracking for all operations:

```typescript
// Automatic metrics collection
📊 Workflow Metrics:
  - Products crawled: 150
  - Validation rate: 94.7%
  - Generation time: 3.2s
  - Code quality score: 8.7/10
  - Test coverage: 89%
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run the test suite: `npm test`
5. Submit a pull request

### Adding New Templates
```bash
# Create new Handlebars template
touch lib/code-templates/my-template.hbs

# Add template logic to CodeGenerator
# Test with: npm run generate:code
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [AI Integration Guide](docs/ai-integration.md)
- [Crawling Best Practices](docs/crawling-guide.md)
- [Template Development](docs/template-guide.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🔍 Troubleshooting

### Common Issues

**Browser Launch Failed**
```bash
# Install browser dependencies
npm run setup:browser
```

**AI Scenario Generation Slow**
```bash
# Check network connection and API limits
npm run ai:status
```

**Generated Code Errors**
```bash
# Validate and fix generated code
npm run validate:generated
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jest](https://jestjs.io/) - Delightful JavaScript Testing
- [Puppeteer](https://pptr.dev/) - Headless Chrome Node.js API
- [Handlebars](https://handlebarsjs.com/) - Semantic Templates
- [OpenAI](https://openai.com/) - AI Language Models

---

**🚀 Ready to revolutionize your testing workflow with AI?**

Start with `npm run ai:generate-scenario` and watch your natural language descriptions transform into production-ready test code!