// scratch/test_service.js
require('dotenv').config({ path: '.env.local' });

async function runTests() {
  console.log('Testing lib/voice-studio.ts logic...');

  // 1. Test health check against live Voice Studio (port 3900)
  const { checkVoiceStudioHealth, getOrCreateStoryAudio } = require('./lib/voice-studio.ts');
  
  // Note: since this is TypeScript, let's test using ts-node or Next.js route, or compile it
}
