# Jest와 Puppeteer를 이용한 테스트 가이드
_Exported on 2025. 7. 25. at 0시 23분 1초 GMT+9 from Cursor (1.2.4)_

---

**User**

@learning-guide.html @Jest 초심자 학습 가이드_.md 이 프로젝트 내에서 jest, puppeteer를 이용한 시나리오 기반의 테스트를 학습 가이드를 통해서 실질적으로 해보고 싶어. 워크플로우와 인스트럭션 및 기반 셋팅이 필요해 보이는데, 어떻게 준비하고 진행하면 되는지에 관련한 지침을 좀 알려주면 검토해볼께.

---

**Cursor**

현재 프로젝트를 분석해보니 Jest와 Puppeteer를 활용한 시나리오 기반 테스트 학습을 위한 실습 환경을 구축하고 싶으시는군요. 첨부된 학습 가이드와 HTML 파일을 기반으로 체계적인 워크플로우를 제안해드리겠습니다.


현재 프로젝트를 분석한 결과, Jest와 Puppeteer를 활용한 시나리오 기반 테스트 학습을 위한 체계적인 워크플로우를 제안해드리겠습니다.

## �� **Jest + Puppeteer 시나리오 테스트 학습 워크플로우**

### **1단계: 프로젝트 환경 구축**

먼저 현재 프로젝트에 필요한 의존성들을 설치하고 설정해야 합니다:

```bash
# 1. 기존 의존성 확인 및 추가 설치
npm install --save-dev jest puppeteer @testing-library/jest-dom

# 2. TypeScript 지원을 위한 추가 패키지
npm install --save-dev @types/jest @types/puppeteer ts-jest

# 3. E2E 테스트를 위한 추가 도구
npm install --save-dev jest-puppeteer
```

### **2단계: Jest 설정 파일 생성**

프로젝트 루트에 `jest.config.js` 파일을 생성:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### **3단계: 학습 시나리오 구조 설계**

다음과 같은 폴더 구조를 제안합니다:

```
crawlcat-jest/
├── src/
│   ├── components/          # React 컴포넌트
│   ├── utils/              # 유틸리티 함수
│   └── __tests__/          # 단위 테스트
├── e2e/
│   ├── scenarios/          # 시나리오 기반 테스트
│   ├── pages/             # 페이지 객체 모델
│   └── fixtures/          # 테스트 데이터
├── docs/
│   └── learning-guide/    # 학습 가이드 문서
└── examples/
    ├── basic-tests/       # 기본 Jest 예제
    ├── puppeteer-tests/   # Puppeteer 예제
    └── integration-tests/ # 통합 테스트 예제
```

### **4단계: 단계별 학습 시나리오**

#### **시나리오 1: 기본 Jest 테스트 마스터하기**
- 학습 가이드 Part I-III 기반
- 간단한 유틸리티 함수 테스트 작성
- 매처(Matcher) 활용법 익히기

#### **시나리오 2: 비동기 및 모킹 테스트**
- 학습 가이드 Part VI-VII 기반
- API 호출 함수 테스트
- 외부 의존성 모킹 연습

#### **시나리오 3: React 컴포넌트 테스트**
- 학습 가이드 Part IX 기반
- React Testing Library 활용
- 사용자 인터랙션 테스트

#### **시나리오 4: Puppeteer E2E 테스트**
- 웹 페이지 자동화 테스트
- 시나리오 기반 사용자 플로우 테스트
- 스크린샷 및 비디오 캡처

### **5단계: 실습 프로젝트 예제**

다음과 같은 실습용 예제들을 제안합니다:

```typescript
// 1. 기본 유틸리티 함수 테스트
// src/utils/calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// src/__tests__/calculator.test.ts
import { Calculator } from '../utils/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(calculator.add(-1, -2)).toBe(-3);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(calculator.divide(6, 2)).toBe(3);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero');
    });
  });
});
```

### **6단계: Puppeteer E2E 테스트 예제**

```typescript
// e2e/scenarios/login-flow.test.ts
import puppeteer from 'puppeteer';

describe('Login Flow E2E', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // 개발 중에는 브라우저를 보면서 테스트
      slowMo: 100, // 각 액션 사이에 100ms 지연
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should login successfully with valid credentials', async () => {
    // 로그인 폼 찾기
    await page.waitForSelector('#email');
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123');
    
    // 로그인 버튼 클릭
    await page.click('#login-button');
    
    // 로그인 성공 후 리다이렉트 확인
    await page.waitForNavigation();
    await expect(page.url()).toContain('/dashboard');
    
    // 사용자 정보 표시 확인
    const userInfo = await page.$eval('.user-info', el => el.textContent);
    expect(userInfo).toContain('test@example.com');
  });

  it('should show error message with invalid credentials', async () => {
    await page.waitForSelector('#email');
    await page.type('#email', 'invalid@example.com');
    await page.type('#password', 'wrongpassword');
    
    await page.click('#login-button');
    
    // 에러 메시지 확인
    await page.waitForSelector('.error-message');
    const errorText = await page.$eval('.error-message', el => el.textContent);
    expect(errorText).toContain('Invalid credentials');
  });
});
```

