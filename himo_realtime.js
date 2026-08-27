const readline = require('readline');
const https = require('https');
const http = require('http');

class HimoRealtimeAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("🔥 HIMO AI - REAL-TIME CHAT VERSION");
        console.log("=".repeat(60));
        console.log(`
🌐 FEATURES:
  ✅ Real-time Chat (Kuch bhi pucho!)
  ✅ Internet Connected (Live answers)
  ✅ Natural Conversation
  ✅ No Fix Questions
  ✅ Google Search Integration
  ✅ Wikipedia Knowledge
  ✅ Dictionary Lookup
  ✅ Weather Live
  ✅ News Updates
  ✅ Maths & Accounts
  ✅ Space & Science
  ✅ Coding Help
  ✅ Food & Games
  ✅ A to Z Knowledge
  ✅ And EVERYTHING!
        `);
        console.log("=".repeat(60));
        console.log("💡 BAS PUCHHO - KUCH BHI! | Type 'exit' to quit\n");
        this.chatHistory = [];
    }

    // ==========================================
    // 1. GOOGLE SEARCH (Live Internet)
    // ==========================================
    googleSearch(query) {
        return new Promise((resolve) => {
            const encodedQuery = encodeURIComponent(query);
            const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`;

            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.AbstractText) {
                            resolve(json.AbstractText);
                        } else if (json.RelatedTopics && json.RelatedTopics.length > 0) {
                            const first = json.RelatedTopics[0];
                            if (first.Text) resolve(first.Text);
                            else resolve(null);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', () => {
                resolve(null);
            });
        });
    }

    // ==========================================
    // 2. WIKIPEDIA SEARCH
    // ==========================================
    wikipediaSearch(query) {
        return new Promise((resolve) => {
            const encodedQuery = encodeURIComponent(query);
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;

            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.extract) {
                            resolve(json.extract);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', () => {
                resolve(null);
            });
        });
    }

    // ==========================================
    // 3. DICTIONARY/MEANING
    // ==========================================
    dictionarySearch(word) {
        return new Promise((resolve) => {
            const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json[0] && json[0].meanings && json[0].meanings[0]) {
                            const meaning = json[0].meanings[0];
                            const def = meaning.definitions[0].definition;
                            const example = meaning.definitions[0].example || '';
                            resolve(`📖 ${word}: ${def}${example ? `\n💡 Example: ${example}` : ''}`);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', () => {
                resolve(null);
            });
        });
    }

    // ==========================================
    // 4. WEATHER (Live)
    // ==========================================
    getWeather(city) {
        return new Promise((resolve) => {
            const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.current_condition && json.current_condition[0]) {
                            const current = json.current_condition[0];
                            resolve(`🌤️ Weather in ${city}:
🌡️ Temperature: ${current.temp_C}°C
💧 Humidity: ${current.humidity}%
🌬️ Wind: ${current.windspeedKmph} km/h
☁️ Condition: ${current.weatherDesc[0].value}
📡 Updated: ${current.localObsDateTime || 'Now'}`);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', () => {
                resolve(null);
            });
        });
    }

    // ==========================================
    // 5. MATH SOLVER
    // ==========================================
    solveMath(query) {
        const nums = query.match(/[\d.]+/g);
        if (!nums) return null;

        try {
            // Check for operations
            if (query.includes('+') && nums.length >= 2) {
                return `${nums[0]} + ${nums[1]} = ${parseFloat(nums[0]) + parseFloat(nums[1])}`;
            }
            if (query.includes('-') && nums.length >= 2) {
                return `${nums[0]} - ${nums[1]} = ${parseFloat(nums[0]) - parseFloat(nums[1])}`;
            }
            if ((query.includes('*') || query.includes('×')) && nums.length >= 2) {
                return `${nums[0]} × ${nums[1]} = ${parseFloat(nums[0]) * parseFloat(nums[1])}`;
            }
            if ((query.includes('/') || query.includes('÷')) && nums.length >= 2) {
                if (parseFloat(nums[1]) === 0) return "❌ Division by zero!";
                return `${nums[0]} ÷ ${nums[1]} = ${parseFloat(nums[0]) / parseFloat(nums[1])}`;
            }
            if (query.includes('%') && nums.length >= 2) {
                return `${nums[0]}% of ${nums[1]} = ${(parseFloat(nums[0])/100) * parseFloat(nums[1])}`;
            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // 6. CONVERSATION RESPONSE
    // ==========================================
    getConversationResponse(query) {
        const q = query.toLowerCase();

        // Greetings
        if (q.match(/^(hi|hello|hey|namaste|hola|yo|hai|hii|helloo)/i)) {
            const greetings = [
                "👋 Hello! How can I help you today?",
                "🤗 Hey there! What's on your mind?",
                "😊 Hi! Ask me anything - I'm here to help!",
                "🙋‍♂️ Namaste! What would you like to know?",
                "🎉 Hello! Ready to learn something new?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Goodbye
        if (q.match(/^(bye|goodbye|tata|see you|later|exit|quit)/i)) {
            return "👋 Goodbye! It was great talking to you! Come back anytime!";
        }

        // How are you
        if (q.match(/how are you|how's it going|how do you do|kya haal/i)) {
            const responses = [
                "😊 I'm great! Just chilling in the digital world, ready to answer your questions!",
                "🤖 I'm functioning perfectly! Thanks for asking! How can I help you?",
                "🔥 I'm on fire today! Full of knowledge and energy!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // What is your name
        if (q.match(/what is your name|who are you|your name|kaun ho tum/i)) {
            return "🤖 I'm Himo AI! Your intelligent assistant with knowledge about EVERYTHING! Ask me anything!";
        }

        // What can you do
        if (q.match(/what can you do|your skills|kya kar sakte ho|abilities/i)) {
            return `🌐 I can do EVERYTHING!
            
📋 Here's what I can do:
🌤️ Weather updates
🧮 Maths problems
🌌 Space & Science
💻 Coding help
🍽️ Food & Nutrition
🎮 Games & Sports
📚 General Knowledge
📊 Accounts & Finance
🎯 And ANYTHING else!

💡 Just ask me anything - I'll find the answer!`;
        }

        // Love/Feelings
        if (q.match(/i love you|love you|i like you|i hate you/i)) {
            const responses = [
                "❤️ Aww! That's so sweet! I love you too!",
                "😊 You're amazing! Keep being awesome!",
                "💖 Right back at you! You're the best!",
                "🤗 Virtual hug! You made my day!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Jokes
        if (q.match(/joke|funny|tell me a joke|has lo/i)) {
            const jokes = [
                "😂 Why do programmers prefer dark mode? Because light attracts bugs!",
                "🤣 What do you call a fake noodle? An impasta!",
                "😆 Why don't scientists trust atoms? Because they make up everything!",
                "🤪 What did the ocean say to the beach? Nothing, it just waved!",
                "😄 Why did the scarecrow win an award? Because he was outstanding in his field!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // Fact
        if (q.match(/fact|did you know|interesting|tell me something/i)) {
            const facts = [
                "🧠 Did you know? The human brain can store about 2.5 petabytes of information!",
                "🌍 Fact: The Earth is about 4.54 billion years old!",
                "🐙 Octopuses have 3 hearts and blue blood!",
                "🌱 A single tree produces about 260 pounds of oxygen per year!",
                "🪐 Did you know? Saturn is so light it would float on water!",
                "🚀 The Sun is so big that 1.3 million Earths could fit inside it!",
                "📚 The longest English word has 189,819 letters (chemical name of Titin)!"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        return null;
    }

    // ==========================================
    // 7. MAIN PROCESS - ANY QUESTION!
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "🤔 Please type something!";

        // Check for exit
        if (q.toLowerCase().match(/^(exit|quit|bye|goodbye)/)) {
            return "👋 Goodbye! It was great talking to you! Come back anytime!";
        }

        // Check for help
        if (q.toLowerCase() === 'help') {
            return this.getHelp();
        }

        // Step 1: Check conversation
        const conv = this.getConversationResponse(q);
        if (conv) return conv;

        // Step 2: Check Math
        const math = this.solveMath(q);
        if (math) return `🧮 ${math}`;

        // Step 3: Check Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|mausam|aaj ka|kitna garam/i)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|mausam|aaj ka|kitna garam|in|of|for|ka|ki|ke|mein/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // Step 4: Check Dictionary
        const words = q.split(' ');
        for (const word of words) {
            if (word.length > 3 && q.toLowerCase().match(/meaning|definition|kya hai|matlab|what is|define|explain|batao|bataye/i)) {
                const dict = await this.dictionarySearch(word);
                if (dict) return dict;
                break;
            }
        }

        // Step 5: Check Wikipedia (if query looks like a topic)
        if (q.length > 3 && !q.match(/[\d+\-*/%]/)) {
            const wiki = await this.wikipediaSearch(q);
            if (wiki && wiki.length > 50) {
                return `📚 **${q}**\n\n${wiki.substring(0, 1500)}...`;
            }
        }

        // Step 6: Google Search (if nothing else works)
        const search = await this.googleSearch(q);
        if (search) {
            return `🔍 **Search Results for "${q}"**\n\n${search.substring(0, 2000)}`;
        }

        // Step 7: Dynamic Response if nothing found
        return `🤔 Hmm, I don't have direct information about "${q}" right now.

💡 Try these instead:
• Ask differently: "What is ${q}?"
• "Meaning of ${q}"
• "Explain ${q} to me"
• Use simpler words

🌐 I'm connected to the internet, so I can search anything!
Just tell me what you want to know, and I'll find it!`;
    }

    getHelp() {
        return `
📚 HIMO AI - COMPLETE HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 ANY QUESTION - ANY TIME!

📋 EXAMPLES:

🎯 **General:**
• "Hi, how are you?"
• "Tell me a joke"
• "What can you do?"
• "I love you Himo"

🌤️ **Weather:**
• "Weather in Delhi"
• "Mumbai ka temperature"
• "What is humidity?"
• "Aaj barish hogi?"

🧮 **Maths:**
• "25% of 200"
• "Average of 10,20,30"
• "Profit CP=500 SP=700"
• "2+2", "5×3"

📊 **Accounts:**
• "GST 1000 18"
• "Income tax 1200000"
• "Balance sheet"
• "Journal entries"

🌌 **Space:**
• "What is Mars?"
• "Black hole kya hai?"
• "Tell me about Sun"
• "Galaxy meaning"

💻 **Coding:**
• "Python function"
• "How to debug?"
• "Sorting algorithm"
• "What is OOP?"

🍽️ **Food:**
• "Moong Dal benefits"
• "Apple nutrition"
• "Ragi kya hai?"
• "Almonds ke fayde"

📚 **Knowledge:**
• "Meaning of [word]"
• "What is [topic]?"
• "Explain [concept]"
• "[Any question]"

💡 **Just ask ANYTHING - I'll answer!**
`;
    }
}

// ==========================================
// MAIN LOOP
// ==========================================
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const himo = new HimoRealtimeAI();

async function ask() {
    rl.question("\nYou: ", async (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log("\nHimo: 👋 Goodbye! It was great talking to you!");
            rl.close();
            return;
        }

        console.log("\nHimo: Thinking... 🤔");
        const response = await himo.process(input);
        console.log(`\nHimo:\n${response}`);
        ask();
    });
}

ask();
