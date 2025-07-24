const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🚀 Jest Global Setup - Initializing test environment...');

  // Create necessary directories
  const directories = [
    'e2e/outputs/screenshots',
    'e2e/outputs/generated',
    'e2e/scenarios/ai-generated',
    'e2e/scenarios/converted',
    'coverage'
  ];

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  // Create .gitkeep files to preserve directory structure
  const gitkeepDirs = [
    'e2e/outputs/screenshots',
    'e2e/outputs/generated'
  ];

  for (const dir of gitkeepDirs) {
    const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  }

  // Check if Puppeteer Chromium is installed
  try {
    const puppeteerPath = path.join(process.cwd(), 'node_modules', 'puppeteer');
    if (fs.existsSync(puppeteerPath)) {
      console.log('✅ Puppeteer found');
      
      // Try to get Puppeteer executable path
      try {
        const puppeteer = require('puppeteer');
        const executablePath = puppeteer.executablePath();
        console.log(`🌐 Browser executable: ${executablePath}`);
      } catch (error) {
        console.log('⚠️  Could not determine browser executable path');
      }
    }
  } catch (error) {
    console.log('⚠️  Puppeteer setup check failed:', error.message);
  }

  // Set global test environment variables
  process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || '1';
  process.env.NODE_ENV = 'test';
  process.env.TEST_TIMEOUT = '30000';

  // Create test configuration
  const testConfig = {
    startTime: new Date().toISOString(),
    testEnvironment: 'jest',
    puppeteerConfig: {
      headless: process.env.CI === 'true', // Headless in CI, headed locally
      slowMo: process.env.CI === 'true' ? 0 : 100,
      defaultTimeout: 30000
    }
  };

  // Save test configuration
  const configPath = path.join(process.cwd(), 'test-config.json');
  fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

  console.log('✅ Jest Global Setup completed successfully');
  console.log(`📊 Test session started at: ${testConfig.startTime}`);
  console.log(`🖥️  Environment: ${process.env.NODE_ENV}`);
  console.log(`👥 Worker ID: ${process.env.JEST_WORKER_ID}`);
};