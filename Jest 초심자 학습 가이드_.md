

# **효율적 테스팅의 기술: AI 협업을 통한 Jest 마스터 전략 가이드**

---

### **Part I: 테스트 주도 학습의 새로운 패러다임**

#### **1.1. 서론: 왜 Jest이며, 왜 테스트인가?**

현대 소프트웨어 개발에서 견고한 테스팅 문화는 선택이 아닌 필수입니다. 테스트는 단순히 버그를 찾는 행위를 넘어, 코드의 안정성을 보장하고, 사용자 경험을 향상시키며, 장기적인 유지보수성을 높이는 핵심적인 가치 창출 활동입니다.1 잘 작성된 테스트 코드는 그 자체로 살아있는 문서가 되어, 코드의 의도를 명확히 전달하고 자신감 있는 배포를 가능하게 합니다.

수많은 자바스크립트 테스트 프레임워크 중에서 Jest는 "단순함에 초점을 맞춘 즐거운 자바스크립트 테스팅 프레임워크"라는 철학으로 독보적인 위치를 차지합니다.2 Jest의 가장 큰 장점은 '제로 설정(Zero-configuration)'입니다. 복잡한 설정 없이도 즉시 테스트를 시작할 수 있어 초보자가 겪는 초기 진입 장벽을 크게 낮춥니다.3 테스트는 일반적으로 기능의 가장 작은 단위(함수, 컴포넌트)를 검증하는 '유닛 테스트', 여러 단위가 함께 동작하는 방식을 검증하는 '통합 테스트', 그리고 전체 애플리케이션의 흐름을 사용자의 관점에서 검증하는 'E2E(End-to-End) 테스트'로 분류됩니다.1 Jest는 이 테스트 피라미드의 가장 근간이 되는 유닛 테스트와 통합 테스트를 작성하는 데 최적화된 강력한 도구입니다.

#### **1.2. AI 코드 조수: 메타 학습 전략**

이 가이드의 핵심은 AI를 단순한 코드 생성기가 아닌, 학습 과정을 가속하는 '소크라테스식 학습 파트너'로 활용하는 전략을 제안하는 데 있습니다. Jest의 API 자체는 복잡하지 않지만, 많은 개발자들이 처음 마주하는 진짜 장벽은 '테스터의 사고방식'을 습득하는 것입니다. 즉, 코드를 *작성하는 법*은 알지만, 그 코드의 동작을 *어떻게 검증할지*에 대한 개념적 모델을 구축하는 데 어려움을 겪습니다. AI는 이 간극을 메우는 탁월한 조력자가 될 수 있습니다.

AI 협업 학습 전략은 다음과 같은 활동을 포함합니다:

1. **개념 설명 요청**: "Jest의 mock 함수에 대해 5살 아이도 이해할 수 있도록 설명해 줘."와 같이 다양한 관점에서 개념 설명을 요구하여 이해를 심화시킵니다.  
2. **코드 생성 및 리팩토링**: 기본적인 테스트 코드 생성을 요청한 뒤, "이 테스트 코드의 문제점은 무엇이고, 어떻게 개선할 수 있을까?"라고 질문하며 코드 품질을 높입니다.  
3. **오류 기반 학습**: 발생하는 오류 메시지를 그대로 붙여넣고, "이 에러의 원인은 무엇이며, 해결 방법은 뭐야?"라고 질문하여 문제 해결 능력을 기릅니다.  
4. **비교 분석**: "toBe와 toEqual의 차이점은 무엇이고, 각각의 장단점과 사용 사례를 알려줘."와 같이 두 가지 접근법을 비교 분석하도록 요청하여 미묘한 차이를 명확히 이해합니다.

이러한 상호작용을 통해 개발자는 즉각적인 피드백을 받으며 '테스터의 사고방식'을 내재화하고, Jest의 기능을 더 깊고 빠르게 습득할 수 있습니다.

---

### **Part II: 기초 다지기: Jest와 AI의 첫 만남**

#### **2.1. 환경 준비**

Jest는 Node.js 런타임 환경에서 실행되므로, 시스템에 Node.js가 반드시 설치되어 있어야 합니다.5 안정적인 개발 환경을 위해 최신 LTS(Long-Term Support) 버전을 설치하는 것을 권장합니다.

#### **2.2. 설치 및 프로젝트 초기화**

프로젝트를 시작하려면 먼저 프로젝트 디렉터리를 생성하고 npm을 초기화합니다. 그 후, Jest를 개발 의존성(development dependency)으로 설치합니다. 개발 의존성은 애플리케이션의 실제 구동에는 필요 없지만 개발 과정에서는 필요한 패키지를 의미합니다.

프로젝트 루트에서 다음 명령어를 순서대로 실행합니다.

1. **프로젝트 초기화**: npm init \-y 명령어는 package.json 파일을 기본값으로 생성합니다.5  
2. **폴더 구조 생성**: 소스 코드를 담을 src 폴더와 테스트 코드를 담을 test 폴더를 생성하는 것이 일반적인 관례입니다.5  
3. **Jest 설치**: 선호하는 패키지 매니저를 사용하여 Jest를 설치합니다.  
   * npm: $ npm install \--save-dev jest 7  
   * Yarn: $ yarn add \--dev jest 8  
   * pnpm: $ pnpm add \--save-dev jest 9  
4. **테스트 스크립트 추가**: package.json 파일의 scripts 섹션에 테스트 실행 명령어를 추가합니다. 이 설정 덕분에 npm test라는 간단한 명령어로 Jest를 실행할 수 있습니다.7  
   JSON  
   {  
     "scripts": {  
       "test": "jest"  
     }  
   }

#### **2.3. 설정 파일 생성**

Jest는 대부분의 경우 설정 없이도 잘 동작하지만, 프로젝트가 복잡해지면 세부적인 설정이 필요합니다. jest \--init 명령어는 이 과정을 매우 간단하게 만들어 줍니다. 터미널에서 이 명령어를 실행하면, 몇 가지 질문을 통해 프로젝트에 맞는 jest.config.js 설정 파일을 자동으로 생성해 줍니다.11 이 파일은 Jest의 동작 방식을 제어하는 다양한 옵션들을 담고 있으며, 각 옵션에 대한 간략한 설명이 주석으로 포함되어 있어 초보자가 설정을 이해하는 데 큰 도움이 됩니다.

#### **2.4. 최신 자바스크립트와의 통합: Babel & TypeScript**

Jest는 기본적으로 최신 자바스크립트 문법(ES6+의 import/export 등)이나 TypeScript를 바로 해석하지 못합니다. 따라서 코드를 Jest가 이해할 수 있는 형태로 변환해주는 '트랜스파일러(transpiler)' 설정이 필요합니다.

