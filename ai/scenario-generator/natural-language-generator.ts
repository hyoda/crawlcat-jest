import * as fs from 'fs-extra';
import * as path from 'path';

export interface ScenarioRequirements {
  description: string;
  domain: 'e-commerce' | 'news' | 'social-media' | 'general';
  complexity: 'basic' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
  expectedActions: string[];
  expectedResults: string[];
}

export interface GeneratedScenario {
  id: string;
  title: string;
  description: string;
  domain: string;
  complexity: string;
  steps: ScenarioStep[];
  assertions: ScenarioAssertion[];
  metadata: {
    createdAt: string;
    language: string;
    estimatedDuration: number;
  };
}

export interface ScenarioStep {
  id: string;
  action: string;
  target: string;
  parameters: Record<string, any>;
  description: string;
  waitConditions?: string[];
}

export interface ScenarioAssertion {
  id: string;
  type: 'element-exists' | 'text-contains' | 'url-contains' | 'count-equals' | 'custom';
  target: string;
  expected: any;
  description: string;
}

export class NaturalLanguageScenarioGenerator {
  private promptTemplates: Map<string, string> = new Map();
  private domainKeywords: Map<string, string[]> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeDomainKeywords();
  }

  private initializeTemplates(): void {
    // Korean templates
    this.promptTemplates.set('ko-basic', `
다음 자연어 설명을 Jest + Puppeteer 테스트 시나리오로 변환해주세요:

설명: {{description}}
도메인: {{domain}}
복잡도: {{complexity}}

결과는 다음 구조로 제공해주세요:
1. 테스트 제목
2. 상세 설명
3. 단계별 액션 (최대 {{maxSteps}}개)
4. 검증 포인트
5. 예상 소요 시간

테스트 시나리오는 실제 웹사이트에서 실행 가능해야 하며, 명확한 셀렉터와 기대값을 포함해야 합니다.
    `);

    this.promptTemplates.set('ko-advanced', `
다음 복합적인 요구사항을 종합적인 E2E 테스트 시나리오로 설계해주세요:

요구사항: {{description}}
대상 도메인: {{domain}}
복잡도: {{complexity}}
추가 조건: {{additionalRequirements}}

고려사항:
- 에러 처리 및 예외 상황
- 성능 최적화 (대기 시간, 타임아웃)
- 데이터 검증 로직
- 스크린샷 캡처 시점
- 병렬 처리 가능성

결과물:
1. 시나리오 개요
2. 전제 조건 및 설정
3. 메인 플로우 (단계별 상세 액션)
4. 예외 처리 플로우
5. 검증 및 단언문
6. 클린업 작업
    `);
  }

  private initializeDomainKeywords(): void {
    this.domainKeywords.set('e-commerce', [
      '상품', '제품', '가격', '장바구니', '결제', '주문', '배송', '리뷰', '평점',
      '카테고리', '검색', '필터', '정렬', '재고', '할인', '쿠폰', '브랜드'
    ]);

    this.domainKeywords.set('news', [
      '기사', '뉴스', '제목', '내용', '카테고리', '날짜', '작성자', '댓글',
      '공유', '좋아요', '조회수', '태그', '관련기사', '추천'
    ]);

    this.domainKeywords.set('social-media', [
      '포스트', '게시물', '댓글', '좋아요', '팔로우', '친구', '프로필',
      '타임라인', '알림', '메시지', '그룹', '이벤트', '사진', '동영상'
    ]);
  }

  async generateScenario(requirements: ScenarioRequirements): Promise<GeneratedScenario> {
    console.log('🤖 Generating scenario from natural language...');
    
    // Parse natural language description
    const parsedRequirements = this.parseNaturalLanguage(requirements);
    
    // Generate scenario structure
    const scenario = this.createScenarioStructure(parsedRequirements);
    
    // Generate steps and assertions
    scenario.steps = this.generateSteps(parsedRequirements);
    scenario.assertions = this.generateAssertions(parsedRequirements);
    
    // Save scenario to file
    await this.saveScenario(scenario);
    
    console.log(`✅ Generated scenario: ${scenario.title}`);
    return scenario;
  }

  private parseNaturalLanguage(requirements: ScenarioRequirements): any {
    const { description, domain, complexity, language } = requirements;
    
    // Extract key information from natural language
    const keywords = this.domainKeywords.get(domain) || [];
    const foundKeywords = keywords.filter(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    );

    // Identify action verbs
    const actionVerbs = this.extractActionVerbs(description, language);
    
    // Identify target elements
    const targetElements = this.extractTargetElements(description, domain);
    
    // Determine test complexity
    const estimatedSteps = this.estimateSteps(description, complexity);

    return {
      originalDescription: description,
      domain,
      complexity,
      language,
      foundKeywords,
      actionVerbs,
      targetElements,
      estimatedSteps,
      estimatedDuration: estimatedSteps * 5 // 5 seconds per step
    };
  }

  private extractActionVerbs(description: string, language: string): string[] {
    const koreanVerbs = [
      '클릭', '입력', '검색', '선택', '확인', '이동', '스크롤', '대기',
      '로그인', '로그아웃', '추가', '삭제', '수정', '저장', '취소'
    ];
    const englishVerbs = [
      'click', 'type', 'search', 'select', 'verify', 'navigate', 'scroll', 'wait',
      'login', 'logout', 'add', 'delete', 'edit', 'save', 'cancel'
    ];

    const verbs = language === 'ko' ? koreanVerbs : englishVerbs;
    return verbs.filter(verb => description.toLowerCase().includes(verb.toLowerCase()));
  }

  private extractTargetElements(description: string, domain: string): string[] {
    const commonElements = {
      'e-commerce': ['button', 'input', 'select', '.product', '.price', '.cart', '.checkout'],
      'news': ['article', '.headline', '.content', '.comment', '.category'],
      'social-media': ['.post', '.comment', '.like-button', '.profile', '.timeline'],
      'general': ['button', 'input', 'form', 'link', 'div', 'span']
    };

    return commonElements[domain as keyof typeof commonElements] || commonElements.general;
  }

  private estimateSteps(description: string, complexity: string): number {
    const baseSteps = {
      'basic': 3,
      'intermediate': 7,
      'advanced': 12
    };

    const actionCount = (description.match(/클릭|입력|검색|선택|확인/g) || []).length;
    return Math.max(baseSteps[complexity as keyof typeof baseSteps], actionCount * 2);
  }

  private createScenarioStructure(parsedRequirements: any): GeneratedScenario {
    const id = `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      title: this.generateTitle(parsedRequirements),
      description: parsedRequirements.originalDescription,
      domain: parsedRequirements.domain,
      complexity: parsedRequirements.complexity,
      steps: [],
      assertions: [],
      metadata: {
        createdAt: new Date().toISOString(),
        language: parsedRequirements.language,
        estimatedDuration: parsedRequirements.estimatedDuration
      }
    };
  }

  private generateTitle(parsedRequirements: any): string {
    const { domain, actionVerbs, foundKeywords } = parsedRequirements;
    
    if (parsedRequirements.language === 'ko') {
      const mainAction = actionVerbs[0] || '테스트';
      const mainKeyword = foundKeywords[0] || domain;
      return `${mainKeyword} ${mainAction} 시나리오`;
    } else {
      const mainAction = actionVerbs[0] || 'test';
      const mainKeyword = foundKeywords[0] || domain;
      return `${mainKeyword} ${mainAction} scenario`;
    }
  }

  private generateSteps(parsedRequirements: any): ScenarioStep[] {
    const steps: ScenarioStep[] = [];
    const { actionVerbs, targetElements, estimatedSteps } = parsedRequirements;

    // Generate navigation step
    steps.push({
      id: 'step_1',
      action: 'navigate',
      target: this.getDefaultUrl(parsedRequirements.domain),
      parameters: { waitUntil: 'networkidle2' },
      description: '페이지로 이동',
      waitConditions: ['body']
    });

    // Generate action steps based on parsed requirements
    for (let i = 1; i < estimatedSteps - 1; i++) {
      const actionIndex = i % actionVerbs.length;
      const targetIndex = i % targetElements.length;
      
      steps.push({
        id: `step_${i + 1}`,
        action: actionVerbs[actionIndex] || 'click',
        target: targetElements[targetIndex] || 'button',
        parameters: { timeout: 5000 },
        description: `${actionVerbs[actionIndex] || '클릭'} 액션 수행`,
        waitConditions: []
      });
    }

    // Generate verification step
    steps.push({
      id: `step_${estimatedSteps}`,
      action: 'verify',
      target: 'result',
      parameters: {},
      description: '결과 검증',
      waitConditions: []
    });

    return steps;
  }

  private generateAssertions(parsedRequirements: any): ScenarioAssertion[] {
    const assertions: ScenarioAssertion[] = [];
    const { domain } = parsedRequirements;
    // const foundKeywords = parsedRequirements.foundKeywords; // Reserved for future use

    // Generate basic assertions
    assertions.push({
      id: 'assert_1',
      type: 'element-exists',
      target: 'body',
      expected: true,
      description: '페이지가 로드되었는지 확인'
    });

    // Generate domain-specific assertions
    if (domain === 'e-commerce') {
      assertions.push({
        id: 'assert_2',
        type: 'element-exists',
        target: '.product, .item, [data-testid="product"]',
        expected: true,
        description: '상품이 표시되는지 확인'
      });
    }

    return assertions;
  }

  private getDefaultUrl(domain: string): string {
    const urls = {
      'e-commerce': 'https://example-shop.com',
      'news': 'https://example-news.com',
      'social-media': 'https://example-social.com',
      'general': 'https://example.com'
    };

    return urls[domain as keyof typeof urls] || urls.general;
  }

  private async saveScenario(scenario: GeneratedScenario): Promise<void> {
    const scenarioDir = path.join(process.cwd(), 'e2e', 'scenarios', 'ai-generated');
    await fs.ensureDir(scenarioDir);
    
    const filePath = path.join(scenarioDir, `${scenario.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(scenario, null, 2));
    
    console.log(`💾 Scenario saved to: ${filePath}`);
  }

  async loadScenario(scenarioId: string): Promise<GeneratedScenario | null> {
    try {
      const filePath = path.join(process.cwd(), 'e2e', 'scenarios', 'ai-generated', `${scenarioId}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to load scenario ${scenarioId}:`, error);
      return null;
    }
  }

  async listScenarios(): Promise<GeneratedScenario[]> {
    try {
      const scenarioDir = path.join(process.cwd(), 'e2e', 'scenarios', 'ai-generated');
      const files = await fs.readdir(scenarioDir);
      const scenarios: GeneratedScenario[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const scenarioId = file.replace('.json', '');
          const scenario = await this.loadScenario(scenarioId);
          if (scenario) {
            scenarios.push(scenario);
          }
        }
      }

      return scenarios;
    } catch (error) {
      console.error('Failed to list scenarios:', error);
      return [];
    }
  }
}