### **7단계: 학습 진행 체크리스트**

- [ ] Jest 기본 설정 완료
- [ ] 첫 번째 테스트 작성 및 실행
- [ ] 매처(Matcher) 활용법 익히기
- [ ] 비동기 테스트 작성
- [ ] 모킹(Mocking) 기법 학습
- [ ] React 컴포넌트 테스트
- [ ] Puppeteer 설치 및 기본 사용법
- [ ] E2E 테스트 시나리오 작성
- [ ] 스크린샷 테스트 구현
- [ ] CI/CD 파이프라인에 테스트 통합

### **8단계: AI 협업 학습 전략**

학습 가이드에서 제안한 AI 활용 전략을 실습에 적용:

1. **개념 설명 요청**: "Puppeteer의 page.waitForSelector와 page.waitForNavigation의 차이점을 설명해줘"
2. **코드 리뷰**: 작성한 테스트 코드를 AI에게 리뷰 요청
3. **오류 해결**: 테스트 실행 중 발생한 오류를 AI에게 분석 요청
4. **시나리오 확장**: 기본 테스트를 더 복잡한 시나리오로 확장

이 워크플로우를 따라가면서 각 단계별로 실습해보시면 Jest와 Puppeteer를 활용한 시나리오 기반 테스트를 체계적으로 학습할 수 있을 것입니다. 특정 단계에서 막히는 부분이 있으시면 언제든지 질문해주세요!

```shellscript
# 1. 기존 의존성 확인 및 추가 설치
npm install --save-dev jest puppeteer @testing-library/jest-dom

# 2. TypeScript 지원을 위한 추가 패키지
npm install --save-dev @types/jest @types/puppeteer ts-jest

# 3. E2E 테스트를 위한 추가 도구
npm install --save-dev jest-puppeteer
```

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

```plaintext
crawlcat-jest/
├── src/
│   ├── components/          # React 컴포넌트
│   ├── utils/              # 유틸리티 함수
│   └── __tests__/          # 단위 테스트
├── e2e/
│   ├── scenarios/          # 시나리오 기반 테스트
│   ├── pages/             # 페이지 객체 모델
│   └── fixtures/          # 테스트 데이터
├── docs/
│   └── learning-guide/    # 학습 가이드 문서
└── examples/
    ├── basic-tests/       # 기본 Jest 예제
    ├── puppeteer-tests/   # Puppeteer 예제
    └── integration-tests/ # 통합 테스트 예제
```

```typescript
// 1. 기본 유틸리티 함수 테스트
// src/utils/calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// src/__tests__/calculator.test.ts
import { Calculator } from '../utils/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(calculator.add(-1, -2)).toBe(-3);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(calculator.divide(6, 2)).toBe(3);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero');
    });
  });
});
```

```typescript
// e2e/scenarios/login-flow.test.ts
import puppeteer from 'puppeteer';

describe('Login Flow E2E', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // 개발 중에는 브라우저를 보면서 테스트
      slowMo: 100, // 각 액션 사이에 100ms 지연
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should login successfully with valid credentials', async () => {
    // 로그인 폼 찾기
    await page.waitForSelector('#email');
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123');
    
    // 로그인 버튼 클릭
    await page.click('#login-button');
    
    // 로그인 성공 후 리다이렉트 확인
    await page.waitForNavigation();
    await expect(page.url()).toContain('/dashboard');
    
    // 사용자 정보 표시 확인
    const userInfo = await page.$eval('.user-info', el => el.textContent);
    expect(userInfo).toContain('test@example.com');
  });

  it('should show error message with invalid credentials', async () => {
    await page.waitForSelector('#email');
    await page.type('#email', 'invalid@example.com');
    await page.type('#password', 'wrongpassword');
    
    await page.click('#login-button');
    
    // 에러 메시지 확인
    await page.waitForSelector('.error-message');
    const errorText = await page.$eval('.error-message', el => el.textContent);
    expect(errorText).toContain('Invalid credentials');
  });
});
```

---

**User**

좋아 이걸 기본 테스트로 하고, 좀더 고도화 된 형태에서는 작성한 시나리오를 기반으로 해서 puppeteer를 통한 실제 크롤링 및 자동화 과정 테스트와 성공한 결과에 대해서 프로젝트 구현을 위한 코드로 뽑아내는 과정을 도출하고 싶어. 거기까지 마저 보완해서 구조를 잡아줘