* **Babel 사용하기**: Babel은 최신 자바스크립트 코드를 이전 버전의 자바스크립트 코드로 변환해주는 도구입니다. Jest와 Babel을 연동하려면 관련 패키지를 설치해야 합니다.8  
  Bash  
  $ npm install \--save-dev babel-jest @babel/core @babel/preset-env

  그리고 프로젝트 루트에 babel.config.js 파일을 생성하고 다음과 같이 설정합니다.  
  JavaScript  
  // babel.config.js  
  module.exports \= {  
    presets: \[\['@babel/preset-env', {targets: {node: 'current'}}\]\],  
  };

* **TypeScript 사용하기**: TypeScript 프로젝트에서 Jest를 사용하는 방법은 크게 두 가지입니다.  
  1. **Babel을 통한 변환**: 이미 Babel을 사용 중이라면 @babel/preset-typescript 프리셋을 추가하는 것이 가장 간단한 방법입니다.8  
  2. **ts-jest 사용**: ts-jest는 TypeScript를 Jest에서 사용하기 위한 전용 트랜스포머입니다. ts-jest를 설치하고 jest.config.js에서 transform 옵션을 설정해야 합니다.10

TypeScript를 사용할 때는 코드 에디터에서 자동 완성 및 타입 추론의 이점을 최대한 활용하기 위해 타입 정의 파일을 설치하는 것이 매우 중요합니다. @types/jest 또는 최신 프로젝트에서는 @jest/globals를 설치하면 됩니다.8한 가지 주의할 점은, 자바스크립트 생태계의 빠른 변화 속도 때문에 오래된 튜토리얼을 참고할 경우 문제가 발생할 수 있다는 것입니다. 예를 들어, 과거 Babel 6 시절에는 @babel/core 대신 babel-core라는 패키지를 사용했습니다.11 이런 오래된 정보를 따라가면 예기치 않은 설정 오류에 부딪힐 수 있습니다. 따라서 항상 최신 공식 문서를 참고하거나, AI에게 최신 설정 생성을 요청하는 것이 안전하고 효율적입니다.

#### **2.5. AI 기반 설정 자동화**

AI 코드 조수에게 구체적인 요구사항을 전달하여 복잡한 설정 과정을 자동화할 수 있습니다.

* **AI 프롬프트 예시**: "TypeScript와 Vite를 사용하는 새로운 React 프로젝트를 시작하려고 합니다. 저를 위해 완전한 jest.config.ts 파일을 생성해 주세요. 이 설정은 ts-jest를 사용하여 TypeScript를 변환하고, src/\* 형태의 절대 경로 임포트를 지원해야 합니다. 또한 @testing-library/react를 위한 jsdom 환경으로 설정하고, @testing-library/jest-dom을 임포트하기 위한 jest.setup.ts 파일도 함께 포함해 주세요."

---

### **Part III: 테스트의 구조: 'Hello, World\!'를 넘어서**

#### **3.1. 핵심 구조: describe, test, expect**

Jest 테스트 파일은 일반적으로 .test.js 또는 .spec.js라는 확장자를 가집니다.7 테스트 코드의 기본 구조는

describe, test(또는 it), 그리고 expect라는 세 가지 핵심 함수로 이루어집니다. 이 구조는 단순히 코드를 실행하는 것을 넘어, 코드의 '의도'와 '기대 결과'를 서술하는 이야기의 틀과 같습니다.

* describe('그룹 이름', () \=\> {... }): 연관된 테스트들을 하나의 논리적인 그룹으로 묶어주는 역할을 합니다. 예를 들어, 'Math Functions'라는 describe 블록 안에 덧셈, 뺄셈, 곱셈 테스트를 모아둘 수 있습니다.7  
* test('테스트 설명', () \=\> {... }) 또는 it('테스트 설명', () \=\> {... }): 개별 테스트 케이스 하나를 정의합니다. it은 test의 별칭(alias)으로, 기능적으로 동일합니다.7 테스트 설명은 "1과 2를 더하면 3이 되어야 한다"와 같이, 테스트가 무엇을 검증하는지를 자연어로 명확하게 서술해야 합니다.  
* expect(값): 단언(assertion)을 시작하는 함수입니다. expect에 검증하려는 값을 인자로 넣으면 '기대(expectation)' 객체가 반환되며, 이 객체에 '매처(matcher)' 함수를 연결하여 기대 결과를 명시합니다.16

잘 작성된 테스트 이름은 그 자체로 살아있는 문서의 역할을 합니다. 예를 들어, 'divisor가 0일 경우 에러를 던져야 한다'와 같은 테스트가 실패하면, 개발자는 테스트의 구현 코드를 보지 않고도 실패의 맥락을 즉시 파악할 수 있습니다.

#### **3.2. 첫 번째 단언: toBe**

초보자가 가장 먼저 접하게 될 매처는 toBe입니다. toBe는 두 값이 정확히 일치하는지 검증하며, 내부적으로는 Object.is를 사용하여 엄격한 동일성을 비교합니다. 이는 숫자, 문자열, 불리언과 같은 원시 타입(primitive types)의 값을 비교하는 데 이상적입니다.16

이제 Jest의 전통적인 첫 예제인 sum 함수를 테스트하는 전체 코드를 살펴보겠습니다.

JavaScript

// sum.js  
function sum(a, b) {  
  return a \+ b;  
}  
module.exports \= sum;

// sum.test.js  
const sum \= require('./sum');

describe('sum function', () \=\> {  
  test('adds 1 \+ 2 to equal 3', () \=\> {  
    expect(sum(1, 2)).toBe(3);  
  });  
});

#### **3.3. 테스트 실행**

package.json에 스크립트를 설정했다면, 터미널에서 npm test 또는 yarn test 명령어를 실행하여 테스트를 구동할 수 있습니다.7 Jest는 프로젝트 내의 모든 테스트 파일을 찾아 실행하고, 성공(PASS) 또는 실패(FAIL) 여부와 함께 결과를 깔끔하게 출력해 줍니다.

#### **3.4. AI를 활용한 테스트 리뷰**

첫 테스트를 작성했다면, AI에게 코드 리뷰를 요청하여 학습 효과를 극대화할 수 있습니다.

* **AI 프롬프트 예시**: "제가 작성한 sum 함수에 대한 첫 Jest 테스트 코드입니다: \[코드 붙여넣기\]. 이 코드를 리뷰해주세요. 잘 작성되었나요? 제가 고려하지 않은 엣지 케이스(예: 음수, 숫자가 아닌 값, 부동소수점)는 무엇이 있을까요? 이 엣지 케이스들을 포함하고, describe를 사용해 그룹화하도록 테스트를 리팩토링해주세요."

