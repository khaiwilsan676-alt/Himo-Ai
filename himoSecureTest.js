import readline from 'readline';
import { handleNeuralTraining, generateTable, generateCounting, processCodeRequest, synthesizeAutonomousCognition } from './src/lib/omniEngine.js';
import { getWeatherClimateInfo } from './src/lib/weatherEngine.js';
import { evaluateMasterMath } from './src/lib/mathMasterEngine.js';
import { getHumanMasterInfo } from './src/lib/humanEngine.js';
import { getHumanDeepPerspective } from './src/lib/humanMasterPhilosophy.js';
import { getGlobalKnowledge } from './src/lib/globalKnowledgeEngine.js';

const SECRET_CREATOR_ID = "8Gef8W6R5DQyhJeKVtDVURHg5Wv2";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=================================================");
console.log("HIMO SOVEREIGN ENGINE v27.0 (Live Web Search Enabled)");
console.log("Type any question. Himo will search the web live and reply.");
console.log("Security: Type 'SWITCH HIMO TRAINING MODE' to unlock.");
console.log("Type 'exit' to quit.");
console.log("=================================================\n");

const askQuestion = () => {
  rl.question('You: ', async (input) => {
    const clean = input.trim();
    if (clean.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const lowerInput = clean.toLowerCase();
    const isCodeRequest = 
      lowerInput.includes("code") || lowerInput.includes("html") || 
      lowerInput.includes("css") || lowerInput.includes("python") || 
      lowerInput.includes("java") || lowerInput.includes("script") || 
      lowerInput.includes("write an") || lowerInput.includes("give code");

    let response = null;

    if (isCodeRequest) {
      response = processCodeRequest(clean);
    } else {
      response = 
        handleNeuralTraining(clean, SECRET_CREATOR_ID) ||
        evaluateMasterMath(clean) ||
        getWeatherClimateInfo(clean) ||
        getGlobalKnowledge(clean) ||
        getHumanDeepPerspective(clean) ||
        getHumanMasterInfo(clean) ||
        generateTable(clean) ||
        generateCounting(clean) ||
        (await synthesizeAutonomousCognition(clean));
    }

    let professionalResponse = response ? response.replace(/[\*\_\#]/g, '') : "No response generated.";

    console.log(`\nHimo:\n${professionalResponse}\n`);
    askQuestion();
  });
};

askQuestion();
