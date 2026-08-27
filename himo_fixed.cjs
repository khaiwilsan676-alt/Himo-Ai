const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("HIMO AI - FIXED VERSION");
        console.log("=".repeat(60));
        console.log(`
ANY QUESTION - ANY WAY!
"Human" = "Human kya hai" = "hunan kon hau" = SAME ANSWER!
`);                                                                                      
        console.log("=".repeat(60));
        console.log("Type 'exit' to quit\n");
    }

    // ==========================================
    // KNOWLEDGE BASE - MASTER LIST
    // ==========================================
    getKnowledge(topic) {
        const knowledge = {
            'human': `Human beings are the most advanced species on Earth!

Humans are bipedal primates with large brains, enabling complex language, culture, and technology.

Key Features:
- Bipedalism (walk on two legs)
- Large, complex brain
- Opposable thumbs
- Ability to create and use tools
- Complex language and communication
- Self-awareness and consciousness

Humans live in complex social structures - families, communities, nations. They have created science, philosophy, art, music, religion, and technology.

Humans are curious and always seek to understand the world around them. They have explored Earth, traveled to space, and continue to push the boundaries of knowledge.

Brain: Humans have a highly developed prefrontal cortex, responsible for decision-making, planning, and social behavior.

Fun Fact: Humans share about 98.8% of DNA with chimpanzees!`,

            'earth': `Earth is the third planet from the Sun and the only known planet to support life!

Basic Facts:
- Diameter: 12,742 km
- Distance from Sun: 149.6 million km (1 AU)
- Age: 4.54 billion years
- Surface: 71% water, 29% land
- Atmosphere: 78% Nitrogen, 21% Oxygen

Earth is the only known planet with liquid water on its surface, which is essential for life as we know it.

The planet has a magnetic field that protects it from solar radiation. Earth's tilt (23.5 degrees) causes seasons.

Earth has one natural satellite - the Moon.

Fun Fact: Earth is the only planet not named after a Greek or Roman god!`,

            'sun': `The Sun is a G-type main-sequence star at the center of our solar system.

Basic Facts:
- Diameter: 1,391,000 km (109x Earth)
- Mass: 333,000x Earth
- Surface Temperature: 5,500C
- Core Temperature: 15,000,000C
- Age: 4.6 billion years

The Sun is primarily composed of hydrogen (73%) and helium (25%). It converts hydrogen into helium through nuclear fusion, releasing enormous amounts of energy.

This energy is essential for all life on Earth - it provides light, heat, and drives the climate.

Fun Fact: 1.3 million Earths could fit inside the Sun!`,

            'moon': `The Moon is Earth's only natural satellite.

Basic Facts:
- Diameter: 3,474 km (1/4 of Earth)
- Distance from Earth: 384,400 km
- Orbital Period: 27.3 days
- Surface Temperature: -233C to 123C

The Moon is the fifth largest moon in the solar system. It has no atmosphere and no liquid water.

The Moon orbits Earth in synchronous rotation - meaning the same side always faces Earth.

Fun Fact: Humans have visited the Moon six times between 1969 and 1972 (Apollo missions).`,

            'black hole': `A black hole is a region in space where gravity is so strong that nothing - not even light - can escape.

Black holes form when massive stars collapse at the end of their lives.

Parts:
- Singularity: Center with infinite density
- Event Horizon: Point of no return
- Accretion Disk: Spinning matter around the black hole

Types:
- Stellar: 3-20 solar masses
- Intermediate: 100-100,000 solar masses
- Supermassive: Millions to billions of solar masses

Famous Black Holes:
- Sagittarius A*: Center of our Milky Way (4.3 million solar masses)
- M87*: First black hole ever photographed (6.5 billion solar masses)

Fun Fact: If you fell into a black hole, you'd experience "spaghettification" - stretched like spaghetti!`,

            'mars': `Mars is the fourth planet from the Sun, known as the "Red Planet."

Basic Facts:
- Diameter: 6,779 km
- Distance from Sun: 227.9 million km (1.52 AU)
- Orbital Period: 687 Earth days
- Rotation Period: 24.6 hours (similar to Earth)
- Surface Temperature: -87C to -5C
- Moons: 2 (Phobos and Deimos)

Features:
- Olympus Mons: Largest volcano in solar system (21.9 km tall)
- Valles Marineris: Largest canyon in solar system
- Evidence of ancient water flow

Why Red: Iron oxide (rust) on its surface.

Future: NASA plans to send humans to Mars in the 2030s.`,

            'gst': `GST (Goods and Services Tax) is a comprehensive indirect tax in India.

GST Slabs:
- 0%: Essential items (milk, eggs, vegetables)
- 5%: Basic essentials (edible oils, tea, spices)
- 12%: Standard goods (butter, packaged food)
- 18%: Luxury goods (electronics, ACs)
- 28%: Highest luxury (cars, tobacco)

Formula:
GST Amount = (Rate% * Price) / 100
Total = Price + GST Amount

Example: 1000 product with 18% GST
GST = (18 * 1000) / 100 = 180
Total = 1000 + 180 = 1180

Types:
- CGST: Central GST
- SGST: State GST
- IGST: Integrated GST (interstate)`,

            'profit': `Profit is the financial gain when selling something for more than what you paid.

Formula:
Profit = Selling Price (SP) - Cost Price (CP)
Profit% = (Profit / CP) * 100

Example:
CP = 500, SP = 700
Profit = 700 - 500 = 200
Profit% = (200/500) * 100 = 40%

Types of Profit:
- Gross Profit: Revenue - Cost of Goods Sold
- Net Profit: Gross Profit - All other expenses

Loss: When SP < CP
Loss = CP - SP
Loss% = (Loss / CP) * 100`,

            'balance sheet': `A Balance Sheet shows a company's financial position at a specific point in time.

Format:
LIABILITIES          | ASSETS
---------------------|----------------
Capital              | Fixed Assets
+ Net Profit         | - Land/Building
- Drawings           | - Furniture
Creditors            | - Machinery
Bills Payable        | Current Assets
Bank Loan            | - Cash
                     | - Bank
                     | - Debtors
                     | - Stock
---------------------|----------------
Total                | Total

Rule: Assets = Liabilities + Capital (Always balanced!)`,

            'journal': `Journal Entries record financial transactions in chronological order.

Examples:
1. Cash Sales: Cash A/c Dr -> Sales A/c Cr
2. Credit Purchase: Purchase A/c Dr -> Creditor A/c Cr
3. Payment: Creditor A/c Dr -> Cash A/c Cr
4. Salary: Salary A/c Dr -> Cash A/c Cr

Golden Rules:
- Personal: Debit receiver, Credit giver
- Real: Debit what comes in, Credit what goes out
- Nominal: Debit expenses, Credit incomes`
        };

        // Check if any topic matches the query
        for (const [key, value] of Object.entries(knowledge)) {
            if (topic.toLowerCase().includes(key) || key.includes(topic.toLowerCase())) {
                return value;
            }
        }
        return null;
    }

    // ==========================================
    // EXTRACT TOPIC FROM QUESTION
    // ==========================================
    extractTopic(q) {
        const ql = q.toLowerCase();
        
        // Remove question words
        let topic = ql.replace(/what is|what are|what's|who is|who are|who's|why is|why are|how is|how are|where is|where are|when is|when are|which is|which are|explain|define|meaning of|meaning|tell me about|information about|about|kya hai|kyu hai|kaise hai|kaun hai|kon hai|kya hain|kyu hain|kaise hain|kaun hain|kon hain|कोन है|कौन है|क्या है|क्यों है|कैसे है|hunan kon hau/i, '').trim();
        
        // If topic is empty, try to find a known word
        if (!topic || topic.length < 2) {
            const words = ql.split(' ');
            for (const word of words) {
                if (word.length > 2) {
                    topic = word;
                    break;
                }
            }
        }
        
        return topic;
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
            return "I'm doing great! Full of energy and ready to help you!";
        }

        if (ql.match(/what is your name|who are you|your name|tell me about yourself|tu kon hai|kaun ho tum|hunan kon hau/i)) {
            return "I'm Himo AI - your intelligent assistant! I can help with anything!";
        }

        if (ql.match(/thank|thanks|thank you|thx|dhanyawad|shukriya/i)) {
            return "You're welcome! Always happy to help!";
        }

        if (ql.match(/bye|goodbye|see you|later|exit|quit|alvida|tata/i)) {
            return "Goodbye! It was great talking to you! Come back anytime!";
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
    // MAIN PROCESS - SMART!
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "Please type something!";

        if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit' || q.toLowerCase() === 'bye') {
            return "Goodbye! It was great talking to you!";
        }

        // 1. Check Conversation
        const conv = this.getConversation(q);
        if (conv) return conv;

        // 2. Check Math
        const math = this.solveMath(q);
        if (math) return math;

        // 3. Check Knowledge Base (Smart extract)
        const topic = this.extractTopic(q);
        if (topic && topic.length > 2) {
            const knowledge = this.getKnowledge(topic);
            if (knowledge) return knowledge;
        }

        // 4. Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune/)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|in|of|for/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // 5. Wikipedia
        if (q.length > 3 && !q.match(/[\d+\-*/%]/)) {
            const wiki = await this.wikipediaSearch(q);
            if (wiki && wiki.length > 50) {
                return wiki.substring(0, 2000);
            }
        }

        // 6. Google Search
        const search = await this.googleSearch(q);
        if (search) {
            return search.substring(0, 2000);
        }

        // 7. Fallback
        return `I don't have information about "${q}" right now.

Try asking differently:
- What is ${q}?
- Tell me about ${q}
- Explain ${q}
- ${q} meaning`;
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
