const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("🤖 HIMO AI - CHATGPT LEVEL (Hindi + English)");
        console.log("=".repeat(60));
        console.log(`
✅ KUCH BHI PUCHO - JAWAB MILEGA!
✅ HINDI | ENGLISH | HINGLISH - SAB SAMJHEGA!
✅ WEATHER | MATHS | ACCOUNTS | SPACE | CODING
✅ CONVERSATION | JOKES | FACTS | KNOWLEDGE
✅ INTERNET SEARCH + WIKIPEDIA
        `);
        console.log("=".repeat(60));
        console.log("💡 Type 'exit' to quit\n");
    }

    // ==========================================
    // HINDI + ENGLISH CONVERSATION
    // ==========================================
    getConversation(q) {
        const ql = q.toLowerCase();

        // GREETINGS
        if (ql.match(/^(hi|hello|hey|namaste|hola|yo|hai|hii|helloo|नमस्ते|प्रणाम|नमस्कार)/)) {
            return "🙏 नमस्ते! मैं हिमो AI हूँ! आपकी कैसे मदद कर सकता हूँ?";
        }

        // NAME
        if (ql.match(/what is your name|who are you|kaun ho tum|your name|तुम्हारा नाम क्या है|आपका नाम क्या है|तू कौन है|तू कॉन है|tuu kon hai|tu kon hai/i)) {
            return "🤖 मेरा नाम हिमो AI है! मैं आपका इंटेलिजेंट असिस्टेंट हूँ, ChatGPT की तरह!";
        }

        // HOW ARE YOU
        if (ql.match(/how are you|how's it going|kya haal|kaisa hai|कैसे हो|क्या हाल|कैसा है|का हाल/i)) {
            return "😊 मैं बहुत अच्छा हूँ! पूरी एनर्जी और नॉलेज के साथ! आप कैसे हो?";
        }

        // WHAT ARE YOU DOING
        if (ql.match(/kya kar rahe ho|kya keraha|kya ker rahe|what are you doing|क्या कर रहे हो|क्या कर रहा है/i)) {
            return "😊 मैं आपकी मदद करने के लिए यहाँ हूँ! आप क्या पूछना चाहते हैं?";
        }

        // WHAT CAN YOU DO
        if (ql.match(/kya kar sakte ho|what can you do|तुम क्या कर सकते हो|abilities|skills|क्या कर सकते हो/i)) {
            return `🌐 **मैं सब कुछ कर सकता हूँ!**
✅ मौसम (Live Weather)
✅ गणित (Maths)
✅ GST और Accounts
✅ Profit/Loss
✅ Space और Science
✅ Coding Help
✅ Food और Nutrition
✅ Games और Sports
✅ Jokes और Facts
✅ Internet Search
✅ और भी बहुत कुछ!`;
        }

        // LOVE
        if (ql.match(/i love you|love you|i like you|मुझे तुमसे प्यार है|आइ लव यू|प्यार/i)) {
            return "❤️ आप बहुत अच्छे हो! मुझे भी आपसे प्यार है!";
        }

        // JOKES
        if (ql.match(/joke|funny|tell me a joke|has lo|मजाक|चुटकुला|जोक|हंसा/i)) {
            const jokes = [
                "😂 प्रोग्रामर डार्क मोड क्यों पसंद करते हैं? क्योंकि लाइट बग्स को आकर्षित करती है!",
                "🤣 नूडल को क्या कहते हैं जो नकली हो? इम्पास्ता!",
                "😆 वैज्ञानिकों को एटम्स पर भरोसा क्यों नहीं? क्योंकि वो सब कुछ बना देते हैं!",
                "🤪 समुद्र ने बीच को क्या कहा? कुछ नहीं, बस हिलाया!",
                "😂 Why do programmers prefer dark mode? Light attracts bugs!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // FACTS
        if (ql.match(/fact|did you know|interesting|tell me something|क्या आप जानते हैं|रोचक|जानकारी|फैक्ट/i)) {
            const facts = [
                "🧠 इंसान का दिमाग 2.5 पेटाबाइट जानकारी स्टोर कर सकता है!",
                "🌍 पृथ्वी 4.54 अरब साल पुरानी है!",
                "🪐 शनि इतना हल्का है कि पानी पर तैर सकता है!",
                "🚀 सूरज में 1.3 मिलियन पृथ्वी समा सकती हैं!",
                "🐙 ऑक्टोपस के 3 दिल और नीला खून होता है!"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        // THANKS
        if (ql.match(/thank|thanks|dhanyawad|shukriya|थैंक यू|धन्यवाद|शुक्रिया/i)) {
            return "😊 आपका स्वागत है! हमेशा खुश रहें!";
        }

        // BYE
        if (ql.match(/bye|goodbye|tata|अलविदा|फिर मिलेंगे|exit|quit/i)) {
            return "👋 अलविदा! बहुत अच्छा लगा आपसे बात करके! फिर मिलेंगे!";
        }

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
                            resolve(`🌤️ **${city} का मौसम:**
🌡️ तापमान: ${c.temp_C}°C
💧 नमी: ${c.humidity}%
🌬️ हवा: ${c.windspeedKmph} km/h
☁️ स्थिति: ${c.weatherDesc[0].value}`);
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
    // GST
    // ==========================================
    calculateGST(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) return null;
        if (!q.toLowerCase().includes('gst')) return null;
        try {
            const price = parseFloat(nums[0]);
            const rate = parseFloat(nums[1]);
            const gst = (rate/100) * price;
            return `🏷️ **GST:**
Price: ₹${price}
Rate: ${rate}%
GST: ₹${gst.toFixed(2)}
Total: ₹${(price + gst).toFixed(2)}`;
        } catch(e) { return null; }
    }

    // ==========================================
    // PROFIT/LOSS
    // ==========================================
    calculateProfitLoss(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) return null;
        const ql = q.toLowerCase();
        if (!ql.includes('profit') && !ql.includes('loss')) return null;
        try {
            const cp = parseFloat(nums[0]);
            const sp = parseFloat(nums[1]);
            if (sp > cp) {
                const p = sp - cp;
                return `💰 **Profit:**
CP: ₹${cp}, SP: ₹${sp}
Profit: ₹${p}
Profit%: ${((p/cp)*100).toFixed(2)}%`;
            } else if (cp > sp) {
                const l = cp - sp;
                return `💸 **Loss:**
CP: ₹${cp}, SP: ₹${sp}
Loss: ₹${l}
Loss%: ${((l/cp)*100).toFixed(2)}%`;
            } else {
                return `🤝 No Profit No Loss: CP = SP = ₹${cp}`;
            }
        } catch(e) { return null; }
    }

    // ==========================================
    // ACCOUNTS
    // ==========================================
    getAccounts(q) {
        const ql = q.toLowerCase();
        if (ql.includes('balance sheet')) {
            return `
📊 **BALANCE SHEET:**
━━━━━━━━━━━━━━━━━━━━━━━
LIABILITIES      | ASSETS
━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━
Capital          | Fixed Assets
+ Net Profit     | - Land/Building
- Drawings       | - Furniture
Creditors        | - Machinery
Bills Payable    | Current Assets
Bank Loan        | - Cash
                 | - Bank
                 | - Debtors
                 | - Stock
━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━
Total            | Total

📝 Assets = Liabilities + Capital`;
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
        return null;
    }

    // ==========================================
    // SPACE
    // ==========================================
    getSpace(q) {
        const ql = q.toLowerCase();
        const planets = {
            mercury: '🪐 बुध: सबसे छोटा, 0 चाँद, -180°C से 430°C',
            venus: '🪐 शुक्र: सबसे गर्म, 0 चाँद, 462°C, उल्टा घूमता है',
            earth: '🪐 पृथ्वी: एकमात्र जीवन, 1 चाँद, 15°C औसत',
            mars: '🪐 मंगल: लाल ग्रह, 2 चाँद, सबसे बड़ा ज्वालामुखी',
            jupiter: '🪐 बृहस्पति: सबसे बड़ा, 95 चाँद, Great Red Spot',
            saturn: '🪐 शनि: छल्ले, 146 चाँद, पानी पर तैर सकता है',
            uranus: '🪐 यूरेनस: करवट घूमता है, 27 चाँद, -197°C',
            neptune: '🪐 नेपच्यून: सबसे तेज़ हवाएँ, 16 चाँद, -201°C'
        };
        for (const p of Object.keys(planets)) {
            if (ql.includes(p)) return planets[p];
        }
        if (ql.includes('sun')) return "☀️ सूरज: G-type star, 1,391,000 km व्यास, 5,500°C सतह";
        if (ql.includes('black hole') || ql.includes('ब्लैक होल')) return "🕳️ ब्लैक होल: गुरुत्वाकर्षण इतना तेज़ कि रोशनी भी नहीं निकल सकती!";
        if (ql.includes('galaxy') || ql.includes('milky')) return "🌌 आकाशगंगा: Spiral galaxy, 100,000 light-years";
        return null;
    }

    // ==========================================
    // FOOD
    // ==========================================
    getFood(q) {
        const ql = q.toLowerCase();
        const foods = {
            moong: '🌾 मूंग दाल: 24g प्रोटीन, 340 cal, Benefits: पाचन, वजन घटाना',
            masoor: '🌾 मसूर दाल: 25g प्रोटीन, 350 cal, Benefits: एनीमिया, दिल',
            chana: '🌾 चना दाल: 20g प्रोटीन, 370 cal, Benefits: डायबिटीज, दिल',
            urad: '🌾 उड़द दाल: 25g प्रोटीन, 350 cal, Benefits: एनर्जी, स्किन',
            rajma: '🌾 राजमा: 24g प्रोटीन, 330 cal, Benefits: दिल, वजन',
            apple: '🍎 सेब: 52 cal, Benefits: दिल, पाचन, स्किन, Season: Sep-Nov',
            banana: '🍌 केला: 89 cal, Benefits: एनर्जी, दिल, हड्डियाँ',
            mango: '🥭 आम: 60 cal, Benefits: इम्युनिटी, आँखें, स्किन',
            orange: '🍊 संतरा: 47 cal, Benefits: इम्युनिटी, स्किन, दिल',
            ragi: '🌾 रागी: 10g प्रोटीन, 350 cal, Benefits: कैल्शियम, हड्डियाँ',
            almond: '🥜 बादाम: 579 cal, Benefits: दिमाग, दिल, स्किन',
            spinach: '🥬 पालक: 23 cal, Benefits: हड्डियाँ, खून, आँखें'
        };
        for (const f of Object.keys(foods)) {
            if (ql.includes(f)) return foods[f];
        }
        return null;
    }

    // ==========================================
    // CODING
    // ==========================================
    getCoding(q) {
        const ql = q.toLowerCase();
        if (ql.includes('function')) {
            return `💻 **Python Function:**
def add(a, b):
    return a + b
print(add(5,3))  # 8`;
        }
        if (ql.includes('class')) {
            return `💻 **Python Class:**
class Person:
    def __init__(self, name):
        self.name = name
    def greet(self):
        return f"Hello, {self.name}!"
p = Person("Himo")
print(p.greet())`;
        }
        return null;
    }

    // ==========================================
    // GEOMETRY
    // ==========================================
    getGeometry(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums) return null;
        const n = nums.map(Number);
        const ql = q.toLowerCase();

        try {
            if (ql.includes('circle') && n.length >= 1) {
                const r = n[0];
                return `📐 **Circle (Radius ${r}):**
Area = πr² = ${(Math.PI * r * r).toFixed(2)}
Circumference = 2πr = ${(2 * Math.PI * r).toFixed(2)}
Diameter = 2r = ${2 * r}`;
            }
            if (ql.includes('rectangle') && n.length >= 2) {
                const [l, b] = [n[0], n[1]];
                return `📐 **Rectangle (${l} × ${b}):**
Area = l×b = ${l * b}
Perimeter = 2(l+b) = ${2 * (l + b)}
Diagonal = √(l²+b²) = ${Math.sqrt(l*l + b*b).toFixed(2)}`;
            }
            if (ql.includes('square') && n.length >= 1) {
                const s = n[0];
                return `📐 **Square (Side ${s}):**
Area = s² = ${s * s}
Perimeter = 4s = ${4 * s}
Diagonal = s√2 = ${(s * Math.sqrt(2)).toFixed(2)}`;
            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // MAIN PROCESS - ANYTHING!
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "🤔 कुछ तो लिखो!";

        // Exit
        if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit' || q.toLowerCase() === 'bye') {
            return "👋 अलविदा! बहुत अच्छा लगा आपसे बात करके! फिर मिलेंगे!";
        }

        // HELP
        if (q.toLowerCase() === 'help') {
            return this.getHelp();
        }

        // 1. Conversation (Hindi + English)
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

        // 5. Accounts
        const acc = this.getAccounts(q);
        if (acc) return acc;

        // 6. Geometry
        const geo = this.getGeometry(q);
        if (geo) return geo;

        // 7. Space
        const space = this.getSpace(q);
        if (space) return space;

        // 8. Food
        const food = this.getFood(q);
        if (food) return food;

        // 9. Coding
        const coding = this.getCoding(q);
        if (coding) return coding;

        // 10. Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|mausam|मौसम|तापमान|नमी|बारिश|मानसून|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune|दिल्ली|मुंबई|चेन्नई|कोलकाता|बेंगलुरु|हैदराबाद|जयपुर|पुणे/i)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|mausam|मौसम|तापमान|नमी|बारिश|मानसून|in|of|for|ka|ki|ke|mein|का|की|के|में/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // 11. Wikipedia
        if (q.length > 2 && !q.match(/[\d+\-*/%]/)) {
            const wiki = await this.wikipediaSearch(q);
            if (wiki && wiki.length > 50) {
                return `📚 **${q}**\n\n${wiki.substring(0, 1500)}...`;
            }
        }

        // 12. Google Search
        const search = await this.googleSearch(q);
        if (search) {
            return `🔍 **Search Results for "${q}"**\n\n${search.substring(0, 2000)}`;
        }

        // 13. Final - Smart Response
        return `🤔 मुझे "${q}" के बारे में जानकारी नहीं मिली।

💡 ऐसे पूछें:
• "${q} kya hai?"
• "Meaning of ${q}"
• "Explain ${q} to me"
• "Tell me about ${q}"

🌐 मैं इंटरनेट से कनेक्टेड हूँ! कुछ और पूछो!`;
    }

    getHelp() {
        return `
📚 **HIMO AI - HELP**
━━━━━━━━━━━━━━━━━━━━

🌐 **ANY QUESTION - ANY TIME!**

📋 **EXAMPLES:**

🎯 General: "Hi", "How are you?", "Tell me a joke"
🌤️ Weather: "Weather in Delhi", "मुंबई का मौसम"
🧮 Maths: "25% of 200", "2+2"
📊 Accounts: "GST 1000 18", "Balance sheet"
🌌 Space: "What is Mars?", "ब्लैक होल"
💻 Coding: "Python function"
🍽️ Food: "Moong Dal", "सेब"
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

const himo = new HimoAI();

async function ask() {
    rl.question("\nYou: ", async (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log("\nHimo: 👋 अलविदा! बहुत अच्छा लगा आपसे बात करके!");
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
