module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/setup-tests.ts'
  ],
  
  // Module name mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@ai/(.*)$': '<rootDir>/ai/$1',
    '^@e2e/(.*)$': '<rootDir>/e2e/$1'
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/ai/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/examples/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'ai/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!e2e/outputs/**'
  ],
  
  // Coverage settings
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Test timeout (30 seconds for E2E tests)
  testTimeout: 30000,
  
  // Transform settings
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  
  // File extensions to consider
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/e2e/outputs/generated/'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Global setup/teardown for Puppeteer tests
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // Test environments for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/lib/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/examples/basic-tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
      ],
      testEnvironment: 'node'
    },
    {
      displayName: 'integration',
      testMatch: [
        '<rootDir>/ai/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/examples/crawling-tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
      ],
      testEnvironment: 'node',
      testTimeout: 45000
    },
    {
      displayName: 'e2e',
      testMatch: [
        '<rootDir>/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/examples/automation-tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
      ],
      testEnvironment: 'node',
      testTimeout: 60000
    }
  ],
  
  // Reporters for different output formats
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'jest-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'CrawlCat Jest Test Report',
        logoImgPath: undefined,
        includeFailureMsg: true,
        includeSuiteFailure: true
      }
    ]
  ],
  
  // Watch mode settings
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/e2e/outputs/'
  ],
  
  // Snapshot settings
  snapshotSerializers: [],
  
  // Custom test sequencer for E2E tests
  testSequencer: '<rootDir>/jest.test-sequencer.js'
};