---

**Cursor**

네, 기본 테스트를 넘어서 Puppeteer를 활용한 실제 크롤링 자동화와 코드 생성까지 이어지는 고도화된 워크플로우를 설계해드리겠습니다.

## **고도화된 Jest + Puppeteer 크롤링 자동화 워크플로우**

### **1단계: 확장된 프로젝트 구조**

```
crawlcat-jest/
├── src/
│   ├── components/
│   ├── utils/
│   ├── crawlers/           # 크롤링 로직
│   ├── generators/         # 코드 생성 로직
│   └── __tests__/
├── e2e/
│   ├── scenarios/
│   │   ├── crawling/       # 크롤링 시나리오
│   │   ├── automation/     # 자동화 시나리오
│   │   └── code-gen/       # 코드 생성 시나리오
│   ├── pages/
│   ├── fixtures/
│   └── outputs/           # 생성된 코드 저장소
├── lib/
│   ├── puppeteer-utils/   # Puppeteer 헬퍼 함수
│   ├── code-templates/    # 코드 템플릿
│   └── validators/        # 데이터 검증 로직
├── docs/
│   └── learning-guide/
└── examples/
    ├── basic-tests/
    ├── crawling-tests/
    ├── automation-tests/
    └── code-generation/
```

### **2단계: 고도화된 의존성 설치**

```bash
# 기존 의존성에 추가
npm install --save-dev puppeteer jest-puppeteer
npm install --save-dev @types/puppeteer
npm install --save-dev cheerio # HTML 파싱
npm install --save-dev fs-extra # 파일 시스템 유틸리티
npm install --save-dev handlebars # 템플릿 엔진
npm install --save-dev yaml # 설정 파일 파싱
```

### **3단계: Puppeteer 유틸리티 라이브러리 구축**

```typescript
// lib/puppeteer-utils/browser-manager.ts
import puppeteer, { Browser, Page } from 'puppeteer';

export class BrowserManager {
  private browser: Browser | null = null;

  async launch(options: puppeteer.LaunchOptions = {}) {
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...options
    });
    return this.browser;
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not launched');
    }
    const page = await this.browser.newPage();
    
    // 기본 설정
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    return page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// lib/puppeteer-utils/crawler-utils.ts
import { Page } from 'puppeteer';

export class CrawlerUtils {
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.warn(`Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  static async extractText(page: Page, selector: string): Promise<string> {
    const element = await page.$(selector);
    if (!element) return '';
    
    const text = await page.evaluate(el => el.textContent?.trim() || '', element);
    return text;
  }

  static async extractMultipleTexts(page: Page, selector: string): Promise<string[]> {
    return await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return Array.from(elements).map(el => el.textContent?.trim() || '');
    }, selector);
  }

  static async clickAndWait(page: Page, selector: string, waitFor?: string) {
    await page.click(selector);
    if (waitFor) {
      await page.waitForSelector(waitFor);
    }
  }

  static async scrollToBottom(page: Page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
  }
}
```

### **4단계: 크롤링 시나리오 테스트**

```typescript
// e2e/scenarios/crawling/ecommerce-crawler.test.ts
import { BrowserManager } from '../../../lib/puppeteer-utils/browser-manager';
import { CrawlerUtils } from '../../../lib/puppeteer-utils/crawler-utils';
import { EcommerceCrawler } from '../../../src/crawlers/ecommerce-crawler';

describe('E-commerce Crawling Scenarios', () => {
  let browserManager: BrowserManager;
  let page: any;

  beforeAll(async () => {
    browserManager = new BrowserManager();
    await browserManager.launch();
  });

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browserManager.close();
  });

  describe('Product Information Crawling', () => {
    it('should extract product details from Amazon', async () => {
      const crawler = new EcommerceCrawler();
      
      // Amazon 상품 페이지로 이동
      await page.goto('https://www.amazon.com/dp/B08N5WRWNW');
      
      // 상품 정보 추출
      const productData = await crawler.extractProductInfo(page);
      
      // 검증
      expect(productData.title).toBeTruthy();
      expect(productData.price).toBeTruthy();
      expect(productData.rating).toBeGreaterThan(0);
      expect(productData.reviewCount).toBeGreaterThan(0);
      
      // 스크린샷 저장
      await page.screenshot({ 
        path: 'e2e/outputs/amazon-product.png',
        fullPage: true 
      });
    });

    it('should handle pagination and extract multiple products', async () => {
      const crawler = new EcommerceCrawler();
      
      await page.goto('https://www.amazon.com/s?k=laptop');
      
      const products = await crawler.extractProductList(page, 3); // 3페이지까지
      
      expect(products).toHaveLength(expect.any(Number));
      expect(products[0]).toHaveProperty('title');
      expect(products[0]).toHaveProperty('price');
    });
  });

  describe('Price Monitoring', () => {
    it('should track price changes over time', async () => {
      const crawler = new EcommerceCrawler();
      
      await page.goto('https://www.amazon.com/dp/B08N5WRWNW');
      
      const initialPrice = await crawler.extractPrice(page);
      
      // 가격 변동 모니터링 (실제로는 시간 간격을 두고 실행)
      expect(initialPrice).toBeGreaterThan(0);
      
      // 가격 히스토리 저장
      const priceHistory = await crawler.getPriceHistory('B08N5WRWNW');
      expect(priceHistory).toBeInstanceOf(Array);
    });
  });
});
```

### **5단계: 크롤링 로직 구현**

```typescript
// src/crawlers/ecommerce-crawler.ts
import { Page } from 'puppeteer';
import { CrawlerUtils } from '../../lib/puppeteer-utils/crawler-utils';

