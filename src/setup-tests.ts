import '@testing-library/jest-dom';

// Increase timeout for E2E tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  // Uncomment to ignore specific console methods
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup global test environment
beforeAll(() => {
  // Global setup for all tests
});

afterAll(() => {
  // Global cleanup for all tests
});