이러한 질문을 통해 '해피 패스(happy path)'뿐만 아니라 다양한 예외 상황을 고려하는 테스트 작성법을 자연스럽게 익힐 수 있습니다.

---

### **Part IV: 단언의 기술: 매처(Matcher) 마스터하기**

expect 함수와 함께 사용되는 매처는 테스트의 핵심적인 부분으로, 값이 기대하는 조건을 만족하는지 검증하는 역할을 합니다. Jest는 매우 풍부한 매처 API를 제공합니다.

#### **4.1. 황금 듀오: toBe vs. toEqual**

초보자들이 가장 흔하게 혼동하는 두 매처는 toBe와 toEqual입니다. 이 둘의 차이점을 명확히 이해하는 것이 중요합니다.

* **toBe**: 원시 타입(primitive)의 값을 비교하거나, 객체의 \*\*참조 동일성(referential identity)\*\*을 확인할 때 사용합니다. 즉, 두 변수가 메모리 상의 *정확히 같은 객체*를 가리키고 있는지 확인합니다.16  
* **toEqual**: 객체나 배열의 \*\*값 동등성(value equality)\*\*을 확인할 때 사용합니다. 객체의 모든 속성과 값을 재귀적으로 비교하여 내용이 같은지 확인합니다. 대부분의 경우 객체나 배열을 테스트할 때는 toEqual을 사용하게 됩니다.16

JavaScript

test('object assignment', () \=\> {  
  const data \= { one: 1 };  
  data\['two'\] \= 2;  
    
  // toEqual은 통과합니다. 객체의 내용이 같기 때문입니다.  
  expect(data).toEqual({ one: 1, two: 2 });  
    
  // toBe는 실패합니다. 두 객체는 내용은 같지만 서로 다른 인스턴스이기 때문입니다.  
  // expect(data).toBe({ one: 1, two: 2 });   
});

#### **4.2. 주요 매처 카테고리 둘러보기**

Jest 공식 문서 16를 기반으로 다양한 매처들을 살펴보겠습니다.

* **Truthiness (참/거짓 관련)**: undefined, null, false를 명확하게 구분해야 할 때 사용합니다.  
  * toBeNull(): 값이 null인지 확인합니다.  
  * toBeUndefined(): 값이 undefined인지 확인합니다.  
  * toBeDefined(): toBeUndefined의 반대, 즉 값이 정의되었는지 확인합니다.  
  * toBeTruthy(): if 문에서 true로 취급되는 값(예: true, 1, 'hello')인지 확인합니다.  
  * toBeFalsy(): if 문에서 false로 취급되는 값(예: false, 0, '', null, undefined)인지 확인합니다.  
* **Numbers (숫자 관련)**: 숫자 값을 비교할 때 사용합니다.  
  * toBeGreaterThan(n): \> n  
  * toBeLessThan(n): \< n  
  * toBeGreaterThanOrEqual(n): \>= n  
  * toBeLessThanOrEqual(n): \<= n  
  * toBeCloseTo(n): 부동소수점 계산 시 발생하는 미세한 반올림 오차를 무시하고 근사치를 비교할 때 사용합니다.16  
* **Strings (문자열 관련)**:  
  * toMatch(/regexp/): 문자열이 정규 표현식과 일치하는지 확인합니다.16  
* **Arrays and Iterables (배열 및 순회 가능한 객체 관련)**:  
  * toContain(item): 배열이나 이터러블(Set 등)이 특정 아이템을 포함하고 있는지 확인합니다.16  
* **Exceptions (예외 관련)**:  
  * toThrow(): 함수를 실행했을 때 에러가 발생하는지 확인합니다. 특정 에러 메시지나 에러 타입을 검증할 수도 있습니다.16

#### **4.3. .not의 힘**

모든 매처 앞에는 .not을 붙여 반대의 조건을 검증할 수 있습니다. 이는 테스트의 유연성을 크게 높여줍니다.16

expect(value).not.toBeNull(); // 값이 null이 아님을 확인

#### **4.4. AI 기반 매처 선택**

어떤 매처를 사용해야 할지 모를 때 AI는 훌륭한 가이드가 될 수 있습니다.

* **AI 프롬프트 예시**: "사용자 객체 배열을 반환하는 함수를 테스트하고 있습니다. 반환된 배열에 'test@example.com' 이메일을 가진 사용자가 포함되어 있는지 검증하는 Jest 테스트를 작성하고 싶습니다. 이럴 때 가장 관용적으로 사용되는 Jest 매처는 무엇이며, 예제 코드를 제공해 주세요." (AI는 아마도 toContainEqual이나 expect.arrayContaining과 같은 접근법을 제안할 것입니다.)

#### **매처 빠른 참조 가이드**

| 매처 | 사용 사례 | 예제 코드 | .not 예제 |
| :---- | :---- | :---- | :---- |
| toBe(value) | 원시 값의 정확한 일치 또는 객체의 참조 확인 | expect(2 \+ 2).toBe(4); | expect(1).not.toBe(2); |
| toEqual(value) | 객체 또는 배열의 값이 재귀적으로 동일한지 확인 | expect({a: 1}).toEqual({a: 1}); | expect({a: 1}).not.toEqual({a: 2}); |
| toBeTruthy() | 값이 참(truthy)으로 평가되는지 확인 | expect('hello').toBeTruthy(); | expect(null).not.toBeTruthy(); |
| toBeFalsy() | 값이 거짓(falsy)으로 평가되는지 확인 | expect(0).toBeFalsy(); | expect(1).not.toBeFalsy(); |
| toContain(item) | 배열/이터러블이 특정 항목을 포함하는지 확인 | expect(\['a', 'b'\]).toContain('a'); | expect(\['a', 'b'\]).not.toContain('c'); |
| toMatch(regexp) | 문자열이 정규 표현식과 일치하는지 확인 | expect('Christoph').toMatch(/stop/); | expect('team').not.toMatch(/I/); |
| toThrow(error) | 함수 호출 시 예외가 발생하는지 확인 | expect(() \=\> fn()).toThrow('Error'); | expect(() \=\> safeFn()).not.toThrow(); |
| toBeCloseTo(num) | 부동소수점 숫자의 근사치 비교 | expect(0.1 \+ 0.2).toBeCloseTo(0.3); | expect(0.1 \+ 0.2).not.toBe(0.3); |

---

### **Part V: 테스트 생명주기 관리: 설정(Setup)과 해제(Teardown)**

테스트를 작성하다 보면, 각 테스트가 실행되기 전에 특정 상태를 설정하거나, 테스트가 끝난 후에 정리해야 하는 작업이 필요할 때가 많습니다. Jest는 이를 위해 beforeEach, afterEach, beforeAll, afterAll이라는 훅(hook) 함수를 제공합니다.

