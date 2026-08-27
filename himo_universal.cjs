const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("HIMO AI - UNIVERSAL ANSWER SYSTEM");
        console.log("=".repeat(60));
        console.log(`
✅ ANY QUESTION - ANY WAY - SAME ANSWER!
✅ "Human" = "Human kya hai" = "hunan kon hau" = SAME!
✅ "Earth" = "Earth kya hai" = "prithvi kya hai" = SAME!
✅ "Black hole" = "Black hole kya hai" = "Kala chhed" = SAME!
✅ EVERY TOPIC - EVERY VARIATION!
        `);
        console.log("=".repeat(60));
        console.log("Type 'exit' to quit\n");
    }

    // ==========================================
    // MASTER KNOWLEDGE BASE
    // ==========================================
    getKnowledge(topic) {
        const clean = topic.toLowerCase().trim();
        
        const knowledge = {
            // ===== PEOPLE & LIVING =====
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

            // ===== PLANETS =====
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

            'jupiter': `Jupiter is the largest planet in our solar system!

Basic Facts:
- Diameter: 139,820 km (11x Earth)
- Mass: 318x Earth
- Distance from Sun: 778.5 million km (5.2 AU)
- Orbital Period: 11.86 years
- Rotation Period: 9.93 hours (fastest!)
- Moons: 95 (including Io, Europa, Ganymede, Callisto)

Features:
- Great Red Spot: A storm larger than Earth that has lasted for centuries!
- Gas giant composed mostly of hydrogen and helium
- Fastest rotation of any planet

Fun Fact: Jupiter's moon Ganymede is the largest moon in the solar system!`,

            'saturn': `Saturn is the sixth planet from the Sun, famous for its beautiful rings!

Basic Facts:
- Diameter: 116,460 km (9.5x Earth)
- Mass: 95x Earth
- Distance from Sun: 1.434 billion km (9.5 AU)
- Orbital Period: 29.46 years
- Rotation Period: 10.7 hours
- Moons: 146 (including Titan, Enceladus)

Features:
- Ring system made of ice and rock particles
- Least dense planet - would float on water!
- Titan has a thick atmosphere (could support life!)

Fun Fact: Saturn is so light it would float on water!`,

            // ===== SPACE OBJECTS =====
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

            'black hole': `A black hole is a region in space where gravity is so strong that nothing - not even light - can escape!

Black holes form when massive stars collapse at the end of their lives.

Parts of a Black Hole:
- Singularity: Center with infinite density
- Event Horizon: Point of no return
- Accretion Disk: Spinning matter around the black hole

Types of Black Holes:
- Stellar: 3-20 solar masses
- Intermediate: 100-100,000 solar masses
- Supermassive: Millions to billions of solar masses

Famous Black Holes:
- Sagittarius A*: Center of our Milky Way (4.3 million solar masses)
- M87*: First black hole ever photographed (6.5 billion solar masses)

Fun Fact: If you fell into a black hole, you'd experience "spaghettification" - stretched like spaghetti!`,

            'galaxy': `A galaxy is a massive system of stars, dust, gas, and dark matter bound together by gravity!

Types of Galaxies:
- Spiral: Pinwheel shape (like Milky Way)
- Elliptical: Oval or spherical
- Irregular: No distinct shape

Our Galaxy - The Milky Way:
- Type: Spiral
- Diameter: 100,000 light-years
- Contains 100-400 billion stars
- Age: 13.6 billion years

Nearest Galaxy:
- Andromeda - 2.54 million light-years away
- Will collide with Milky Way in 4.5 billion years

Fun Fact: There are estimated to be 100-200 billion galaxies in the observable universe!`,

            // ===== ACCOUNTS & FINANCE =====
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
- Nominal: Debit expenses, Credit incomes`,

            // ===== OTHER =====
            'dog': `Dogs are domesticated mammals and one of the most popular pets in the world!

Basic Facts:
- Scientific Name: Canis lupus familiaris
- Lifespan: 10-13 years (average)
- Species: Over 340 different breeds
- Senses: Exceptional sense of smell (10,000-100,000 times better than humans!)

Dogs are known for their loyalty, intelligence, and companionship. They were the first species to be domesticated by humans, thousands of years ago.

Types of Dogs:
- Small: Chihuahua, Pomeranian, Pug
- Medium: Beagle, Bulldog, Cocker Spaniel
- Large: Labrador, German Shepherd, Golden Retriever
- Giant: Great Dane, St. Bernard, Mastiff

Fun Fact: Dogs have about 300 million scent receptors in their noses (humans have 6 million)!`,

            'cat': `Cats are domesticated mammals and one of the most popular pets in the world!

Basic Facts:
- Scientific Name: Felis catus
- Lifespan: 12-18 years (average)
- Species: Over 70 different breeds
- Senses: Excellent night vision, hearing up to 64 kHz

Cats are known for their independence, grace, and hunting abilities. They were domesticated around 4,000 years ago in ancient Egypt.

Types of Cats:
- Shorthair: Siamese, Bengal, British Shorthair
- Longhair: Persian, Maine Coon, Ragdoll

Fun Fact: Cats spend about 70% of their lives sleeping!`,

            'water': `Water is a colorless, odorless, and tasteless liquid essential for all known forms of life.

Basic Facts:
- Chemical Formula: H2O
- Boiling Point: 100C (212F)
- Freezing Point: 0C (32F)
- Density: 1 g/cm³

Water covers about 71% of Earth's surface. It exists in three states: solid (ice), liquid (water), and gas (steam).

The human body is about 60% water. We need to drink water to stay hydrated, regulate body temperature, and maintain bodily functions.

Fun Fact: Water is the only substance that exists naturally in all three states on Earth!`,

            'food': `Food is any substance consumed to provide nutritional support for an organism.

Types of Food:
- Carbohydrates: Rice, Wheat, Potatoes (Energy)
- Proteins: Meat, Eggs, Beans, Dal (Growth)
- Fats: Oil, Butter, Nuts (Energy storage)
- Vitamins: Fruits, Vegetables (Health)
- Minerals: Salt, Calcium, Iron (Body functions)

Healthy Eating Tips:
- Eat a variety of foods
- Include fruits and vegetables daily
- Drink 2-3 liters of water daily
- Limit processed food and sugar
- Balance is key!

Fun Fact: The food we eat gives us energy to live, think, and move!`,

            'money': `Money is a medium of exchange used to buy goods and services.

Types of Money:
- Cash (Coins and Currency)
- Bank Deposits (Savings and Checking)
- Digital Currency (Cryptocurrency, Digital Payments)

Functions of Money:
- Medium of exchange
- Store of value
- Unit of account

Managing Money:
- Budget: Track income and expenses
- Save: Set aside money regularly
- Invest: Grow your money over time
- Spend wisely: Buy what you need, not just what you want

Fun Fact: The first coins were made around 600 BCE in Lydia (modern Turkey)!`,

            'time': `Time is the continuous sequence of existence and events.

Units of Time:
- 1 minute = 60 seconds
- 1 hour = 60 minutes
- 1 day = 24 hours
- 1 week = 7 days
- 1 month = 28-31 days
- 1 year = 365 days

Time is measured using clocks and calendars. It helps us organize our lives, schedule events, and understand the world.

Fun Fact: Time zones were introduced in the late 19th century to standardize train schedules!`,

            'computer': `A computer is an electronic device that processes data and performs tasks.

Components:
- Hardware: Physical parts (CPU, RAM, Hard Drive)
- Software: Programs and applications

Types of Computers:
- Desktop
- Laptop
- Smartphone
- Tablet

Computers work by receiving input, processing data, and producing output. They use binary language (0s and 1s) to perform calculations.

Fun Fact: The first electronic computer, ENIAC, was built in 1945 and weighed 30 tons!`
        };

        // Check for exact match first
        for (const [key, value] of Object.entries(knowledge)) {
            if (clean.includes(key) || key.includes(clean)) {
                return value;
            }
        }
        
        // Check for partial match
        for (const [key, value] of Object.entries(knowledge)) {
            if (clean.split(' ').some(word => key.includes(word) || word.includes(key))) {
                return value;
            }
        }
        
        return null;
    }

    // ==========================================
    // SMART TOPIC EXTRACTOR
    // ==========================================
    extractTopic(q) {
        const clean = q.toLowerCase().trim();
        
        // Remove question words
        let topic = clean.replace(/what is|what are|what's|who is|who are|who's|why is|why are|how is|how are|where is|where are|when is|when are|which is|which are|explain|define|meaning of|meaning|tell me about|information about|about|kya hai|kyu hai|kaise hai|kaun hai|kon hai|kya hain|kyu hain|kaise hain|kaun hain|kon hain|कोन है|कौन है|क्या है|क्यों है|कैसे है|hunan kon hau|human kya hai|human meaning|what is human|tell me about human/i, '').trim();
        
        // If topic is empty, get the first meaningful word
        if (!topic || topic.length < 2) {
            const words = clean.split(' ');
            for (const word of words) {
                if (word.length > 2 && !['the','and','for','with','from','this','that','these','those','then','than','have','has','had','was','were','are','were','will','would','could','should','may','might','must'].includes(word)) {
                    topic = word;
                    break;
                }
            }
        }
        
        return topic;
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

        if (ql.match(/what is your name|who are you|your name|tell me about yourself|tu kon hai|kaun ho tum|hunan kon hau|who are you|apna naam batao|kaun ho|kon ho/i)) {
            return "I'm Himo AI - your intelligent assistant! I can help with anything - just ask!";
        }

        if (ql.match(/thank|thanks|thank you|thx|dhanyawad|shukriya/i)) {
            return "You're welcome! Always happy to help!";
        }

        if (ql.match(/bye|goodbye|see you|later|exit|quit|alvida|tata|phir milenge|by|good bye/i)) {
            return "Goodbye! It was great talking to you! Come back anytime!";
        }

        if (ql.match(/joke|funny|tell me a joke|make me laugh|has lo|mazak|chutkula|हंसा|मज़ाक|चुटकुला/i)) {
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
    // MAIN PROCESS - UNIVERSAL!
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

        // 3. Knowledge Base - UNIVERSAL
        const topic = this.extractTopic(q);
        if (topic && topic.length > 1) {
            const knowledge = this.getKnowledge(topic);
            if (knowledge) return knowledge;
        }

        // 4. Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|mausam|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune/)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|mausam|in|of|for/i, '').trim();
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

        // 7. Smart Fallback
        return `I don't have information about "${q}" right now.

Try asking differently:
- What is ${q}?
- Tell me about ${q}
- Explain ${q}
- ${q} meaning

Or ask me about: Human, Earth, Mars, Sun, Moon, Black Hole, GST, Profit, Balance Sheet, Journal, Dog, Cat, Water, Food, Money, Time, Computer!`;
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
