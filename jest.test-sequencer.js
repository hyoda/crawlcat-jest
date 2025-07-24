const Sequencer = require('@jest/test-sequencer').default;

class CustomTestSequencer extends Sequencer {
  /**
   * Sort test files to run faster tests first and E2E tests last
   */
  sort(tests) {
    // Define test priority order (lower number = higher priority)
    const testPriorities = {
      'basic-tests': 1,        // Unit tests - run first
      'src/': 2,               // Source unit tests
      'lib/': 3,               // Library tests
      'ai/': 4,                // AI integration tests
      'crawling-tests': 5,     // Puppeteer tests
      'automation-tests': 6,   // Full workflow tests - run last
      'e2e/': 7               // E2E scenarios - run last
    };

    const sortedTests = tests.sort((testA, testB) => {
      const pathA = testA.path;
      const pathB = testB.path;

      // Determine priority for each test
      const priorityA = this.getTestPriority(pathA, testPriorities);
      const priorityB = this.getTestPriority(pathB, testPriorities);

      // Sort by priority first
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same priority, sort by file size (smaller files first)
      const sizeA = testA.context?.config?.testPathLength || pathA.length;
      const sizeB = testB.context?.config?.testPathLength || pathB.length;

      if (sizeA !== sizeB) {
        return sizeA - sizeB;
      }

      // Finally, sort alphabetically
      return pathA.localeCompare(pathB);
    });

    console.log('\n🎯 Test Execution Order:');
    sortedTests.forEach((test, index) => {
      const priority = this.getTestPriority(test.path, testPriorities);
      const testType = this.getTestType(test.path);
      console.log(`   ${index + 1}. [${testType}] ${this.getRelativePath(test.path)}`);
    });
    console.log('');

    return sortedTests;
  }

  /**
   * Get priority for a test path
   */
  getTestPriority(testPath, priorities) {
    for (const [pathPattern, priority] of Object.entries(priorities)) {
      if (testPath.includes(pathPattern)) {
        return priority;
      }
    }
    return 999; // Default low priority for unmatched tests
  }

  /**
   * Get human-readable test type
   */
  getTestType(testPath) {
    if (testPath.includes('basic-tests')) return 'UNIT';
    if (testPath.includes('src/') && testPath.includes('.test.')) return 'UNIT';
    if (testPath.includes('lib/') && testPath.includes('.test.')) return 'UNIT';
    if (testPath.includes('ai/')) return 'AI';
    if (testPath.includes('crawling-tests')) return 'CRAWL';
    if (testPath.includes('automation-tests')) return 'E2E';
    if (testPath.includes('e2e/')) return 'E2E';
    return 'OTHER';
  }

  /**
   * Get relative path for display
   */
  getRelativePath(fullPath) {
    const cwd = process.cwd();
    return fullPath.replace(cwd, '').replace(/^\//, '');
  }
}

module.exports = CustomTestSequencer;