#### **5.1. 깨끗한 상태의 필요성: 반복적인 설정**

* **beforeEach**: 스코프 내의 **모든 테스트가 실행되기 직전**에 매번 실행됩니다.  
* **afterEach**: 스코프 내의 **모든 테스트가 실행된 직후**에 매번 실행됩니다.

이 훅들은 **테스트 독립성**이라는 핵심 원칙을 지키기 위해 사용됩니다.20 각 테스트는 이전 테스트가 남긴 상태에 영향을 받아서는 안 되며, 항상 깨끗하고 예측 가능한 환경에서 시작해야 합니다. 예를 들어, 데이터베이스를 사용하는 테스트라면

beforeEach에서 테스트용 데이터를 초기화하고, afterEach에서 해당 데이터를 삭제하여 다음 테스트에 영향을 주지 않도록 할 수 있습니다.22 이 원칙을 지키지 않으면 테스트가 실행 순서에 따라 성공하거나 실패하는 '변덕스러운 테스트(flaky tests)'가 발생할 수 있습니다.21

#### **5.2. 일회성 작업: beforeAll과 afterAll**

* **beforeAll**: 스코프 내의 **모든 테스트가 실행되기 전, 단 한 번**만 실행됩니다.  
* **afterAll**: 스코프 내의 **모든 테스트가 실행된 후, 단 한 번**만 실행됩니다.

이 훅들은 실행 비용이 비싼 일회성 작업을 처리하는 데 적합합니다. 예를 들어, 데이터베이스 연결을 수립하는 작업은 한 번만 수행하면 되므로 beforeAll에 배치하고, 모든 테스트가 끝난 후 연결을 종료하는 작업을 afterAll에 배치할 수 있습니다.20

beforeEach와 beforeAll의 선택은 **성능**과 **격리 수준** 사이의 근본적인 트레이드오프입니다. beforeAll은 설정 작업을 한 번만 수행하므로 더 빠릅니다. 하지만 테스트들이 beforeAll에서 생성된 공유 상태를 변경한다면 테스트 간의 격리가 깨질 수 있습니다. 반면, beforeEach는 매번 상태를 초기화하므로 완벽한 격리를 보장하지만 설정 작업이 무거울 경우 테스트 스위트 전체의 속도를 저하시킬 수 있습니다. 따라서, 가장 안전한 기본 선택은 beforeEach이며, beforeAll은 성능 개선이 꼭 필요하고 공유 상태가 변경되지 않는다는 확신이 있을 때 신중하게 사용해야 하는 최적화 기법으로 이해해야 합니다.

#### **5.3. describe를 이용한 훅 스코핑**

훅 함수들은 describe 블록을 통해 적용 범위를 제어할 수 있습니다. 파일의 최상위 레벨에 선언된 훅은 해당 파일의 모든 테스트에 적용됩니다. 반면, describe 블록 내부에 선언된 훅은 오직 그 블록 안에 있는 테스트들에만 적용됩니다.20 이를 통해 각 테스트 그룹에 맞는 세분화된 설정 및 해제 로직을 구성할 수 있습니다.

#### **5.4. 실행 순서 파헤치기**

Jest의 훅과 테스트 실행 순서는 처음에는 혼란스러울 수 있지만, 매우 중요합니다. Jest는 실제 테스트(test)를 실행하기 전에 파일 내의 모든 describe 블록을 먼저 평가합니다. 그 후 다음과 같은 순서로 실행됩니다.20

1. 바깥 스코프의 beforeAll  
2. 바깥 스코프의 beforeEach  
3. 바깥 스코프의 test  
4. 바깥 스코프의 afterEach  
5. 안쪽 스코프(describe 블록)의 beforeAll  
6. 바깥 스코프의 beforeEach  
7. 안쪽 스코프의 beforeEach  
8. 안쪽 스코프의 test  
9. 안쪽 스코프의 afterEach  
10. 바깥 스코프의 afterEach  
11. 안쪽 스코프의 afterAll  
12. 바깥 스코프의 afterAll

이 순서를 이해하면 복잡한 설정 로직에서 발생할 수 있는 흔한 논리적 오류를 예방할 수 있습니다.

#### **5.5. AI를 활용한 복잡한 설정 시나리오**

* **AI 프롬프트 예시**: "데이터베이스 연결과 로그인된 사용자가 필요한 통합 테스트를 작성하고 있습니다. DB 연결은 파일 내 모든 테스트에서 공유할 수 있지만, 각 테스트는 새롭고 고유한 사용자가 필요합니다. Jest의 beforeAll을 사용해 연결을 설정하고, beforeEach를 사용해 사용자를 생성하는 구조를 보여주세요. afterAll과 afterEach를 사용한 정리 로직도 포함해주세요."

---

### **Part VI: 비동기 정복하기**

자바스크립트에서 비동기 코드는 흔하며, 이를 테스트하는 것은 특별한 주의가 필요합니다.

#### **6.1. 오탐(False Positives)의 함정**

비동기 테스트에서 가장 치명적인 실수는 Jest가 비동기 작업이 끝나기를 기다리지 않고 테스트를 종료시켜 버리는 것입니다. 이 경우, 비동기 콜백 내의 expect 문이 실행되기도 전에 테스트가 '성공(PASS)'으로 처리되어, 실제로는 실패해야 할 테스트가 통과하는 '오탐'이 발생합니다.25

#### **6.2. Promise 기반 접근법**

이 문제를 해결하는 가장 기본적인 방법은 테스트 함수에서 Promise를 return하는 것입니다. Jest는 return된 Promise를 보고, 해당 Promise가 완료(resolve)되거나 거부(reject)될 때까지 기다려줍니다.25 여기서

return 키워드는 절대 생략해서는 안 됩니다.

JavaScript

test('the data is peanut butter', () \=\> {  
  // 반드시 return 키워드를 사용해야 합니다.  
  return fetchData().then(data \=\> {  
    expect(data).toBe('peanut butter');  
  });  
});

#### **6.3. async/await의 우아함**

async/await 문법을 사용하면 비동기 코드를 마치 동기 코드처럼 간결하고 읽기 쉽게 작성할 수 있습니다. 테스트 함수 앞에 async 키워드를 붙이고, Promise를 반환하는 함수 호출 앞에 await를 붙이면 됩니다. 이는 현재 가장 선호되는 현대적인 방식입니다.27

JavaScript

test('the data is peanut butter', async () \=\> {  
  const data \= await fetchData();  
  expect(data).toBe('peanut butter');  
});

#### **6.4. 문법 설탕: .resolves와 .rejects**

.resolves와 .rejects 매처는 await와 expect를 한 줄로 우아하게 결합하는 방법을 제공합니다.27

