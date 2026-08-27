const readline = require('readline');
const https = require('https');

// ============================================
// 🔥 HIMO - REAL-TIME CHAT + INTERNET + ALL KNOWLEDGE
// ============================================

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("🔥 HIMO AI - REAL-TIME COMPLETE VERSION");
        console.log("=".repeat(60));
        console.log(`
✅ KUCH BHI PUCHHO - JAWAB MILEGA!
✅ INTERNET CONNECTED - LIVE ANSWERS!
✅ NATURAL CONVERSATION
✅ WEATHER | MATHS | ACCOUNTS | SPACE | CODING | FOOD | GAMES | A to Z
        `);
        console.log("=".repeat(60));
        console.log("💡 Type 'exit' to quit | 'help' for examples\n");
        this.chatHistory = [];
    }

    // ==========================================
    // WEATHER (Live)
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
                            resolve(`🌤️ **Weather in ${city}**:
🌡️ Temperature: ${c.temp_C}°C
💧 Humidity: ${c.humidity}%
🌬️ Wind: ${c.windspeedKmph} km/h
☁️ Condition: ${c.weatherDesc[0].value}
📡 Updated: ${c.localObsDateTime || 'Now'}`);
                        } else resolve(null);
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // ==========================================
    // GOOGLE SEARCH
    // ==========================================
    googleSearch(query) {
        return new Promise((resolve) => {
            const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.AbstractText) resolve(json.AbstractText);
                        else if (json.RelatedTopics && json.RelatedTopics[0]?.Text) {
                            resolve(json.RelatedTopics[0].Text);
                        } else resolve(null);
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
    }

    // ==========================================
    // WIKIPEDIA
    // ==========================================
    wikipediaSearch(query) {
        return new Promise((resolve) => {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.extract) resolve(json.extract);
                        else resolve(null);
                    } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
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
                return `${nums[0]} × ${nums[1]} = ${parseFloat(nums[0]) * parseFloat(nums[1])}`;
            }
            if ((q.includes('/') || q.includes('÷')) && nums.length >= 2) {
                if (parseFloat(nums[1]) === 0) return "❌ Division by zero!";
                return `${nums[0]} ÷ ${nums[1]} = ${parseFloat(nums[0]) / parseFloat(nums[1])}`;
            }
            if ((q.includes('%') || q.includes('percent')) && nums.length >= 2) {
                return `${nums[0]}% of ${nums[1]} = ${(parseFloat(nums[0])/100) * parseFloat(nums[1])}`;
            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // GST CALCULATOR
    // ==========================================
    calculateGST(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) return null;
        if (!q.toLowerCase().includes('gst')) return null;
        try {
            const price = parseFloat(nums[0]);
            const rate = parseFloat(nums[1]);
            const gst = (rate/100) * price;
            return `🏷️ **GST Calculation:**
Base Price: ₹${price}
GST Rate: ${rate}%
GST Amount: ₹${gst.toFixed(2)}
Total: ₹${(price + gst).toFixed(2)}

📝 Formula: GST = (Rate% × Price) / 100`;
        } catch(e) { return null; }
    }

    // ==========================================
    // PROFIT/LOSS
    // ==========================================
    calculateProfitLoss(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) return null;
        if (!q.toLowerCase().includes('profit') && !q.toLowerCase().includes('loss')) return null;
        try {
            const cp = parseFloat(nums[0]);
            const sp = parseFloat(nums[1]);
            if (sp > cp) {
                const p = sp - cp;
                return `💰 **Profit:**
CP = ₹${cp}, SP = ₹${sp}
Profit = ₹${p}
Profit% = ${((p/cp)*100).toFixed(2)}%

📝 Formula: Profit = SP - CP`;
            } else if (cp > sp) {
                const l = cp - sp;
                return `💸 **Loss:**
CP = ₹${cp}, SP = ₹${sp}
Loss = ₹${l}
Loss% = ${((l/cp)*100).toFixed(2)}%

📝 Formula: Loss = CP - SP`;
            } else {
                return `🤝 No Profit No Loss: CP = SP = ₹${cp}`;
            }
        } catch(e) { return null; }
    }

    // ==========================================
    // ACCOUNTS KNOWLEDGE
    // ==========================================
    getAccountsInfo(q) {
        const ql = q.toLowerCase();
        if (ql.includes('balance sheet')) {
            return `
📊 **BALANCE SHEET FORMAT:**
━━━━━━━━━━━━━━━━━━━━━━━━━━
LIABILITIES          | ASSETS
━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━
Capital              | Fixed Assets
+ Net Profit         |   - Land/Building
- Drawings           |   - Furniture
Creditors            |   - Machinery
Bills Payable        | Current Assets
Outstanding Expenses |   - Cash
Bank Loan            |   - Bank
                     |   - Debtors
                     |   - Stock
━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━
Total                | Total

📝 Assets = Liabilities + Capital | Debit = Credit`;
        }
        if (ql.includes('journal') || ql.includes('journal entry')) {
            return `
📝 **JOURNAL ENTRIES:**
1️⃣ Cash Sales: Cash A/c Dr → Sales A/c Cr
2️⃣ Credit Purchase: Purchase A/c Dr → Creditor A/c Cr
3️⃣ Payment: Creditor A/c Dr → Cash A/c Cr
4️⃣ Salary: Salary A/c Dr → Cash A/c Cr

📝 Golden Rules:
• Personal: Debit receiver, Credit giver
• Real: Debit what comes in, Credit what goes out
• Nominal: Debit expenses, Credit incomes`;
        }
        if (ql.includes('gst')) {
            return `🏷️ **GST Guide:**
Slabs: 0% | 5% | 12% | 18% | 28%
Formula: GST = (Rate% × Price) / 100
Total = Price + GST

💡 Example: "GST 1000 18"`;
        }
        return null;
    }

    // ==========================================
    // CONVERSATION RESPONSES
    // ==========================================
    getConversation(q) {
        const ql = q.toLowerCase();
        if (ql.match(/^(hi|hello|hey|namaste|hola|yo|hai|hii|helloo)/)) {
            const g = ["👋 Hello! How can I help?", "🤗 Hey! What's on your mind?", "😊 Hi! Ask me anything!", "🙋‍♂️ Namaste! Ready to help!"];
            return g[Math.floor(Math.random() * g.length)];
        }
        if (ql.match(/how are you|how's it going|kya haal|kaisa hai/i)) {
            return "😊 I'm great! Full of energy and knowledge! How about you?";
        }
        if (ql.match(/what is your name|who are you|kaun ho tum|your name/i)) {
            return "🤖 I'm Himo AI! Your intelligent assistant with knowledge about EVERYTHING!";
        }
        if (ql.match(/what can you do|kya kar sakte ho|abilities|skills/i)) {
            return `🌐 **I can do EVERYTHING!**
✅ Weather updates (Live)
✅ Maths problems
✅ GST & Accounts
✅ Profit/Loss
✅ Space & Science
✅ Coding help
✅ Food & Nutrition
✅ Games & Sports
✅ General Knowledge
✅ ANYTHING else!

💡 Just ask me anything - I'll find the answer!`;
        }
        if (ql.match(/i love you|love you|i like you|i hate you/i)) {
            return "❤️ Aww! That's so sweet! I love you too! You're amazing!";
        }
        if (ql.match(/joke|funny|tell me a joke|has lo/i)) {
            const j = [
                "😂 Why do programmers prefer dark mode? Light attracts bugs!",
                "🤣 What do you call a fake noodle? An impasta!",
                "😆 Why don't scientists trust atoms? They make up everything!",
                "🤪 What did the ocean say to the beach? Nothing, it just waved!"
            ];
            return j[Math.floor(Math.random() * j.length)];
        }
        if (ql.match(/fact|did you know|interesting|tell me something/i)) {
            const f = [
                "🧠 The human brain can store 2.5 petabytes of information!",
                "🌍 Earth is 4.54 billion years old!",
                "🪐 Saturn is so light it would float on water!",
                "🚀 1.3 million Earths can fit inside the Sun!"
            ];
            return f[Math.floor(Math.random() * f.length)];
        }
        return null;
    }

    // ==========================================
    // MAIN PROCESS - ANYTHING!
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "🤔 Please type something!";

        if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit' || q.toLowerCase() === 'bye') {
            return "👋 Goodbye! It was great talking to you! Come back anytime!";
        }

        if (q.toLowerCase() === 'help') {
            return this.getHelp();
        }

        // 1. Conversation
        const conv = this.getConversation(q);
        if (conv) return conv;

        // 2. Maths
        const math = this.solveMath(q);
        if (math) return `🧮 ${math}`;

        // 3. GST
        const gst = this.calculateGST(q);
        if (gst) return gst;

        // 4. Profit/Loss
        const pl = this.calculateProfitLoss(q);
        if (pl) return pl;

        // 5. Accounts Knowledge
        const acc = this.getAccountsInfo(q);
        if (acc) return acc;

        // 6. Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|mausam|aaj ka|kitna garam|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune|ahmedabad|surat|lucknow|patna/i)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|mausam|aaj ka|kitna garam|in|of|for|ka|ki|ke|mein/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // 7. Wikipedia
        if (q.length > 3 && !q.match(/[\d+\-*/%]/)) {
            const wiki = await this.wikipediaSearch(q);
            if (wiki && wiki.length > 50) {
                return `📚 **${q}**\n\n${wiki.substring(0, 1500)}...`;
            }
        }

        // 8. Google Search
        const search = await this.googleSearch(q);
        if (search) {
            return `🔍 **Search Results for "${q}"**\n\n${search.substring(0, 2000)}`;
        }

        // 9. Final fallback
        return `🤔 I couldn't find specific information about "${q}" right now.

💡 Try asking differently:
• "What is ${q}?"
• "Meaning of ${q}"
• "Explain ${q} to me"
• "Tell me about ${q}"

🌐 I'm connected to the internet - I can search anything!
Just tell me what you want to know!`;
    }

    getHelp() {
        return `
📚 **HIMO AI - COMPLETE HELP**
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 **ANY QUESTION - ANY TIME!**

📋 **EXAMPLES:**

🎯 **General:**
• "Hi, how are you?"
• "Tell me a joke"
• "What can you do?"

🌤️ **Weather:**
• "Weather in Delhi"
• "Mumbai temperature"
• "Aaj barish hogi?"

🧮 **Maths:**
• "25% of 200"
• "Average of 10,20,30"
• "2+2", "5×3"

📊 **Accounts:**
• "GST 1000 18"
• "Balance sheet"
• "Journal entries"

📊 **Profit/Loss:**
• "Profit CP=500 SP=700"
• "Loss CP=1000 SP=800"

🌌 **Space:**
• "What is Mars?"
• "Black hole kya hai?"
• "Tell me about Sun"

💻 **Coding:**
• "Python function"
• "How to debug?"

🍽️ **Food:**
• "Moong Dal benefits"
• "Apple nutrition"

📚 **Knowledge:**
• "Meaning of [word]"
• "What is [topic]?"
• "[Any question]"

💡 **Just ask ANYTHING - I'll answer!**`;
    }
}

// ==========================================
// MAIN LOOP
// ==========================================
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const himo = new HimoAI();

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
