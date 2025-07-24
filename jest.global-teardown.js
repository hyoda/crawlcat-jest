const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🧹 Jest Global Teardown - Cleaning up test environment...');

  try {
    // Read test configuration
    const configPath = path.join(process.cwd(), 'test-config.json');
    let testConfig = {};
    
    if (fs.existsSync(configPath)) {
      testConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // Calculate test session duration
    if (testConfig.startTime) {
      const startTime = new Date(testConfig.startTime);
      const endTime = new Date();
      const duration = (endTime - startTime) / 1000; // seconds
      
      console.log(`⏱️  Test session duration: ${duration.toFixed(2)} seconds`);
    }

    // Clean up temporary files
    const tempFiles = [
      'test-config.json',
      'jest-results.json'
    ];

    for (const file of tempFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed temporary file: ${file}`);
      }
    }

    // Clean up old screenshots (keep only last 50)
    const screenshotDir = path.join(process.cwd(), 'e2e', 'outputs', 'screenshots');
    if (fs.existsSync(screenshotDir)) {
      const files = fs.readdirSync(screenshotDir)
        .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
        .map(file => ({
          name: file,
          path: path.join(screenshotDir, file),
          time: fs.statSync(path.join(screenshotDir, file)).mtime
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length > 50) {
        const filesToDelete = files.slice(50);
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
        }
        console.log(`🗑️  Cleaned up ${filesToDelete.length} old screenshots`);
      }
    }

    // Generate test summary
    const summaryPath = path.join(process.cwd(), 'coverage', 'test-summary.json');
    const summary = {
      completedAt: new Date().toISOString(),
      testEnvironment: 'jest',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      ...testConfig
    };

    // Ensure coverage directory exists
    const coverageDir = path.dirname(summaryPath);
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Test summary saved to: ${summaryPath}`);

    // Print final statistics
    console.log('\n📈 Test Session Summary:');
    console.log(`   Platform: ${process.platform} (${process.arch})`);
    console.log(`   Node.js: ${process.version}`);
    console.log(`   Completed: ${new Date().toISOString()}`);

    // Check for any remaining browser processes (cleanup hint)
    if (process.platform !== 'win32') {
      try {
        const { execSync } = require('child_process');
        const chromeProcesses = execSync('pgrep -f chrome || true', { encoding: 'utf8' }).trim();
        if (chromeProcesses) {
          console.log('⚠️  Note: Some Chrome processes may still be running');
          console.log('   If needed, clean up with: pkill -f chrome');
        }
      } catch (error) {
        // Ignore errors in process cleanup check
      }
    }

  } catch (error) {
    console.error('❌ Error during global teardown:', error.message);
  }

  console.log('✅ Jest Global Teardown completed');
};