export interface ProductInfo {
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: string;
  imageUrl: string;
}

export class EcommerceCrawler {
  async extractProductInfo(page: Page): Promise<ProductInfo> {
    // 제목 추출
    const title = await CrawlerUtils.extractText(page, '#productTitle');
    
    // 가격 추출
    const priceText = await CrawlerUtils.extractText(page, '.a-price-whole');
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // 평점 추출
    const ratingText = await CrawlerUtils.extractText(page, '.a-icon-alt');
    const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || '0');
    
    // 리뷰 수 추출
    const reviewText = await CrawlerUtils.extractText(page, '#acrCustomerReviewText');
    const reviewCount = parseInt(reviewText.match(/(\d+)/)?.[1] || '0');
    
    // 이미지 URL 추출
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('#landingImage') as HTMLImageElement;
      return img?.src || '';
    });

    return {
      title,
      price,
      rating,
      reviewCount,
      availability: await CrawlerUtils.extractText(page, '#availability'),
      imageUrl
    };
  }

  async extractProductList(page: Page, maxPages: number = 1): Promise<ProductInfo[]> {
    const products: ProductInfo[] = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      if (pageNum > 1) {
        await page.goto(`${page.url()}?page=${pageNum}`);
      }
      
      const productElements = await page.$$('[data-component-type="s-search-result"]');
      
      for (const element of productElements) {
        const productInfo = await this.extractProductFromElement(element);
        if (productInfo.title) {
          products.push(productInfo);
        }
      }
    }
    
    return products;
  }

  private async extractProductFromElement(element: any): Promise<ProductInfo> {
    return await element.evaluate((el: Element) => {
      const titleEl = el.querySelector('h2 a span');
      const priceEl = el.querySelector('.a-price-whole');
      const ratingEl = el.querySelector('.a-icon-alt');
      const reviewEl = el.querySelector('.a-size-base');
      const imgEl = el.querySelector('img');
      
      return {
        title: titleEl?.textContent?.trim() || '',
        price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '') || '0'),
        rating: parseFloat(ratingEl?.textContent?.match(/(\d+\.?\d*)/)?.[1] || '0'),
        reviewCount: parseInt(reviewEl?.textContent?.match(/(\d+)/)?.[1] || '0'),
        availability: 'In Stock',
        imageUrl: (imgEl as HTMLImageElement)?.src || ''
      };
    });
  }

  async extractPrice(page: Page): Promise<number> {
    const priceText = await CrawlerUtils.extractText(page, '.a-price-whole');
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  async getPriceHistory(productId: string): Promise<Array<{date: string, price: number}>> {
    // 실제 구현에서는 데이터베이스에서 가격 히스토리를 조회
    return [];
  }
}
```

### **6단계: 코드 생성 시스템**

```typescript
// src/generators/code-generator.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import Handlebars from 'handlebars';

export interface CodeTemplate {
  name: string;
  template: string;
  outputPath: string;
  data: any;
}

export class CodeGenerator {
  private templatesDir = path.join(__dirname, '../../lib/code-templates');

  async generateCode(template: CodeTemplate): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${template.template}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    const compiledTemplate = Handlebars.compile(templateContent);
    const generatedCode = compiledTemplate(template.data);
    
    // 출력 디렉토리 생성
    await fs.ensureDir(path.dirname(template.outputPath));
    
    // 코드 파일 생성
    await fs.writeFile(template.outputPath, generatedCode);
    