* await expect(promise).resolves.toBe(value); // Promise가 value로 resolve되는지 확인  
* await expect(promise).rejects.toThrow(error); // Promise가 error와 함께 reject되는지 확인

JavaScript

test('the data is peanut butter', async () \=\> {  
  await expect(fetchData()).resolves.toBe('peanut butter');  
});

test('the fetch fails with an error', async () \=\> {  
  await expect(fetchData()).rejects.toThrow('error');  
});

#### **6.5. 안전망: expect.assertions()**

Promise가 거부(reject)될 것을 기대하는 테스트를 작성할 때(예: catch 블록 또는 .rejects 사용), expect.assertions(N)를 사용하는 것이 매우 중요합니다. 이 구문은 테스트 내에서 expect 단언이 정확히 N번 호출될 것을 보장합니다.26 만약

expect.assertions(1)을 사용했는데, 예상과 달리 Promise가 거부되지 않고 성공적으로 완료되면 catch 블록이 실행되지 않아 expect문이 한 번도 호출되지 않습니다. 이때 Jest는 단언 횟수가 부족하다고 판단하여 테스트를 실패시킵니다. 이 안전망이 없다면, 예기치 않은 성공이 테스트 통과로 이어져 버그를 놓칠 수 있습니다.

JavaScript

test('the fetch fails with an error', async () \=\> {  
  expect.assertions(1); // 이 테스트에서는 expect가 반드시 1번 호출되어야 함을 명시  
  try {  
    await fetchData();  
  } catch (e) {  
    expect(e).toMatch('error');  
  }  
});

#### **6.6. AI를 활용한 비동기 테스트 생성**

* **AI 프롬프트 예시**: "비동기 함수 fetchUser(id)가 있습니다. 이 함수는 API에서 사용자 데이터를 가져오고, 사용자를 찾지 못하면 에러를 던집니다. async/await를 사용하여 이 함수에 대한 두 개의 Jest 테스트를 작성해주세요: 하나는 .resolves를 사용한 성공 케이스, 다른 하나는 .rejects를 사용한 실패 케이스입니다. 실패 테스트는 expect.assertions()를 사용하여 견고하게 만들어 주세요."

---

### **Part VII: 모킹(Mocking)의 힘: 코드 격리하기**

테스트의 핵심 원칙 중 하나는 테스트 대상을 외부 의존성으로부터 '격리'하는 것입니다. 예를 들어, 외부 API를 호출하거나 파일 시스템에 접근하는 코드를 테스트할 때, 실제 네트워크 요청이나 파일 I/O가 발생하면 테스트는 느려지고 불안정해집니다. '모킹'은 이러한 외부 의존성을 가짜(mock) 객체로 대체하여, 오직 테스트 대상 코드의 로직에만 집중할 수 있게 해주는 강력한 기술입니다.

#### **7.1. A. Mock 함수 (jest.fn)**

jest.fn()은 가장 기본적인 모킹 도구로, 실제 구현이 없는 '스파이(spy)' 함수를 생성합니다.29 이 스파이 함수는 자신에게 일어나는 모든 일을 기록합니다.

* **.mock 속성**: 모든 mock 함수는 .mock이라는 특별한 속성을 가집니다. 이 속성을 통해 함수가 몇 번 호출되었는지(mock.calls.length), 어떤 인자와 함께 호출되었는지(mock.calls), 어떤 값을 반환했는지(mock.results) 등의 정보를 확인할 수 있습니다.29  
* **동작 제어**: mockReturnValue(value)를 사용하면 mock 함수가 항상 특정 값을 반환하도록 설정할 수 있습니다. mockImplementation(fn)을 사용하면 mock 함수의 구현 자체를 다른 함수로 대체할 수도 있습니다.29

#### **7.2. B. 모듈 모킹 (jest.mock)**

jest.mock('모듈\_경로')를 호출하면, 해당 모듈의 모든 export가 자동으로 mock 함수로 대체됩니다. 이는 axios와 같은 외부 라이브러리나 직접 작성한 다른 모듈과의 의존성을 끊어내는 데 필수적입니다.28

예를 들어, axios.get을 사용하여 사용자 목록을 가져오는 함수를 테스트하는 경우, 다음과 같이 axios를 모킹할 수 있습니다.

JavaScript

// users.js  
import axios from 'axios';  
class Users {  
  static all() {  
    return axios.get('/users.json').then(resp \=\> resp.data);  
  }  
}  
export default Users;

// users.test.js  
import axios from 'axios';  
import Users from './users';

jest.mock('axios'); // axios 모듈 전체를 모킹합니다.

test('should fetch users', () \=\> {  
  const users \=;  
  const resp \= {data: users};  
    
  // axios.get이 호출되면 가짜 응답(resp)을 반환하도록 설정합니다.  
  axios.get.mockResolvedValue(resp);

  return Users.all().then(data \=\> expect(data).toEqual(users));  
});

또한 모듈의 특정 부분만 모킹하고 나머지는 실제 구현을 유지하는 '부분 모킹(partial mocking)'도 가능합니다.29

#### **7.3. C. 타이머 모킹**

setTimeout, setInterval과 같은 타이머 함수들은 실제 시간을 기다려야 하므로 테스트를 느리게 만듭니다. jest.useFakeTimers()를 호출하면 Jest가 이 타이머 함수들을 가짜 타이머로 대체합니다.31

가짜 타이머를 사용하면 jest.runAllTimers() (모든 대기 중인 타이머 즉시 실행)나 jest.advanceTimersByTime(ms) (시간을 지정한 ms 만큼 빠르게 감기) 같은 API를 통해 시간을 마음대로 조작할 수 있습니다. 이를 통해 시간 의존적인 코드를 빠르고 결정론적으로 테스트할 수 있습니다.31

#### **모킹 전략 결정 매트릭스**

초보자들은 jest.fn(), jest.spyOn(), jest.mock()의 차이점을 혼동하기 쉽습니다. 다음 표는 상황에 맞는 올바른 모킹 도구를 선택하는 데 도움이 될 것입니다.

| 도구 | 무엇을 모킹하는가? | 주요 사용 사례 | 언제 사용해야 하는가 (예시) |
| :---- | :---- | :---- | :---- |
| jest.fn() | 단일 함수 | 콜백 함수, 의존성 주입된 함수의 동작을 추적 | 함수의 인자로 전달된 콜백이 정확히 1번 호출되었는지 확인해야 할 때 |
| jest.spyOn(object, 'methodName') | 객체의 기존 메서드 | 기존 메서드의 구현은 유지하면서 호출 여부만 추적하거나, 일시적으로 다른 동작으로 대체 | console.log가 특정 메시지와 함께 호출되었는지 확인하고 싶지만, 실제 로그 출력은 막고 싶지 않을 때 |
| jest.mock('moduleName') | 모듈 전체 | 외부 라이브러리(axios, fs)나 다른 파일과의 의존성을 완전히 차단 | 실제 API 요청을 보내지 않고, axios.get이 특정 데이터를 반환하는 것처럼 꾸며야 할 때 |

