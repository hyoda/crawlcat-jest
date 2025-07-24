/**
 * Basic Jest Test Example
 * 
 * This file demonstrates fundamental Jest testing concepts including:
 * - Test structure (describe, it/test)
 * - Matchers (toBe, toEqual, toThrow)
 * - Setup and teardown (beforeEach, afterEach)
 * - Async testing
 * - Mock functions
 */

// Simple calculator class for testing
class Calculator {
  private history: Array<{ operation: string; result: number }> = [];

  add(a: number, b: number): number {
    const result = a + b;
    this.history.push({ operation: `${a} + ${b}`, result });
    return result;
  }

  subtract(a: number, b: number): number {
    const result = a - b;
    this.history.push({ operation: `${a} - ${b}`, result });
    return result;
  }

  multiply(a: number, b: number): number {
    const result = a * b;
    this.history.push({ operation: `${a} * ${b}`, result });
    return result;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    const result = a / b;
    this.history.push({ operation: `${a} / ${b}`, result });
    return result;
  }

  async asyncAdd(a: number, b: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.add(a, b));
      }, 100);
    });
  }

  getHistory(): Array<{ operation: string; result: number }> {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

describe('Calculator', () => {
  let calculator: Calculator;

  // Setup: Create a new calculator instance before each test
  beforeEach(() => {
    calculator = new Calculator();
  });

  // Cleanup: Clear history after each test (optional in this case)
  afterEach(() => {
    calculator.clearHistory();
  });

  describe('Basic Operations', () => {
    test('should add two positive numbers correctly', () => {
      const result = calculator.add(2, 3);
      expect(result).toBe(5);
    });

    test('should add negative numbers correctly', () => {
      const result = calculator.add(-1, -2);
      expect(result).toBe(-3);
    });

    test('should handle adding zero', () => {
      expect(calculator.add(5, 0)).toBe(5);
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(0, 0)).toBe(0);
    });

    test('should subtract numbers correctly', () => {
      expect(calculator.subtract(10, 3)).toBe(7);
      expect(calculator.subtract(5, 10)).toBe(-5);
      expect(calculator.subtract(-5, -3)).toBe(-2);
    });

    test('should multiply numbers correctly', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
      expect(calculator.multiply(-2, 3)).toBe(-6);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    test('should divide numbers correctly', () => {
      expect(calculator.divide(10, 2)).toBe(5);
      expect(calculator.divide(7, 2)).toBe(3.5);
      expect(calculator.divide(-10, 2)).toBe(-5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero is not allowed');
      
      // More specific error testing
      expect(() => calculator.divide(5, 0)).toThrow(Error);
    });
    
    test('should throw error instance when dividing by zero', () => {
      // Testing with expect.assertions to ensure error is thrown
      expect.assertions(1);
      try {
        calculator.divide(1, 0);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('History Functionality', () => {
    test('should track operation history', () => {
      calculator.add(2, 3);
      calculator.multiply(4, 5);
      calculator.subtract(10, 3);

      const history = calculator.getHistory();
      
      expect(history).toHaveLength(3);
      expect(history[0]).toEqual({ operation: '2 + 3', result: 5 });
      expect(history[1]).toEqual({ operation: '4 * 5', result: 20 });
      expect(history[2]).toEqual({ operation: '10 - 3', result: 7 });
    });

    test('should clear history', () => {
      calculator.add(1, 2);
      calculator.multiply(3, 4);
      
      expect(calculator.getHistory()).toHaveLength(2);
      
      calculator.clearHistory();
      
      expect(calculator.getHistory()).toHaveLength(0);
      expect(calculator.getHistory()).toEqual([]);
    });

    test('should return a copy of history (not reference)', () => {
      calculator.add(1, 1);
      
      const history1 = calculator.getHistory();
      const history2 = calculator.getHistory();
      
      // Should not be the same reference
      expect(history1).not.toBe(history2);
      
      // But should have the same content
      expect(history1).toEqual(history2);
    });
  });

  describe('Async Operations', () => {
    test('should handle async addition with promises', async () => {
      const result = await calculator.asyncAdd(2, 3);
      expect(result).toBe(5);
    });

    test('should handle async addition with resolves matcher', async () => {
      await expect(calculator.asyncAdd(5, 7)).resolves.toBe(12);
    });

    test('should timeout properly for async operations', async () => {
      const startTime = Date.now();
      await calculator.asyncAdd(1, 1);
      const endTime = Date.now();
      
      // Should take at least 100ms due to setTimeout
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    }, 1000); // Set test timeout to 1 second
  });

  describe('Edge Cases and Data Types', () => {
    test('should handle floating point numbers', () => {
      expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
      expect(calculator.multiply(0.1, 3)).toBeCloseTo(0.3);
    });

    test('should handle large numbers', () => {
      const large1 = 999999999;
      const large2 = 888888888;
      
      expect(calculator.add(large1, large2)).toBe(1888888887);
    });

    test('should handle very small numbers', () => {
      const small1 = 0.000001;
      const small2 = 0.000002;
      
      expect(calculator.add(small1, small2)).toBeCloseTo(0.000003);
    });
  });
});

// Mock function examples
describe('Mock Functions', () => {
  test('should track function calls', () => {
    const mockFn = jest.fn();
    
    mockFn();
    mockFn('arg1', 'arg2');
    
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('should mock return values', () => {
    const mockCalculator = {
      add: jest.fn().mockReturnValue(10),
      multiply: jest.fn().mockImplementation((a, b) => a * b * 2)
    };

    expect(mockCalculator.add(1, 2)).toBe(10);
    expect(mockCalculator.multiply(3, 4)).toBe(24);
    
    expect(mockCalculator.add).toHaveBeenCalledWith(1, 2);
    expect(mockCalculator.multiply).toHaveBeenCalledWith(3, 4);
  });

  test('should mock async functions', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('success');
    
    const result = await mockAsyncFn();
    
    expect(result).toBe('success');
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  test('should mock rejected promises', async () => {
    const mockAsyncFn = jest.fn().mockRejectedValue(new Error('async error'));
    
    await expect(mockAsyncFn()).rejects.toThrow('async error');
  });
});

// Snapshot testing example (uncomment to use)
/*
describe('Snapshot Testing', () => {
  test('calculator result should match snapshot', () => {
    const calculator = new Calculator();
    calculator.add(2, 3);
    calculator.multiply(4, 5);
    
    const history = calculator.getHistory();
    expect(history).toMatchSnapshot();
  });
});
*/