const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("HIMO AI - COMPLETE VERSION");
        console.log("=".repeat(60));
        console.log(`
ANY QUESTION - ANY TIME!
WEATHER | MATHS | ACCOUNTS | GST | SPACE | CODING
CONVERSATION | JOKES | FACTS | KNOWLEDGE
        `);
        console.log("=".repeat(60));
        console.log("Type 'exit' to quit | 'help' for examples\n");
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
    // CONVERSATION
    // ==========================================
    getConversation(q) {
        const ql = q.toLowerCase();

        if (ql.match(/^(hi|hello|hey|hola|yo|hai|hii|helloo|namaste|नमस्ते)/)) {
            return "Hello! I'm Himo AI. How can I help you today?";
        }

        if (ql.match(/how are you|how's it going|how do you do|what's up|kaisa hai|kya haal/i)) {
            return "I'm doing great! Full of energy and ready to help you! How can I assist you today?";
        }

        if (ql.match(/what is your name|who are you|your name|tell me about yourself|tu kon hai|kaun ho tum/i)) {
            return "I'm Himo AI - your intelligent assistant! I can help with Weather, Maths, Accounts, Space, Coding, Food, Games, and much more!";
        }

        if (ql.match(/what can you do|abilities|skills|help me|features|kya kar sakte ho/i)) {
            return `Here's what I can do:
Weather (Live)
Maths (Arithmetic, Geometry)
Accounts (GST, Balance Sheet, Journal)
Profit/Loss calculations
Space & Science (Planets, Black Holes)
Coding help (Python, JavaScript)
Food & Nutrition
Games & Sports
Jokes & Fun Facts
General Knowledge
Internet Search

Just ask me anything!`;
        }

        if (ql.match(/i love you|love you|i like you|i hate you|pyaar|love/i)) {
            return "That's very kind of you! I appreciate it! I'm here to help you always!";
        }

        if (ql.match(/joke|funny|tell me a joke|make me laugh|has lo|mazak|chutkula/i)) {
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "What do you call a fake noodle? An impasta!",
                "Why don't scientists trust atoms? Because they make up everything!",
                "What did the ocean say to the beach? Nothing, it just waved!",
                "Why did the scarecrow win an award? Because he was outstanding in his field!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        if (ql.match(/fact|did you know|interesting|tell me something|fun fact|rochak|jankari/i)) {
            const facts = [
                "The human brain can store about 2.5 petabytes of information!",
                "Earth is about 4.54 billion years old!",
                "Saturn is so light it would float on water!",
                "1.3 million Earths can fit inside the Sun!",
                "Octopuses have 3 hearts and blue blood!"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        if (ql.match(/thank|thanks|thank you|thx|dhanyawad|shukriya/i)) {
            return "You're welcome! Always happy to help!";
        }

        if (ql.match(/bye|goodbye|see you|later|exit|quit|alvida|tata/i)) {
            return "Goodbye! It was great talking to you! Come back anytime!";
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
                return `${nums[0]} × ${nums[1]} = ${parseFloat(nums[0]) * parseFloat(nums[1])}`;
            }
            if ((q.includes('/') || q.includes('÷')) && nums.length >= 2) {
                if (parseFloat(nums[1]) === 0) return "Cannot divide by zero!";
                return `${nums[0]} ÷ ${nums[1]} = ${parseFloat(nums[0]) / parseFloat(nums[1])}`;
            }
            if ((q.includes('%') || q.includes('percent')) && nums.length >= 2) {
                return `${nums[0]}% of ${nums[1]} = ${(parseFloat(nums[0])/100) * parseFloat(nums[1])}`;
            }
            if (q.toLowerCase().includes('average') && nums.length > 1) {
                const vals = nums.map(Number);
                return `Average = ${vals.reduce((a,b) => a+b, 0) / vals.length}`;
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
            return `GST:
Price: $${price}
Rate: ${rate}%
GST: $${gst.toFixed(2)}
Total: $${(price + gst).toFixed(2)}`;
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
                return `Profit:
CP: $${cp}, SP: $${sp}
Profit: $${p}
Profit%: ${((p/cp)*100).toFixed(2)}%`;
            } else if (cp > sp) {
                const l = cp - sp;
                return `Loss:
CP: $${cp}, SP: $${sp}
Loss: $${l}
Loss%: ${((l/cp)*100).toFixed(2)}%`;
            } else {
                return `No Profit No Loss: CP = SP = $${cp}`;
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
BALANCE SHEET:
------------------------
LIABILITIES      | ASSETS
-----------------|----------------
Capital          | Fixed Assets
+ Net Profit     | - Land/Building
- Drawings       | - Furniture
Creditors        | - Machinery
Bills Payable    | Current Assets
Bank Loan        | - Cash
                 | - Bank
                 | - Debtors
                 | - Stock
-----------------|----------------
Total            | Total

Assets = Liabilities + Capital`;
        }
        if (ql.includes('journal') || ql.includes('journal entry')) {
            return `
JOURNAL ENTRIES:
1. Cash Sales: Cash A/c Dr -> Sales A/c Cr
2. Credit Purchase: Purchase A/c Dr -> Creditor A/c Cr
3. Payment: Creditor A/c Dr -> Cash A/c Cr
4. Salary: Salary A/c Dr -> Cash A/c Cr

Golden Rules:
Personal: Debit receiver, Credit giver
Real: Debit what comes in, Credit what goes out
Nominal: Debit expenses, Credit incomes`;
        }
        if (ql.includes('gst')) {
            return `GST Guide:
Slabs: 0% | 5% | 12% | 18% | 28%
Formula: GST = (Rate% * Price) / 100
Total = Price + GST`;
        }
        return null;
    }

    // ==========================================
    // SPACE
    // ==========================================
    getSpace(q) {
        const ql = q.toLowerCase();
        const planets = {
            mercury: 'Mercury: Smallest, 0 moons, -180C to 430C',
            venus: 'Venus: Hottest, 0 moons, 462C, Retrograde',
            earth: 'Earth: Only life, 1 moon, 15C avg',
            mars: 'Mars: Red planet, 2 moons, Olympus Mons',
            jupiter: 'Jupiter: Largest, 95 moons, Great Red Spot',
            saturn: 'Saturn: Rings, 146 moons, floats on water',
            uranus: 'Uranus: Side rotation, 27 moons, -197C',
            neptune: 'Neptune: Strongest winds, 16 moons, -201C'
        };
        for (const p of Object.keys(planets)) {
            if (ql.includes(p)) return planets[p];
        }
        if (ql.includes('sun')) return "Sun: G-type star, 1,391,000 km diameter, 5,500C surface";
        if (ql.includes('black hole')) return "Black Hole: Gravity so strong light can't escape!";
        if (ql.includes('galaxy') || ql.includes('milky')) return "Milky Way: Spiral galaxy, 100,000 light-years";
        if (ql.includes('moon')) return "Moon: 3,474 km diameter, 384,400 km from Earth";
        return null;
    }

    // ==========================================
    // CODING
    // ==========================================
    getCoding(q) {
        const ql = q.toLowerCase();
        const errors = {
            'indentation': 'Use 4 spaces consistently',
            'nameerror': 'Define variable before use',
            'typeerror': 'Convert types correctly',
            'valueerror': 'Check input values',
            'indexerror': 'Check list bounds, use len()-1',
            'keyerror': 'Use .get() for dictionaries',
            'syntaxerror': 'Check colons, brackets, quotes'
        };
        for (const e of Object.keys(errors)) {
            if (ql.includes(e)) return errors[e];
        }
        if (ql.includes('function')) {
            return `Python Function:
def add(a, b):
    return a + b
print(add(5,3))  # 8`;
        }
        if (ql.includes('class')) {
            return `Python Class:
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
    // FOOD
    // ==========================================
    getFood(q) {
        const ql = q.toLowerCase();
        const foods = {
            moong: 'Moong Dal: 24g protein, 340 cal, Benefits: Digestion, Weight loss',
            masoor: 'Masoor Dal: 25g protein, 350 cal, Benefits: Anemia, Heart health',
            chana: 'Chana Dal: 20g protein, 370 cal, Benefits: Diabetes, Heart health',
            urad: 'Urad Dal: 25g protein, 350 cal, Benefits: Energy, Skin health',
            rajma: 'Rajma: 24g protein, 330 cal, Benefits: Heart health, Weight loss',
            apple: 'Apple: 52 cal, Benefits: Heart, Digestion, Skin, Season: Sep-Nov',
            banana: 'Banana: 89 cal, Benefits: Energy, Heart, Bones, Season: Year-round',
            mango: 'Mango: 60 cal, Benefits: Immunity, Eyes, Skin, Season: Mar-Jul',
            orange: 'Orange: 47 cal, Benefits: Immunity, Skin, Heart, Season: Oct-Mar',
            wheat: 'Wheat: 13g protein, 330 cal, Benefits: Digestion, Heart health',
            ragi: 'Ragi: 10g protein, 350 cal, Benefits: Calcium rich, Bones',
            oats: 'Oats: 17g protein, 350 cal, Benefits: Cholesterol, Weight loss',
            almond: 'Almond: 579 cal, Benefits: Brain, Heart, Skin',
            spinach: 'Spinach: 23 cal, Benefits: Bones, Blood, Eyes',
            broccoli: 'Broccoli: 34 cal, Benefits: Immunity, Bones, Eyes',
            carrot: 'Carrot: 41 cal, Benefits: Eyes, Skin, Immunity'
        };
        for (const f of Object.keys(foods)) {
            if (ql.includes(f)) return foods[f];
        }
        return null;
    }

    // ==========================================
    // GAMES
    // ==========================================
    getGames(q) {
        const ql = q.toLowerCase();
        const games = {
            cricket: 'Cricket: 11 players, Test/ODI/T20, Rules: Bat-ball, Runs, Wickets',
            football: 'Football: 11 players, 90 min, Rules: Goal scoring, Offside',
            chess: 'Chess: 2 players, Strategy game, Rules: Checkmate, 16 pieces each',
            ludo: 'Ludo: 2-4 players, Roll dice, First to reach home wins'
        };
        for (const g of Object.keys(games)) {
            if (ql.includes(g)) return games[g];
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
                return `Circle (Radius ${r}):
Area = ${(Math.PI * r * r).toFixed(2)}
Circumference = ${(2 * Math.PI * r).toFixed(2)}
Diameter = ${2 * r}`;
            }
            if (ql.includes('rectangle') && n.length >= 2) {
                const [l, b] = [n[0], n[1]];
                return `Rectangle (${l} x ${b}):
Area = ${l * b}
Perimeter = ${2 * (l + b)}
Diagonal = ${Math.sqrt(l*l + b*b).toFixed(2)}`;
            }
            if (ql.includes('square') && n.length >= 1) {
                const s = n[0];
                return `Square (Side ${s}):
Area = ${s * s}
Perimeter = ${4 * s}
Diagonal = ${(s * Math.sqrt(2)).toFixed(2)}`;
            }
            if (ql.includes('triangle') && n.length >= 2) {
                const [b, h] = [n[0], n[1]];
                return `Triangle (Base ${b}, Height ${h}):
Area = ${0.5 * b * h}`;
            }
            if (ql.includes('cube') && n.length >= 1) {
                const s = n[0];
                return `Cube (Side ${s}):
Volume = ${s * s * s}
Surface Area = ${6 * s * s}`;
            }
            if (ql.includes('sphere') && n.length >= 1) {
                const r = n[0];
                return `Sphere (Radius ${r}):
Volume = ${((4/3) * Math.PI * r * r * r).toFixed(2)}
Surface Area = ${(4 * Math.PI * r * r).toFixed(2)}`;
            }
        } catch(e) { return null; }
        return null;
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

        if (q.toLowerCase() === 'help') {
            return this.getHelp();
        }

        const responses = [
            this.getConversation(q),
            this.solveMath(q),
            this.calculateGST(q),
            this.calculateProfitLoss(q),
            this.getAccounts(q),
            this.getGeometry(q),
            this.getSpace(q),
            this.getFood(q),
            this.getGames(q),
            this.getCoding(q)
        ];

        for (const response of responses) {
            if (response) return response;
        }

        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune/)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|in|of|for/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        if (q.length > 3 && !q.match(/[\d+\-*/%]/)) {
            const wiki = await this.wikipediaSearch(q);
            if (wiki && wiki.length > 50) {
                return `${q}\n\n${wiki.substring(0, 1500)}...`;
            }
        }

        const search = await this.googleSearch(q);
        if (search) {
            return `Search Results for "${q}":\n\n${search.substring(0, 2000)}`;
        }

        return `I don't have information about "${q}" right now.

Try these:
What is ${q}?
Meaning of ${q}
Explain ${q} to me
Tell me about ${q}`;
    }

    getHelp() {
        return `
HIMO AI - HELP
==============

EXAMPLES:

General: Hi, How are you?, Tell me a joke
Weather: Weather in Delhi, Mumbai temperature
Maths: 25% of 200, 2+2, Average of 10,20,30
Accounts: GST 1000 18, Balance sheet, Journal entries
Profit/Loss: Profit CP=500 SP=700
Space: What is Mars?, Black hole, Sun
Coding: Python function, IndentationError
Food: Moong Dal, Apple nutrition
Games: Cricket, Football, Chess`;
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

        console.log("\nHimo: Thinking...");
        const response = await himo.process(input);
        console.log(`\nHimo:\n${response}`);
        ask();
    });
}

ask();