    return generatedCode;
  }

  async generateFromCrawlingResults(crawlingData: any): Promise<void> {
    // 크롤링 결과를 기반으로 다양한 코드 생성
    const templates: CodeTemplate[] = [
      {
        name: 'Product API',
        template: 'product-api',
        outputPath: 'e2e/outputs/generated/product-api.ts',
        data: { products: crawlingData.products }
      },
      {
        name: 'Database Schema',
        template: 'database-schema',
        outputPath: 'e2e/outputs/generated/schema.sql',
        data: { products: crawlingData.products }
      },
      {
        name: 'React Component',
        template: 'product-list-component',
        outputPath: 'e2e/outputs/generated/ProductList.tsx',
        data: { products: crawlingData.products }
      }
    ];

    for (const template of templates) {
      await this.generateCode(template);
    }
  }
}
```

### **7단계: 코드 템플릿 시스템**

```handlebars
{{!-- lib/code-templates/product-api.hbs --}}
import { ProductInfo } from '../types/product';

export class ProductAPI {
  private products: ProductInfo[] = [
    {{#each products}}
    {
      id: '{{id}}',
      title: '{{title}}',
      price: {{price}},
      rating: {{rating}},
      reviewCount: {{reviewCount}},
      availability: '{{availability}}',
      imageUrl: '{{imageUrl}}'
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ];

  async getAllProducts(): Promise<ProductInfo[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<ProductInfo | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async searchProducts(query: string): Promise<ProductInfo[]> {
    return this.products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}
```

### **8단계: 통합 자동화 테스트**

```typescript
// e2e/scenarios/automation/full-crawling-workflow.test.ts
import { BrowserManager } from '../../../lib/puppeteer-utils/browser-manager';
import { EcommerceCrawler } from '../../../src/crawlers/ecommerce-crawler';
import { CodeGenerator } from '../../../src/generators/code-generator';
import { DataValidator } from '../../../lib/validators/data-validator';

describe('Full Crawling and Code Generation Workflow', () => {
  let browserManager: BrowserManager;
  let page: any;
  let crawler: EcommerceCrawler;
  let codeGenerator: CodeGenerator;
  let validator: DataValidator;

  beforeAll(async () => {
    browserManager = new BrowserManager();
    await browserManager.launch();
    
    crawler = new EcommerceCrawler();
    codeGenerator = new CodeGenerator();
    validator = new DataValidator();
  });

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browserManager.close();
  });

  it('should complete full workflow: crawl → validate → generate code', async () => {
    // 1단계: 크롤링 실행
    await page.goto('https://www.amazon.com/s?k=laptop');
    
    const products = await crawler.extractProductList(page, 2);
    
    // 2단계: 데이터 검증
    const validationResult = await validator.validateProducts(products);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.validProducts.length).toBeGreaterThan(0);
    
    // 3단계: 코드 생성
    const generatedFiles = await codeGenerator.generateFromCrawlingResults({
      products: validationResult.validProducts
    });
    
    // 4단계: 생성된 코드 검증
    const generatedCode = await fs.readFile(
      'e2e/outputs/generated/product-api.ts', 
      'utf-8'
    );
    
    expect(generatedCode).toContain('class ProductAPI');
    expect(generatedCode).toContain('getAllProducts');
    
    // 5단계: 생성된 코드 테스트
    const testResult = await this.testGeneratedCode(generatedCode);
    expect(testResult.success).toBe(true);
  }, 30000); // 30초 타임아웃

  private async testGeneratedCode(code: string): Promise<{success: boolean}> {
    // 생성된 코드를 동적으로 테스트
    try {
      // 코드를 임시 파일로 저장하고 실행
      const tempFile = 'e2e/outputs/temp-test.ts';
      await fs.writeFile(tempFile, code);
      
      // TypeScript 컴파일 및 실행 테스트
      // 실제 구현에서는 ts-node를 사용하여 동적 실행
      
      return { success: true };
    } catch (error) {
      console.error('Generated code test failed:', error);
      return { success: false };
    }
  }
});
```

### **9단계: 데이터 검증 시스템**

```typescript
// lib/validators/data-validator.ts
import { ProductInfo } from '../../src/crawlers/ecommerce-crawler';

export interface ValidationResult {
  isValid: boolean;
  validProducts: ProductInfo[];
  errors: string[];
}

export class DataValidator {
  validateProducts(products: ProductInfo[]): ValidationResult {
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
      errors.push('Title is too short');
    }

    if (product.price <= 0) {
      errors.push('Invalid price');
    }

    if (product.rating < 0 || product.rating > 5) {
      errors.push('Invalid rating');
    }

    if (product.reviewCount < 0) {
      errors.push('Invalid review count');
    }

    return errors;
  }
}
```

### **10단계: CI/CD 파이프라인 통합**

```yaml
# .github/workflows/crawling-tests.yml
name: Crawling Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  crawling-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm test
    
    - name: Run crawling tests
      run: npm run test:e2e
    
    - name: Generate code from crawling results
      run: npm run generate:code
    
