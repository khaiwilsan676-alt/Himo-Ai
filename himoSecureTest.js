import readline from 'readline';
import { handleNeuralTraining, generateTable, generateCounting, processCodeRequest } from './src/lib/omniEngine.js';
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
console.log("HIMO SECURE OMNI ENGINE v23.1 (Professional Mode Fixed)");
console.log("Security: Type 'SWITCH HIMO TRAINING MODE' to unlock.");
console.log("Type 'exit' to quit.");
console.log("=================================================\n");

const askQuestion = () => {
  rl.question('You: ', (input) => {
    const clean = input.trim();
    if (clean.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    let response = 
      getGlobalKnowledge(clean) ||
      getHumanDeepPerspective(clean) ||
      getHumanMasterInfo(clean) ||
      getWeatherClimateInfo(clean) ||
      handleNeuralTraining(clean, SECRET_CREATOR_ID) ||
      evaluateMasterMath(clean) ||
      generateTable(clean) ||
      generateCounting(clean) ||
      processCodeRequest(clean);

    // Clean up markdown symbols and emojis safely without regex range errors
    let professionalResponse = response ? response : "No response generated.";
    professionalResponse = professionalResponse.replace(/[\*\_\#]/g, '');

    console.log(`\nHimo:\n${professionalResponse}\n`);
    askQuestion();
  });
};

askQuestion();
