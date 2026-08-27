const readline = require('readline');
const { generateUniversalCode } = require('./src/lib/universalCodeEngine');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=================================================");
console.log("🤖 HIMO UNIVERSAL CODE ENGINE (A to Z ANY Code)");
console.log("Type anything: 'python web scraper', 'bash script for termux', 'html login page', etc.");
console.log("Type 'exit' to quit.");
console.log("=================================================\n");

const askQuestion = () => {
  rl.question('You: ', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    const response = generateUniversalCode(input);
    console.log(`\nHimo:\n${response}\n`);
    askQuestion();
  });
};

askQuestion();