    - name: Upload generated code
      uses: actions/upload-artifact@v2
      with:
        name: generated-code
        path: e2e/outputs/generated/
```

### **11단계: 학습 진행 체크리스트 (고도화)**

- [ ] 기본 Jest 테스트 마스터
- [ ] Puppeteer 기본 사용법 학습
- [ ] 크롤링 시나리오 테스트 작성
- [ ] 데이터 검증 로직 구현
- [ ] 코드 생성 템플릿 시스템 구축
- [ ] 통합 워크플로우 테스트
- [ ] 생성된 코드 품질 검증
- [ ] CI/CD 파이프라인 통합
- [ ] 성능 최적화 (병렬 처리, 캐싱)
- [ ] 에러 처리 및 복구 메커니즘
- [ ] 모니터링 및 로깅 시스템

이 구조를 통해 기본 테스트부터 시작해서 실제 크롤링 자동화, 데이터 검증, 코드 생성까지 이어지는 완전한 워크플로우를 구축할 수 있습니다. 각 단계별로 실습하면서 점진적으로 고도화해나가시면 됩니다!

```plaintext
crawlcat-jest/
├── src/
│   ├── components/
│   ├── utils/
│   ├── crawlers/           # 크롤링 로직
│   ├── generators/         # 코드 생성 로직
│   └── __tests__/
├── e2e/
│   ├── scenarios/
│   │   ├── crawling/       # 크롤링 시나리오
│   │   ├── automation/     # 자동화 시나리오
│   │   └── code-gen/       # 코드 생성 시나리오
│   ├── pages/
│   ├── fixtures/
│   └── outputs/           # 생성된 코드 저장소
├── lib/
│   ├── puppeteer-utils/   # Puppeteer 헬퍼 함수
│   ├── code-templates/    # 코드 템플릿
│   └── validators/        # 데이터 검증 로직
├── docs/
│   └── learning-guide/
└── examples/
    ├── basic-tests/
    ├── crawling-tests/
    ├── automation-tests/
    └── code-generation/
```

```shellscript
# 기존 의존성에 추가
npm install --save-dev puppeteer jest-puppeteer
npm install --save-dev @types/puppeteer
npm install --save-dev cheerio # HTML 파싱
npm install --save-dev fs-extra # 파일 시스템 유틸리티
npm install --save-dev handlebars # 템플릿 엔진
npm install --save-dev yaml # 설정 파일 파싱
```

```typescript
// lib/puppeteer-utils/browser-manager.ts
import puppeteer, { Browser, Page } from 'puppeteer';

export class BrowserManager {
  private browser: Browser | null = null;

  async launch(options: puppeteer.LaunchOptions = {}) {
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...options
    });
    return this.browser;
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not launched');
    }
    const page = await this.browser.newPage();
    
    // 기본 설정
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    return page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// lib/puppeteer-utils/crawler-utils.ts
import { Page } from 'puppeteer';

