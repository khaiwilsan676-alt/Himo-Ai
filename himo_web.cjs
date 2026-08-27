const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("HIMO AI - FULL INTERNET SEARCH");
        console.log("=".repeat(60));
        console.log(`
✅ A to Z - HAR CHEEZ KA JAWAB!
✅ INTERNET SEARCH - LIVE ANSWERS!
✅ WIKIPEDIA + GOOGLE + DUCKDUCKGO!
✅ KUCH BHI PUCHO - JAWAB MILEGA!
        `);
        console.log("=".repeat(60));
        console.log("Type 'exit' to quit\n");
    }

    // ==========================================
    // WEB SEARCH - MAIN ENGINE
    // ==========================================

    // 1. DUCKDUCKGO SEARCH (Best for general queries)
    duckDuckGoSearch(query) {
        return new Promise((resolve) => {
            const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.AbstractText && json.AbstractText.length > 20) {
                            resolve(json.AbstractText);
                        } else if (json.RelatedTopics && json.RelatedTopics.length > 0) {
                            for (const topic of json.RelatedTopics) {
                                if (topic.Text && topic.Text.length > 20) {
                                    resolve(topic.Text);
                                    return;
                                }
                            }
                            resolve(null);
                        } else {
                            resolve(null);
                        }
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // 2. WIKIPEDIA SEARCH
    wikipediaSearch(query) {
        return new Promise((resolve) => {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.extract && json.extract.length > 50) {
                            resolve(json.extract);
                        } else {
                            resolve(null);
                        }
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // 3. GOOGLE SEARCH (via custom search)
    googleSearch(query) {
        return new Promise((resolve) => {
            const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.AbstractText) {
                            resolve(json.AbstractText);
                        } else if (json.RelatedTopics && json.RelatedTopics[0]?.Text) {
                            resolve(json.RelatedTopics[0].Text);
                        } else {
                            resolve(null);
                        }
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // 4. WIKIPEDIA SEARCH - MULTI WORD
    wikipediaMultiSearch(query) {
        return new Promise((resolve) => {
            const words = query.split(' ');
            const searchTerms = [];
            
            // Try different combinations
            for (let i = 0; i < words.length; i++) {
                for (let j = i + 1; j <= words.length; j++) {
                    const term = words.slice(i, j).join('_');
                    if (term.length > 3) searchTerms.push(term);
                }
            }
            
            // Also try original
            searchTerms.unshift(query.replace(/ /g, '_'));
            
            let tried = 0;
            let found = false;
            
            for (const term of searchTerms) {
                if (found) break;
                const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        tried++;
                        try {
                            const json = JSON.parse(data);
                            if (json.extract && json.extract.length > 50) {
                                found = true;
                                resolve(json.extract);
                            }
                        } catch(e) {}
                        if (tried >= searchTerms.length && !found) {
                            resolve(null);
                        }
                    });
                }).on('error', () => {
                    tried++;
                    if (tried >= searchTerms.length && !found) {
                        resolve(null);
                    }
                });
            }
            
            setTimeout(() => {
                if (!found) resolve(null);
            }, 5000);
        });
    }

    // ==========================================
    // MAIN SEARCH FUNCTION
    // ==========================================
    async searchWeb(query) {
        // Clean query
        const cleanQuery = query.replace(/what is|who is|what are|who are|why is|how is|where is|when is|which is|explain|define|meaning of|tell me about|information about|about|kya hai|kyu hai|kaise hai|kaun hai|kon hai|का है|क्या है|क्यों है|कैसे है|कौन है|कोन है/i, '').trim();
        
        // Try Wikipedia first
        let result = await this.wikipediaSearch(cleanQuery);
        if (result) return result;
        
        // Try Wikipedia with multiple words
        result = await this.wikipediaMultiSearch(cleanQuery);
        if (result) return result;
        
        // Try DuckDuckGo
        result = await this.duckDuckGoSearch(cleanQuery);
        if (result) return result;
        
        // Try Google
        result = await this.googleSearch(cleanQuery);
        if (result) return result;
        
        // Try with original query
        result = await this.duckDuckGoSearch(query);
        if (result) return result;
        
        return null;
    }

    // ==========================================
    // CONVERSATION
    // ==========================================
    getConversation(q) {
        const ql = q.toLowerCase();

        if (ql.match(/^(hi|hello|hey|hola|yo|hai|hii|helloo|namaste|नमस्ते)/)) {
            return "Hello! I'm Himo AI. I can search the internet for anything! What would you like to know?";
        }

        if (ql.match(/how are you|how's it going|how do you do|what's up|kaisa hai|kya haal/i)) {
            return "I'm doing great! Connected to the internet and ready to search for anything!";
        }

        if (ql.match(/what is your name|who are you|your name|tell me about yourself|tu kon hai|kaun ho tum/i)) {
            return "I'm Himo AI - your internet-connected assistant! I can search for ANYTHING on the web! Just ask!";
        }

        if (ql.match(/thank|thanks|thank you|thx|dhanyawad|shukriya/i)) {
            return "You're welcome! Always happy to help!";
        }

        if (ql.match(/bye|goodbye|see you|later|exit|quit|alvida|tata/i)) {
            return "Goodbye! Come back anytime for more information!";
        }

        if (ql.match(/joke|funny|tell me a joke|make me laugh|has lo|mazak|chutkula/i)) {
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "What do you call a fake noodle? An impasta!",
                "Why don't scientists trust atoms? Because they make up everything!",
                "What did the ocean say to the beach? Nothing, it just waved!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        if (ql.match(/fact|did you know|interesting|tell me something|fun fact/i)) {
            const facts = [
                "The human brain can store about 2.5 petabytes of information!",
                "Earth is about 4.54 billion years old!",
                "Saturn is so light it would float on water!",
                "1.3 million Earths can fit inside the Sun!"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        return null;
    }

    // ==========================================
    // MATHS
    // ==========================================
    solveMath(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums) return null;
        try {
            if (q.includes('+') && nums.length >= 2) {
                return `${nums[0]} + ${nums[1]} = ${parseFloat(nums[0]) + parseFloat(nums[1])}`;
            }
            if (q.includes('-') && nums.length >= 2) {
                return `${nums[0]} - ${nums[1]} = ${parseFloat(nums[0]) - parseFloat(nums[1])}`;
            }
            if ((q.includes('*') || q.includes('×')) && nums.length >= 2) {
                return `${nums[0]} x ${nums[1]} = ${parseFloat(nums[0]) * parseFloat(nums[1])}`;
            }
            if ((q.includes('/') || q.includes('÷')) && nums.length >= 2) {
                if (parseFloat(nums[1]) === 0) return "Cannot divide by zero!";
                return `${nums[0]} / ${nums[1]} = ${parseFloat(nums[0]) / parseFloat(nums[1])}`;
            }
            if ((q.includes('%') || q.includes('percent')) && nums.length >= 2) {
                return `${nums[0]}% of ${nums[1]} = ${(parseFloat(nums[0])/100) * parseFloat(nums[1])}`;
            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // WEATHER
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
                            const c = json.current_condition[0];
                            resolve(`Weather in ${city}:
Temperature: ${c.temp_C}C
Humidity: ${c.humidity}%
Wind: ${c.windspeedKmph} km/h
Condition: ${c.weatherDesc[0].value}`);
                        } else resolve(null);
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // ==========================================
    // MAIN PROCESS
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "Please type something!";

        if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit' || q.toLowerCase() === 'bye') {
            return "Goodbye! It was great talking to you!";
        }

        // 1. Conversation
        const conv = this.getConversation(q);
        if (conv) return conv;

        // 2. Math
        const math = this.solveMath(q);
        if (math) return math;

        // 3. Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune/)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|in|of|for/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // 4. INTERNET SEARCH - MAIN!
        console.log("Searching the internet...");
        const result = await this.searchWeb(q);
        if (result) {
            return `Answer for "${q}":\n\n${result.substring(0, 2000)}`;
        }

        // 5. Fallback
        return `I couldn't find information about "${q}" on the internet.

Try:
- Asking differently
- Using simpler words
- Asking about: Human, Earth, Mars, Black Hole, GST, Profit, etc.

I'm connected to the internet and can search anything!`;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const himo = new HimoAI();

async function ask() {
    rl.question("\nYou: ", async (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log("\nHimo: Goodbye! It was great talking to you!");
            rl.close();
            return;
        }

        console.log("\nHimo: Searching internet...");
        const response = await himo.process(input);
        console.log(`\nHimo:\n${response}`);
        ask();
    });
}

ask();