#### **7.4. AI를 활용한 복잡한 모킹 시나리오**

* **AI 프롬프트 예시**: "제 React 컴포넌트는 useEffect를 사용하여 5초 후에 setTimeout을 호출해 메시지를 보여줍니다. 5초를 기다리지 않고 이 동작을 테스트하고 싶습니다. jest.useFakeTimers()와 jest.runAllTimers()를 사용하여 테스트에서 메시지가 즉시 나타나는지 확인하는 Jest 테스트를 작성해주세요."

---

### **Part VIII: 스냅샷 테스팅: UI 보안관**

#### **8.1. 스냅샷 테스팅이란?**

스냅샷 테스팅은 컴포넌트의 렌더링 결과(또는 직렬화 가능한 모든 값)를 사진 찍듯이 파일(.snap)로 저장해두는 기법입니다. 이후 테스트를 실행할 때마다 새로운 렌더링 결과를 이전에 저장된 스냅샷과 비교합니다.34 만약 두 결과가 일치하면 테스트는 통과하고, 일치하지 않으면 실패합니다. 이는 의도치 않은 UI 변경을 감지하는 데 매우 효과적인 방법입니다.

#### **8.2. 첫 번째 스냅샷 테스트**

React 컴포넌트의 스냅샷을 생성하기 위해 보통 react-test-renderer 라이브러리를 사용합니다. 이 라이브러리는 컴포넌트를 실제 DOM에 렌더링하지 않고, 순수한 자바스크립트 객체로 렌더링해줍니다.36 테스트 코드는

toMatchSnapshot() 매처를 사용합니다.

JavaScript

import renderer from 'react-test-renderer';  
import Link from '../Link';

it('renders correctly', () \=\> {  
  const tree \= renderer  
   .create(\<Link page\="http://www.facebook.com"\>Facebook\</Link\>)  
   .toJSON();  
  expect(tree).toMatchSnapshot();  
});

이 테스트를 처음 실행하면, Jest는 \_\_snapshots\_\_ 폴더 안에 Link.test.js.snap과 같은 스냅샷 파일을 자동으로 생성합니다.

#### **8.3. 스냅샷 업데이트**

컴포넌트의 변경이 의도적인 것이라면, 실패한 스냅샷 테스트는 당연한 결과입니다. 이때 개발자는 jest \-u (또는 \--updateSnapshot) 명령어를 실행하여 기존 스냅샷을 새로운 결과물로 갱신할 수 있습니다.36 Jest의 watch 모드(

\--watch)에서도 u 키를 눌러 대화형으로 스냅샷을 업데이트할 수 있습니다.34

#### **8.4. 동적 데이터 처리**

날짜, 시간, 랜덤 ID와 같이 실행할 때마다 값이 바뀌는 동적 데이터가 포함된 컴포넌트는 매번 스냅샷 테스트에 실패하게 됩니다. 이 문제를 해결하기 위해 Jest는 \*\*속성 매처(Property Matchers)\*\*를 제공합니다. expect.any(Date), expect.any(String), expect.objectContaining({...}) 등을 사용하여 스냅샷에서 동적인 부분의 구체적인 값이 아닌 타입이나 구조만 일치하는지 확인할 수 있습니다.18

#### **8.5. 모범 사례**

* **스냅샷을 코드로 취급하세요**: 스냅샷 파일(.snap)도 코드 변경 사항과 함께 커밋하고, 코드 리뷰 과정에서 함께 검토해야 합니다.35  
* **테스트는 결정적이어야 합니다**: 동일한 테스트를 여러 번 실행해도 항상 동일한 스냅샷이 생성되어야 합니다. Date.now()나 Math.random()과 같은 비결정적인 요소는 모킹하여 고정된 값을 반환하도록 만들어야 합니다.35  
* **설명적인 스냅샷 이름을 사용하세요**: 테스트 이름을 명확하게 작성하여 스냅샷의 내용이 무엇을 의미하는지 쉽게 파악할 수 있도록 해야 합니다.35

#### **8.6. AI를 활용한 스냅샷 Diff 분석**

* **AI 프롬프트 예시**: "제 Jest 스냅샷 테스트가 실패했습니다. 다음은 diff 출력 결과입니다: \[diff 결과 붙여넣기\]. 이 diff를 바탕으로 제 React 컴포넌트 출력의 어느 부분이 변경되었나요? 이것이 의도적인 스타일 변경으로 보이나요, 아니면 로직의 잠재적인 버그로 보이나요?"

---

### **Part IX: 실전 응용: 프레임워크 컴포넌트 테스트하기 (React 중심)**

#### **9.1. React 테스트 환경 설정**

현대의 React 테스트 환경은 React Testing Library(@testing-library/react)를 중심으로 구축됩니다. 이 라이브러리는 Create React App에 기본적으로 포함되어 있으며, 수동으로도 쉽게 설치할 수 있습니다.38 성공적인 테스트 환경을 위해서는 브라우저 환경을 시뮬레이션하는

jest-environment-jsdom과, toBeInTheDocument()와 같이 DOM에 특화된 유용한 커스텀 매처를 제공하는 @testing-library/jest-dom을 함께 설치하는 것이 표준입니다.13

#### **9.2. React Testing Library의 철학**

React Testing Library의 핵심 철학은 \*\*"구현 세부 사항이 아닌, 동작을 테스트하라"\*\*는 것입니다.4 테스트는 실제 사용자가 애플리케이션과 상호작용하는 방식과 유사해야 합니다. 이는 CSS 클래스 이름이나 컴포넌트의 내부 상태 값으로 엘리먼트를 찾는 대신, 화면에 표시되는 텍스트나 접근성 역할(role)을 기반으로 엘리먼트를 찾아야 함을 의미합니다.

#### **9.3. 핵심 테스트 패턴**

* **렌더링**: render 함수를 사용하여 테스트 환경에 컴포넌트를 렌더링합니다.38  
* **쿼리**: screen 객체와 getByText, getByRole, queryByText 같은 쿼리 함수를 사용하여 DOM에서 엘리먼트를 찾습니다.38  
* **이벤트**: fireEvent나 더 발전된 @testing-library/user-event를 사용하여 클릭, 입력 등 사용자의 행동을 시뮬레이션합니다.38

#### **9.4. 실용 예제: 카운터 컴포넌트 테스트하기**