export class CrawlerUtils {
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.warn(`Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  static async extractText(page: Page, selector: string): Promise<string> {
    const element = await page.$(selector);
    if (!element) return '';
    
    const text = await page.evaluate(el => el.textContent?.trim() || '', element);
    return text;
  }

  static async extractMultipleTexts(page: Page, selector: string): Promise<string[]> {
    return await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return Array.from(elements).map(el => el.textContent?.trim() || '');
    }, selector);
  }

  static async clickAndWait(page: Page, selector: string, waitFor?: string) {
    await page.click(selector);
    if (waitFor) {
      await page.waitForSelector(waitFor);
    }
  }

  static async scrollToBottom(page: Page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
  }
}
```

```typescript
// e2e/scenarios/crawling/ecommerce-crawler.test.ts
import { BrowserManager } from '../../../lib/puppeteer-utils/browser-manager';
import { CrawlerUtils } from '../../../lib/puppeteer-utils/crawler-utils';
import { EcommerceCrawler } from '../../../src/crawlers/ecommerce-crawler';

describe('E-commerce Crawling Scenarios', () => {
  let browserManager: BrowserManager;
  let page: any;

  beforeAll(async () => {
    browserManager = new BrowserManager();
    await browserManager.launch();
  });

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browserManager.close();
  });

  describe('Product Information Crawling', () => {
    it('should extract product details from Amazon', async () => {
      const crawler = new EcommerceCrawler();
      
      // Amazon 상품 페이지로 이동
      await page.goto('https://www.amazon.com/dp/B08N5WRWNW');
      
      // 상품 정보 추출
      const productData = await crawler.extractProductInfo(page);
      
      // 검증
      expect(productData.title).toBeTruthy();
      expect(productData.price).toBeTruthy();
      expect(productData.rating).toBeGreaterThan(0);
      expect(productData.reviewCount).toBeGreaterThan(0);
      
      // 스크린샷 저장
      await page.screenshot({ 
        path: 'e2e/outputs/amazon-product.png',
        fullPage: true 
      });
    });

    it('should handle pagination and extract multiple products', async () => {
      const crawler = new EcommerceCrawler();
      
      await page.goto('https://www.amazon.com/s?k=laptop');
      
      const products = await crawler.extractProductList(page, 3); // 3페이지까지
      
      expect(products).toHaveLength(expect.any(Number));
      expect(products[0]).toHaveProperty('title');
      expect(products[0]).toHaveProperty('price');
    });
  });

  describe('Price Monitoring', () => {
    it('should track price changes over time', async () => {
      const crawler = new EcommerceCrawler();
      
      await page.goto('https://www.amazon.com/dp/B08N5WRWNW');
      
      const initialPrice = await crawler.extractPrice(page);
      
      // 가격 변동 모니터링 (실제로는 시간 간격을 두고 실행)
      expect(initialPrice).toBeGreaterThan(0);
      
      // 가격 히스토리 저장
      const priceHistory = await crawler.getPriceHistory('B08N5WRWNW');
      expect(priceHistory).toBeInstanceOf(Array);
    });
  });
});
```

```typescript
// src/crawlers/ecommerce-crawler.ts
import { Page } from 'puppeteer';
import { CrawlerUtils } from '../../lib/puppeteer-utils/crawler-utils';

export interface ProductInfo {
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: string;
  imageUrl: string;
}

export class EcommerceCrawler {
  async extractProductInfo(page: Page): Promise<ProductInfo> {
    // 제목 추출
    const title = await CrawlerUtils.extractText(page, '#productTitle');
    
    // 가격 추출
    const priceText = await CrawlerUtils.extractText(page, '.a-price-whole');
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // 평점 추출
    const ratingText = await CrawlerUtils.extractText(page, '.a-icon-alt');
    const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || '0');
    
    // 리뷰 수 추출
    const reviewText = await CrawlerUtils.extractText(page, '#acrCustomerReviewText');
    const reviewCount = parseInt(reviewText.match(/(\d+)/)?.[1] || '0');
    
    // 이미지 URL 추출
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('#landingImage') as HTMLImageElement;
      return img?.src || '';
    });

    return {
      title,
      price,
      rating,
      reviewCount,
      availability: await CrawlerUtils.extractText(page, '#availability'),
      imageUrl
    };
  }

  async extractProductList(page: Page, maxPages: number = 1): Promise<ProductInfo[]> {
    const products: ProductInfo[] = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      if (pageNum > 1) {
        await page.goto(`${page.url()}?page=${pageNum}`);
      }
      
      const productElements = await page.$$('[data-component-type="s-search-result"]');
      
      for (const element of productElements) {
        const productInfo = await this.extractProductFromElement(element);
        if (productInfo.title) {
          products.push(productInfo);
        }
      }
    }
    
    return products;
  }

  private async extractProductFromElement(element: any): Promise<ProductInfo> {
    return await element.evaluate((el: Element) => {
      const titleEl = el.querySelector('h2 a span');
      const priceEl = el.querySelector('.a-price-whole');
      const ratingEl = el.querySelector('.a-icon-alt');
      const reviewEl = el.querySelector('.a-size-base');
      const imgEl = el.querySelector('img');
      
      return {
        title: titleEl?.textContent?.trim() || '',
        price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '') || '0'),
        rating: parseFloat(ratingEl?.textContent?.match(/(\d+\.?\d*)/)?.[1] || '0'),
        reviewCount: parseInt(reviewEl?.textContent?.match(/(\d+)/)?.[1] || '0'),
        availability: 'In Stock',
        imageUrl: (imgEl as HTMLImageElement)?.src || ''
      };
    });
  }

  async extractPrice(page: Page): Promise<number> {
    const priceText = await CrawlerUtils.extractText(page, '.a-price-whole');
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  async getPriceHistory(productId: string): Promise<Array<{date: string, price: number}>> {
    // 실제 구현에서는 데이터베이스에서 가격 히스토리를 조회
    return [];
  }
}
```

```typescript
// src/generators/code-generator.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import Handlebars from 'handlebars';

export interface CodeTemplate {
  name: string;
  template: string;
  outputPath: string;
  data: any;
}

export class CodeGenerator {
  private templatesDir = path.join(__dirname, '../../lib/code-templates');

  async generateCode(template: CodeTemplate): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${template.template}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    const compiledTemplate = Handlebars.compile(templateContent);
    const generatedCode = compiledTemplate(template.data);
    
    // 출력 디렉토리 생성
    await fs.ensureDir(path.dirname(template.outputPath));
    
    // 코드 파일 생성
    await fs.writeFile(template.outputPath, generatedCode);
    
    return generatedCode;
  }

  async generateFromCrawlingResults(crawlingData: any): Promise<void> {
    // 크롤링 결과를 기반으로 다양한 코드 생성
    const templates: CodeTemplate[] = [
      {
        name: 'Product API',
        template: 'product-api',
        outputPath: 'e2e/outputs/generated/product-api.ts',
        data: { products: crawlingData.products }
      },
      {
        name: 'Database Schema',
        template: 'database-schema',
        outputPath: 'e2e/outputs/generated/schema.sql',
        data: { products: crawlingData.products }
      },
      {
        name: 'React Component',
        template: 'product-list-component',
        outputPath: 'e2e/outputs/generated/ProductList.tsx',
        data: { products: crawlingData.products }
      }
    ];

    for (const template of templates) {
      await this.generateCode(template);
    }
  }
}
```

```handlebars
{{!-- lib/code-templates/product-api.hbs --}}
import { ProductInfo } from '../types/product';

export class ProductAPI {
  private products: ProductInfo[] = [
    {{#each products}}
    {
      id: '{{id}}',
      title: '{{title}}',
      price: {{price}},
      rating: {{rating}},
      reviewCount: {{reviewCount}},
      availability: '{{availability}}',
      imageUrl: '{{imageUrl}}'
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ];

  async getAllProducts(): Promise<ProductInfo[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<ProductInfo | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async searchProducts(query: string): Promise<ProductInfo[]> {
    return this.products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}
```

```typescript
// e2e/scenarios/automation/full-crawling-workflow.test.ts
import { BrowserManager } from '../../../lib/puppeteer-utils/browser-manager';
import { EcommerceCrawler } from '../../../src/crawlers/ecommerce-crawler';
import { CodeGenerator } from '../../../src/generators/code-generator';
import { DataValidator } from '../../../lib/validators/data-validator';

describe('Full Crawling and Code Generation Workflow', () => {
  let browserManager: BrowserManager;
  let page: any;
  let crawler: EcommerceCrawler;
  let codeGenerator: CodeGenerator;
  let validator: DataValidator;

  beforeAll(async () => {
    browserManager = new BrowserManager();
    await browserManager.launch();
    
    crawler = new EcommerceCrawler();
    codeGenerator = new CodeGenerator();
    validator = new DataValidator();
  });

  beforeEach(async () => {
    page = await browserManager.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browserManager.close();
  });

  it('should complete full workflow: crawl → validate → generate code', async () => {
    // 1단계: 크롤링 실행
    await page.goto('https://www.amazon.com/s?k=laptop');
    
    const products = await crawler.extractProductList(page, 2);
    
    // 2단계: 데이터 검증
    const validationResult = await validator.validateProducts(products);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.validProducts.length).toBeGreaterThan(0);
    
    // 3단계: 코드 생성
    const generatedFiles = await codeGenerator.generateFromCrawlingResults({
      products: validationResult.validProducts
    });
    
    // 4단계: 생성된 코드 검증
    const generatedCode = await fs.readFile(
      'e2e/outputs/generated/product-api.ts', 
      'utf-8'
    );
    
    expect(generatedCode).toContain('class ProductAPI');
    expect(generatedCode).toContain('getAllProducts');
    
    // 5단계: 생성된 코드 테스트
    const testResult = await this.testGeneratedCode(generatedCode);
    expect(testResult.success).toBe(true);
  }, 30000); // 30초 타임아웃

  private async testGeneratedCode(code: string): Promise<{success: boolean}> {
    // 생성된 코드를 동적으로 테스트
    try {
      // 코드를 임시 파일로 저장하고 실행
      const tempFile = 'e2e/outputs/temp-test.ts';
      await fs.writeFile(tempFile, code);
      
      // TypeScript 컴파일 및 실행 테스트
      // 실제 구현에서는 ts-node를 사용하여 동적 실행
      
      return { success: true };
    } catch (error) {
      console.error('Generated code test failed:', error);
      return { success: false };
    }
  }
});
```

```typescript
// lib/validators/data-validator.ts
import { ProductInfo } from '../../src/crawlers/ecommerce-crawler';

export interface ValidationResult {
  isValid: boolean;
  validProducts: ProductInfo[];
  errors: string[];
}

export class DataValidator {
  validateProducts(products: ProductInfo[]): ValidationResult {
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
      errors.push('Title is too short');
    }

    if (product.price <= 0) {
      errors.push('Invalid price');
    }

    if (product.rating < 0 || product.rating > 5) {
      errors.push('Invalid rating');
    }

    if (product.reviewCount < 0) {
      errors.push('Invalid review count');
    }

    return errors;
  }
}
```

```yaml
# .github/workflows/crawling-tests.yml
name: Crawling Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  crawling-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm test
    
    - name: Run crawling tests
      run: npm run test:e2e
    
    - name: Generate code from crawling results
      run: npm run generate:code
    
    - name: Upload generated code
      uses: actions/upload-artifact@v2
      with:
        name: generated-code
        path: e2e/outputs/generated/
```