다음은 Counter 컴포넌트와 그에 대한 테스트 코드의 완전한 예시입니다. 이 예제는 초기 렌더링 상태 확인, 버튼 클릭 후 텍스트 변화 단언, props 및 상태 변화 테스트를 모두 포함합니다.

JavaScript

// Counter.js  
import React, { useState } from 'react';

export default function Counter({ initialCount \= 0 }) {  
  const \[count, setCount\] \= useState(initialCount);  
  return (  
    \<div\>  
      \<p\>Count: {count}\</p\>  
      \<button onClick\={() \=\> setCount(count \+ 1)}\>Increment\</button\>  
    \</div\>  
  );  
}

// Counter.test.js  
import React from 'react';  
import { render, screen, fireEvent } from '@testing-library/react';  
import '@testing-library/jest-dom';  
import Counter from './Counter';

describe('Counter component', () \=\> {  
  test('renders with initial count of 0 by default', () \=\> {  
    render(\<Counter /\>);  
    expect(screen.getByText('Count: 0')).toBeInTheDocument();  
  });

  test('increments count when button is clicked', () \=\> {  
    render(\<Counter /\>);  
    const incrementButton \= screen.getByRole('button', { name: /increment/i });  
      
    fireEvent.click(incrementButton);  
      
    expect(screen.getByText('Count: 1')).toBeInTheDocument();  
  });  
});

#### **9.5. AI를 활용한 컴포넌트 테스트 생성**

* **AI 프롬프트 예시**: "제 React LoginForm 컴포넌트의 코드입니다: \[코드 붙여넣기\]. 이 컴포넌트는 이메일과 비밀번호 두 개의 입력 필드와 제출 버튼이 있습니다. 두 입력 필드가 모두 채워지기 전까지 제출 버튼은 비활성화되어야 합니다. React Testing Library와 user-event를 사용하여 이 컴포넌트에 대한 완전한 Jest 테스트 파일을 작성해주세요. 테스트는 초기 렌더링, 버튼의 비활성화 상태, 그리고 두 필드에 모두 타이핑한 후 버튼이 활성화되는 것을 검증해야 합니다."

---

### **Part X: 앞으로의 길: 숙련과 지속적인 학습**

#### **10.1. 성공 측정: 코드 커버리지**

\--coverage 플래그를 사용하여 테스트가 코드의 얼마나 많은 부분을 실행했는지를 나타내는 코드 커버리지 리포트를 생성할 수 있습니다.6 이 리포트는 Statement(구문), Branch(분기), Function(함수), Line(줄)의 커버리지 비율을 보여줍니다. 여기서 중요한 것은 100% 커버리지가 항상 목표는 아니라는 점입니다. 양보다 질이 중요하며, 비즈니스 로직의 핵심적인 부분을 의미 있게 테스트하는 것이 더 가치 있습니다.

#### **10.2. 강력한 도구, Jest CLI**

Jest CLI는 테스트 경험을 향상시키는 유용한 옵션들을 제공합니다. 파일 변경 시 자동으로 테스트를 재실행하는 \--watch, 특정 이름의 테스트만 실행하는 \-t, Jest를 전역으로 설치하여 사용하는 방법 등을 알아두면 생산성이 크게 향상됩니다.7

#### **10.3. 커뮤니티와 함께하기**

학습 과정에서 막히는 부분이 있다면 커뮤니티의 도움을 받는 것이 좋습니다. Jest 공식 문서, Reactiflux Discord의 \#testing 채널, Stack Overflow의 jestjs 태그, 그리고 Jest 공식 블로그와 트위터는 최신 정보를 얻고 질문에 대한 답을 찾을 수 있는 훌륭한 자원입니다.42

#### **10.4. 결론: 초심자에서 자신감 있는 테스터로**

이 가이드는 Jest의 기본 설정부터 시작하여 매처, 비동기 처리, 모킹, 그리고 React 컴포넌트 테스트에 이르기까지의 여정을 안내했습니다. 핵심은 테스트를 개발의 마지막 단계가 아닌, 개발 과정 전체에 통합된 필수적인 활동으로 받아들이는 것입니다. AI를 단순한 도구가 아닌 학습 파트너로 삼아 끊임없이 질문하고 피드백을 받으며 이 여정을 계속한다면, 누구나 코드에 대한 자신감을 가지고 더 나은 소프트웨어를 만드는 '자신감 있는 테스터'로 성장할 수 있을 것입니다.

#### **참고 자료**

1. React Testing: How to test React components? | BrowserStack, 7월 24, 2025에 액세스, [https://www.browserstack.com/guide/react-testing-tutorial](https://www.browserstack.com/guide/react-testing-tutorial)  
2. Jest \- Using Matchers | BrowserStack, 7월 24, 2025에 액세스, [https://www.browserstack.com/guide/jest-using-matchers](https://www.browserstack.com/guide/jest-using-matchers)  
3. \[테스트 코드 \- Jest\] Jest 설치 및 셋팅 \- 코드에 빠지다, 7월 24, 2025에 액세스, [https://codiving.kr/114](https://codiving.kr/114)  
4. Testing \- Vue.js, 7월 24, 2025에 액세스, [https://vuejs.org/guide/scaling-up/testing](https://vuejs.org/guide/scaling-up/testing)  
5. Jest Tutorial: Complete Guide to Jest Testing \- LambdaTest, 7월 24, 2025에 액세스, [https://www.lambdatest.com/jest](https://www.lambdatest.com/jest)  
6. Unit Testing of React Apps using JEST : Tutorial | BrowserStack, 7월 24, 2025에 액세스, [https://www.browserstack.com/guide/unit-testing-of-react-apps-using-jest](https://www.browserstack.com/guide/unit-testing-of-react-apps-using-jest)  
7. A Beginner's Guide to Testing with Jest | by UATeam \- Medium, 7월 24, 2025에 액세스, [https://medium.com/@aleksej.gudkov/a-beginners-guide-to-testing-with-jest-81d39ddb015e](https://medium.com/@aleksej.gudkov/a-beginners-guide-to-testing-with-jest-81d39ddb015e)  
8. Getting Started · Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)  
9. Getting Started · Jest \- Netlify, 7월 24, 2025에 액세스, [https://jest-archive-august-2023.netlify.app/docs/28.x/getting-started/](https://jest-archive-august-2023.netlify.app/docs/28.x/getting-started/)  
10. Getting Started · Jest, 7월 24, 2025에 액세스, [https://jest-bot.github.io/jest/docs/getting-started.html](https://jest-bot.github.io/jest/docs/getting-started.html)  
11. Getting Started \- Jest, 7월 24, 2025에 액세스, [https://archive.jestjs.io/docs/en/23.x/getting-started.html](https://archive.jestjs.io/docs/en/23.x/getting-started.html)  
12. \[JEST\] 시작하기 설치 및 설정, 7월 24, 2025에 액세스, [https://hokeydokey.tistory.com/133](https://hokeydokey.tistory.com/133)  
13. \[Next\] Jest 사용 환경 설정하기 \- J4J Storage \- 티스토리, 7월 24, 2025에 액세스, [https://jforj.tistory.com/386](https://jforj.tistory.com/386)  
14. \[Jest\] 01\. Jest 설정 \- \#깜깜한 방에서 코딩하기, 7월 24, 2025에 액세스, [https://darkroom.kr/109](https://darkroom.kr/109)  
15. Unit testing with Jest \- Vue.js Developers, 7월 24, 2025에 액세스, [https://vuejsdevelopers.com/lessons/unit-testing-with-jest/](https://vuejsdevelopers.com/lessons/unit-testing-with-jest/)  
16. Using Matchers · Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/using-matchers](https://jestjs.io/docs/using-matchers)  
17. Jest \- Using Matchers \- w3resource, 7월 24, 2025에 액세스, [https://www.w3resource.com/jest/using-matchers.php](https://www.w3resource.com/jest/using-matchers.php)  
18. Jest Matchers \- Jest Book, 7월 24, 2025에 액세스, [https://phalanxhead.dev/jest-book/jest/matchers.html](https://phalanxhead.dev/jest-book/jest/matchers.html)  
19. Expect \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/expect](https://jestjs.io/docs/expect)  
20. Setup and Teardown · Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/setup-teardown](https://jestjs.io/docs/setup-teardown)  
21. Setup and Teardown · Jest, 7월 24, 2025에 액세스, [https://archive.jestjs.io/docs/en/22.x/setup-teardown](https://archive.jestjs.io/docs/en/22.x/setup-teardown)  
22. Chapter 6 \- Before and After Code \- Test Automation University \- Applitools, 7월 24, 2025에 액세스, [https://testautomationu.applitools.com/jest-testing-tutorial/chapter6.html](https://testautomationu.applitools.com/jest-testing-tutorial/chapter6.html)  
23. What is the purpose of \`beforeEach\` global in Jest? \- Stack Overflow, 7월 24, 2025에 액세스, [https://stackoverflow.com/questions/57497799/what-is-the-purpose-of-beforeeach-global-in-jest](https://stackoverflow.com/questions/57497799/what-is-the-purpose-of-beforeeach-global-in-jest)  
24. Setup and Teardown | Jest Roblox \- GitHub Pages, 7월 24, 2025에 액세스, [https://roblox.github.io/jest-roblox-internal/setup-teardown](https://roblox.github.io/jest-roblox-internal/setup-teardown)  
25. How to Test Asynchronous Code with Jest \- Pluralsight, 7월 24, 2025에 액세스, [https://www.pluralsight.com/resources/blog/guides/test-asynchronous-code-jest](https://www.pluralsight.com/resources/blog/guides/test-asynchronous-code-jest)  
26. A quick trick for Jest asynchronous tests \- Ben Ilegbodu, 7월 24, 2025에 액세스, [https://www.benmvp.com/blog/quick-trick-jest-asynchronous-tests/](https://www.benmvp.com/blog/quick-trick-jest-asynchronous-tests/)  
27. Testing Asynchronous Code · Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/asynchronous](https://jestjs.io/docs/asynchronous)  
28. An Async Example \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/tutorial-async](https://jestjs.io/docs/tutorial-async)  
29. Mock Functions · Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/mock-functions](https://jestjs.io/docs/mock-functions)  
30. Part 9: Testing Asynchronous Code and Side Effects with Jest | by Entekume jeffrey, 7월 24, 2025에 액세스, [https://medium.com/@entekumejeffrey/part-9-testing-asynchronous-code-and-side-effects-with-jest-2238675bf8bf](https://medium.com/@entekumejeffrey/part-9-testing-asynchronous-code-and-side-effects-with-jest-2238675bf8bf)  
31. Timer Mocks \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/timer-mocks](https://jestjs.io/docs/timer-mocks)  
32. Timer Mocks · Jest, 7월 24, 2025에 액세스, [https://archive.jestjs.io/docs/en/23.x/timer-mocks](https://archive.jestjs.io/docs/en/23.x/timer-mocks)  
33. Using Timer Mocks in Jest \- w3resource, 7월 24, 2025에 액세스, [https://www.w3resource.com/jest/timer-mocks-in-jest.php](https://www.w3resource.com/jest/timer-mocks-in-jest.php)  
34. Snapshot Testing with Jest \- BrowserStack, 7월 24, 2025에 액세스, [https://www.browserstack.com/guide/snapshot-testing](https://www.browserstack.com/guide/snapshot-testing)  
35. Snapshot Testing \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/snapshot-testing](https://jestjs.io/docs/snapshot-testing)  
36. Snapshot Testing · Jest \- Robin Pokorny, 7월 24, 2025에 액세스, [https://robinpokorny.github.io/jest/docs/snapshot-testing.html](https://robinpokorny.github.io/jest/docs/snapshot-testing.html)  
37. How to write Snapshot Tests for React Components with Jest? \- BrowserStack, 7월 24, 2025에 액세스, [https://www.browserstack.com/guide/jest-snapshot-testing](https://www.browserstack.com/guide/jest-snapshot-testing)  
38. Testing React Apps \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/docs/tutorial-react](https://jestjs.io/docs/tutorial-react)  
39. React JS Jest: Beginner's Guide \- Daily.dev, 7월 24, 2025에 액세스, [https://daily.dev/blog/react-js-jest-beginners-guide](https://daily.dev/blog/react-js-jest-beginners-guide)  
40. How to Test React Components using Jest ? \- GeeksforGeeks, 7월 24, 2025에 액세스, [https://www.geeksforgeeks.org/reactjs/how-to-test-react-components-using-jest/](https://www.geeksforgeeks.org/reactjs/how-to-test-react-components-using-jest/)  
41. Testing React Components with Jest: A Simple Guide | by Pavan Kumar | Medium, 7월 24, 2025에 액세스, [https://pavankumar-89104.medium.com/testing-react-components-with-jest-a-simple-guide-9ad4598833d6](https://pavankumar-89104.medium.com/testing-react-components-with-jest-a-simple-guide-9ad4598833d6)  
42. Help \- Jest, 7월 24, 2025에 액세스, [https://jestjs.io/help](https://jestjs.io/help)  
43. Discuss Jest \- Tutorialspoint, 7월 24, 2025에 액세스, [https://www.tutorialspoint.com/jest/jest-dicussion.htm](https://www.tutorialspoint.com/jest/jest-dicussion.htm)