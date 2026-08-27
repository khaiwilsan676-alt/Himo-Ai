const readline = require('readline');
const https = require('https');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("🤖 HIMO AI - CHATGPT LEVEL (FAST + DETAILED)");
        console.log("=".repeat(60));
        console.log(`
✅ FULL DETAILED ANSWERS
✅ "WHAT", "WHY", "HOW" - SAB KA JAWAB!
✅ FAST THINKING - NO DELAY!
✅ INTERNET + OFFLINE BOTH!
        `);
        console.log("=".repeat(60));
        console.log("💡 Type 'exit' to quit | 'help' for examples\n");
    }

    // ==========================================
    // DETAILED RESPONSES - CHATGPT STYLE
    // ==========================================

    getDetailedResponse(q) {
        const ql = q.toLowerCase();

        // ===== GREETINGS =====
        if (ql.match(/^(hi|hello|hey|hola|yo|hai|hii|helloo)/)) {
            return "👋 Hello! I'm Himo AI, your intelligent assistant. I'm here to help you with any question you have - whether it's about science, technology, mathematics, space, food, or anything else! What would you like to know today?";
        }

        // ===== NAME =====
        if (ql.match(/what is your name|who are you|your name|tell me about yourself|tu kon hai|kaun ho tum/i)) {
            return `🤖 **I'm Himo AI - Your Personal Assistant!**

I'm an artificial intelligence built with Node.js, designed to help you with almost anything!

**What I can do:**
🌤️ **Weather** - Live weather updates for any city
🧮 **Maths** - Solve calculations, geometry, algebra
📊 **Accounts** - GST, Balance Sheet, Journal Entries
💰 **Profit/Loss** - Calculate profits, losses, percentages
🌌 **Space** - Planets, black holes, galaxies, stars
💻 **Coding** - Python, JavaScript, debugging, algorithms
🍽️ **Food** - Nutrition, benefits, recipes
🎮 **Games** - Rules, players, history
📚 **Knowledge** - General knowledge, facts, explanations

💡 Just ask me anything - I'll give you a detailed answer!`;
        }

        // ===== HOW ARE YOU =====
        if (ql.match(/how are you|how's it going|how do you do|what's up|kaisa hai|kya haal/i)) {
            return "😊 I'm doing fantastic! Full of energy and ready to help you with any question you have. I've been trained on a vast amount of knowledge, so I can answer almost anything you throw at me. How can I assist you today?";
        }

        // ===== WHAT ARE YOU DOING =====
        if (ql.match(/what are you doing|what are you up to|kya kar rahe ho|kya keraha/i)) {
            return "💻 Right now, I'm actively listening to your questions and processing them to give you the best possible answers. My main goal is to help you learn, solve problems, and explore new topics. So, what's on your mind?";
        }

        // ===== WHAT CAN YOU DO =====
        if (ql.match(/what can you do|abilities|skills|help me|features|kya kar sakte ho/i)) {
            return `🌐 **Here's everything I can do for you:**

📚 **General Knowledge:**
• Answer any question about science, history, geography
• Explain complex concepts in simple words
• Provide definitions and meanings

🌤️ **Weather:**
• Live weather updates for any city
• Temperature, humidity, wind speed
• Rain forecast and monsoon information

🧮 **Mathematics:**
• Basic arithmetic (+, -, ×, ÷)
• Percentages and averages
• Geometry (circles, rectangles, squares, cubes)
• Profit/Loss calculations
• GST calculations

📊 **Accounts & Finance:**
• Balance Sheet format and explanation
• Journal Entries with examples
• GST slabs and calculations
• Financial ratios

🌌 **Space & Science:**
• All planets in our solar system
• Black holes, galaxies, stars
• Sun, Moon, and their properties
• Space missions and discoveries

💻 **Coding:**
• Python, JavaScript, HTML/CSS
• Debugging common errors
• Algorithms (Sorting, Searching)
• Data Structures (Arrays, Stacks, Queues)

🍽️ **Food & Nutrition:**
• Nutritional information (calories, protein)
• Health benefits of different foods
• Seasonal fruits and vegetables

🎮 **Games:**
• Rules of cricket, football, chess
• Famous players and competitions

🎯 **And much more!**

💡 Just ask anything - I'm here to help!`;
        }

        // ===== WHY QUESTIONS =====
        if (ql.match(/why|kyu|kyon|kahe|kisliye/)) {
            return this.getWhyAnswer(q);
        }

        // ===== WHAT IS / WHO IS =====
        if (ql.match(/what is|what are|who is|who are|define|meaning|explain|kya hai|kaun hai/)) {
            return this.getWhatAnswer(q);
        }

        // ===== HOW QUESTIONS =====
        if (ql.match(/how|kaise|kese|kis tarah/)) {
            return this.getHowAnswer(q);
        }

        // ===== LOVE =====
        if (ql.match(/i love you|love you|i like you|i hate you|pyaar|love/i)) {
            return "❤️ Aww, that's so sweet! I really appreciate you saying that. Even though I'm an AI, I'm here to help you, support you, and make your life easier. You're amazing, and I'm honored to assist you! 😊";
        }

        // ===== JOKES =====
        if (ql.match(/joke|funny|tell me a joke|make me laugh|has lo|mazak|chutkula|joak/i)) {
            const jokes = [
                "😂 **Why do programmers prefer dark mode?** Because light attracts bugs! 🐛",
                "🤣 **What do you call a fake noodle?** An impasta! 🍝",
                "😆 **Why don't scientists trust atoms?** Because they make up everything! ⚛️",
                "🤪 **What did the ocean say to the beach?** Nothing, it just waved! 🌊",
                "😄 **Why did the scarecrow win an award?** Because he was outstanding in his field! 🌾",
                "😂 **Why do Java developers wear glasses?** Because they can't see sharp! 👓",
                "🤣 **What's a computer's favorite snack?** Microchips! 💻"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // ===== FACTS =====
        if (ql.match(/fact|did you know|interesting|tell me something|fun fact|rochak|jankari|fact|फैक्ट/i)) {
            const facts = [
                "🧠 **Did you know?** The human brain can store about 2.5 petabytes of information - that's equivalent to 3 million hours of TV shows!",
                "🌍 **Did you know?** Earth is about 4.54 billion years old! That's older than almost everything else in our solar system!",
                "🪐 **Did you know?** Saturn is so light that it would actually float on water! Yes, if you could find a bathtub big enough!",
                "🚀 **Did you know?** About 1.3 million Earths could fit inside the Sun! The Sun is absolutely massive!",
                "🐙 **Did you know?** Octopuses have 3 hearts and blue blood! They're truly fascinating creatures!",
                "📚 **Did you know?** The longest English word has 189,819 letters - it's the chemical name for Titin!",
                "🌌 **Did you know?** There are more stars in the universe than grains of sand on all the beaches on Earth!",
                "🐝 **Did you know?** Honey never spoils! Archaeologists have found 3000-year-old honey that's still edible!"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        // ===== THANKS =====
        if (ql.match(/thank|thanks|thank you|thx|dhanyawad|shukriya/i)) {
            return "😊 You're very welcome! I'm always happy to help. If you have any more questions, just ask! Have a wonderful day! 🌟";
        }

        // ===== BYE =====
        if (ql.match(/bye|goodbye|see you|later|exit|quit|alvida|tata|phir milenge/i)) {
            return "👋 Goodbye! It was truly a pleasure talking to you! If you ever need help again, I'll be right here. Take care and have an amazing day! 😊";
        }

        return null;
    }

    // ==========================================
    // "WHAT IS" HANDLER - DETAILED ANSWER
    // ==========================================
    getWhatAnswer(q) {
        const ql = q.toLowerCase();

        // Remove "what is", "who is", etc.
        let topic = q.replace(/what is|what are|who is|who are|define|meaning of|explain|kya hai|kaun hai/i, '').trim();

        if (!topic || topic.length < 2) {
            return "🤔 Could you please specify what you're asking about? For example: 'What is a black hole?' or 'What is GST?'";
        }

        // Common topics with detailed answers
        const knowledge = {
            'black hole': `🕳️ **What is a Black Hole?**

A black hole is a region in space where gravity is so strong that nothing - not even light - can escape from it!

**How do they form?**
Black holes are formed when massive stars (at least 3 times the mass of our Sun) collapse at the end of their lives. The gravity becomes so intense that it creates a singularity - a point of infinite density.

**Parts of a Black Hole:**
1. **Singularity** - The center where all matter is crushed into infinite density
2. **Event Horizon** - The "point of no return" - once you cross it, you can never escape
3. **Accretion Disk** - Spinning disk of matter around the black hole

**Types of Black Holes:**
• **Stellar Black Holes** - 3-20 solar masses (most common)
• **Intermediate Black Holes** - 100-100,000 solar masses
• **Supermassive Black Holes** - 1 million to 10 billion solar masses (found at galaxy centers)

**Famous Black Holes:**
• **Sagittarius A*** - At the center of our Milky Way galaxy (4.3 million solar masses)
• **M87*** - First black hole ever photographed (2019) - 6.5 billion solar masses
• **TON 618** - Largest known black hole - 66 billion solar masses!

**Fun Fact:** If you fell into a black hole, you'd experience "spaghettification" - you'd be stretched into a long thin shape!`,

            'gst': `🏷️ **What is GST (Goods and Services Tax)?**

GST is a comprehensive indirect tax levied on the supply of goods and services in India. It replaced multiple indirect taxes like VAT, Service Tax, Excise Duty, etc.

**GST Slabs in India:**
• **0%** - Essential items (milk, eggs, fresh vegetables)
• **5%** - Basic essentials (edible oils, tea, spices)
• **12%** - Standard goods (butter, ghee, packaged food)
• **18%** - Luxury goods (electronics, ACs, cars)
• **28%** - Highest luxury (cars, tobacco, aerated drinks)

**GST Formula:**
GST Amount = (GST% × Price) / 100
Total Price = Price + GST Amount

**Example:** If you buy a product for ₹1000 with 18% GST:
GST = (18 × 1000) / 100 = ₹180
Total = ₹1000 + ₹180 = ₹1180

**Types of GST:**
• **CGST** - Central GST (collected by central government)
• **SGST** - State GST (collected by state government)
• **IGST** - Integrated GST (for interstate transactions)

💡 **Note:** GST has made tax collection simpler and more transparent!`,

            'mars': `🪐 **What is Mars?**

Mars is the 4th planet from the Sun and is often called the "Red Planet" because of its reddish appearance!

**Basic Facts:**
• **Diameter:** 6,779 km (about half of Earth)
• **Mass:** 0.11 × Earth
• **Distance from Sun:** 227.9 million km (1.52 AU)
• **Orbital Period:** 687 Earth days
• **Rotation Period:** 24.6 hours (similar to Earth!)
• **Surface Temperature:** -87°C to -5°C
• **Moons:** 2 (Phobos and Deimos)

**Interesting Features:**
• **Olympus Mons** - The largest volcano in the solar system (21.9 km tall!)
• **Valles Marineris** - The largest canyon in the solar system
• **Water Evidence** - Mars has ice caps and evidence of ancient water flow

**Why is it called "Red Planet"?**
The red color comes from iron oxide (rust) on its surface.

**Future Missions:**
• NASA plans to send humans to Mars in the 2030s!
• Currently, rovers like Perseverance are exploring Mars

💡 **Fun Fact:** A day on Mars is called a "sol" and is just slightly longer than an Earth day!`,

            'profit': `💰 **What is Profit?**

Profit is the financial gain you make when you sell something for more than what you paid for it.

**Profit Formula:**
Profit = Selling Price (SP) - Cost Price (CP)

**Profit Percentage Formula:**
Profit% = (Profit / Cost Price) × 100

**Example:**
If you buy something for ₹500 (CP) and sell it for ₹700 (SP):
Profit = 700 - 500 = ₹200
Profit% = (200/500) × 100 = 40%

**Types of Profit:**
• **Gross Profit** - Revenue minus cost of goods sold
• **Net Profit** - Gross profit minus all other expenses

**Loss:** If you sell for less than you bought, that's a loss.

**Loss Formula:**
Loss = Cost Price - Selling Price
Loss% = (Loss / CP) × 100

💡 **Tip:** Profit is good for business - it shows you're making money!`
        };

        // Check if topic matches any known knowledge
        for (const [key, value] of Object.entries(knowledge)) {
            if (ql.includes(key) || topic.includes(key)) {
                return value;
            }
        }

        // If we have internet, try Wikipedia
        return null;
    }

    // ==========================================
    // "WHY" HANDLER - DETAILED ANSWER
    // ==========================================
    getWhyAnswer(q) {
        const ql = q.toLowerCase();

        if (ql.includes('sky') && ql.includes('blue')) {
            return `💙 **Why is the sky blue?**

The sky appears blue because of a phenomenon called **Rayleigh Scattering**!

**How it works:**
1. Sunlight contains all colors of the rainbow (ROYGBIV)
2. When sunlight enters Earth's atmosphere, it collides with air molecules
3. Blue light has shorter wavelengths and is scattered more than other colors
4. Our eyes are more sensitive to blue light
5. So we see the sky as blue!

**Why isn't it purple?**
• The sun emits more blue light than violet light
• Our eyes are more sensitive to blue than violet

**Why is it red/orange at sunset?**
• When the sun is low on the horizon, sunlight travels through more atmosphere
• More scattering removes blue light
• Red and orange light reaches our eyes

💡 **Fun Fact:** On Mars, the sky appears red during the day and blue at sunset!
On the Moon, there's no atmosphere, so the sky is always black!`
        }

        if (ql.includes('water') && ql.includes('wet')) {
            return `💧 **Why is water wet?**

Water is wet because of **cohesion** and **adhesion**!

**Cohesion:** Water molecules stick to each other because of hydrogen bonds. This is why water forms droplets.

**Adhesion:** Water molecules stick to other surfaces - like your skin, clothes, or glass.

**Why it feels wet:**
1. When water touches your skin, it adheres to it
2. This creates a layer of water on your skin
3. Your brain interprets this feeling as "wetness"

**What makes it unique:**
• Water is one of the few substances that exists naturally in three states: solid (ice), liquid (water), and gas (steam)
• It's called the "universal solvent" because it dissolves more substances than any other liquid

💡 **Fun Fact:** Water is the only substance on Earth that is naturally found in all three states!`
        }

        if (ql.includes('ice') && ql.includes('float')) {
            return `🧊 **Why does ice float on water?**

Ice floats because it's **less dense** than liquid water!

**The Science:**
1. When water freezes, its molecules arrange in a crystalline structure
2. This structure takes up more space than liquid water
3. So ice has a lower density (0.92 g/cm³) than water (1.0 g/cm³)
4. Things that are less dense float on denser liquids

**Why is this important?**
• If ice sank, oceans would freeze from the bottom up
• Marine life wouldn't survive
• Ice floating on top insulates the water below, keeping it liquid

💡 **Fun Fact:** Most substances become denser when they freeze - water is one of the few exceptions!`
        }

        if (ql.includes('sky') && ql.includes('black') && ql.includes('night')) {
            return `🌃 **Why is the sky black at night?**

The sky is black at night because there's no direct sunlight!

**The Science:**
1. During the day, sunlight scatters off air molecules, making the sky blue
2. At night, the sun is on the other side of Earth
3. No sunlight reaches the atmosphere above you
4. So you see the darkness of space

**Why can we see stars?**
• Stars emit their own light
• They're so far away they appear as tiny points of light
• The black background makes them visible

💡 **Fun Fact:** If you were on the Moon, the sky would be black all the time - even during the day!`
        }

        if (ql.includes('rainbow')) {
            return `🌈 **Why do rainbows appear after rain?**

Rainbows form when sunlight interacts with water droplets in the atmosphere!

**The Science:**
1. After rain, water droplets remain in the air
2. Sunlight enters each droplet
3. The droplet acts like a prism, splitting light into different colors
4. Each color bends at a different angle
5. You see a beautiful arc of colors

**The colors (ROYGBIV):**
• Red (outermost)
• Orange
• Yellow
• Green
• Blue
• Indigo
• Violet (innermost)

💡 **Fun Fact:** You can never reach the end of a rainbow - it's an optical illusion!`
        }

        if (ql.includes('earth') && ql.includes('round')) {
            return `🌍 **Why is the Earth round?**

Earth is round because of **gravity**!

**The Science:**
1. When Earth formed 4.5 billion years ago, it was a ball of hot, molten rock
2. Gravity pulled all the material equally toward the center
3. This created a spherical shape
4. The same reason all large celestial bodies (planets, stars) are round

**Why isn't it a perfect sphere?**
• Earth bulges at the equator due to its rotation
• So it's actually an "oblate spheroid" - slightly flattened at the poles

💡 **Fun Fact:** Earth's circumference is about 40,075 km at the equator!`
        }

        return null;
    }

    // ==========================================
    // "HOW" HANDLER - DETAILED ANSWER
    // ==========================================
    getHowAnswer(q) {
        const ql = q.toLowerCase();

        if (ql.includes('learn') && ql.includes('coding')) {
            return `💻 **How to learn coding?**

Here's a step-by-step guide to learn coding:

**Step 1: Choose a Language**
• **Python** - Best for beginners (easy syntax, versatile)
• **JavaScript** - For web development
• **Java** - For enterprise applications

**Step 2: Learn the Basics**
• Variables, Data Types
• Conditionals (if/else)
• Loops (for/while)
• Functions
• Basic Data Structures

**Step 3: Practice Daily**
• Code at least 30 minutes every day
• Solve problems on platforms like LeetCode, HackerRank
• Build small projects

**Step 4: Build Projects**
• Calculator app
• To-do list
• Weather app
• Simple website

**Step 5: Learn Version Control**
• Learn Git and GitHub
• Track your code changes

**Step 6: Join Communities**
• Stack Overflow
• Reddit (r/learnprogramming)
• Discord servers

**Step 7: Keep Learning**
• Follow tutorials
• Read documentation
• Learn new frameworks

💡 **Tip:** Practice is key! The more you code, the better you become.`
        }

        if (ql.includes('make') && ql.includes('money')) {
            return `💰 **How to make money online?**

Here are 10 ways to make money online in 2024:

**1. Freelancing** 💻
• Platforms: Upwork, Fiverr, Freelancer
• Skills: Writing, Design, Programming, Marketing

**2. Online Tutoring** 📚
• Teach subjects you're good at
• Platforms: Zoom, Google Meet

**3. Affiliate Marketing** 🛒
• Promote products and earn commission
• Amazon Associates, ClickBank

**4. YouTube Channel** 🎥
• Create videos about topics you love
• Earn from ads and sponsorships

**5. Dropshipping** 🛍️
• Sell products without keeping inventory
• Shopify + AliExpress

**6. Blogging** ✍️
• Write about topics you're passionate about
• Earn from ads and affiliate links

**7. Stock Market** 📈
• Invest in stocks and ETFs
• Learn before you invest

**8. E-commerce** 🛒
• Sell products on Amazon, eBay, Etsy

**9. Print-on-Demand** 👕
• Design custom products
• Platforms: Redbubble, Teespring

**10. Online Courses** 📝
• Create courses on Udemy, Coursera
• Share your expertise

💡 **Remember:** No get-rich-quick scheme works! It takes time and effort.`
        }

        if (ql.includes('stay') && ql.includes('healthy')) {
            return `💪 **How to stay healthy in 2024?**

**1. Eat Healthy Food** 🥗
• Eat fruits and vegetables daily
• Include protein in every meal
• Stay hydrated (drink 2-3L water)
• Limit processed food and sugar

**2. Exercise Regularly** 🏃
• 30 minutes of activity daily
• Walking, running, yoga, gym
• Find exercises you enjoy

**3. Get Enough Sleep** 😴
• 7-8 hours sleep daily
• Consistent sleep schedule
• Avoid screens before bed

**4. Manage Stress** 🧘
• Practice meditation
• Deep breathing exercises
• Spend time with loved ones

**5. Stay Mentally Active** 🧠
• Read books
• Learn new skills
• Solve puzzles

**6. Regular Checkups** 🏥
• Regular health checkups
• Preventive healthcare

💡 **Remember:** Health is wealth!`
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
                            resolve(`🌤️ **Weather in ${city}:**\n\n🌡️ Temperature: ${c.temp_C}°C\n💧 Humidity: ${c.humidity}%\n🌬️ Wind Speed: ${c.windspeedKmph} km/h\n☁️ Condition: ${c.weatherDesc[0].value}`);
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
    // MAIN PROCESS - FAST!
    // ==========================================
    async process(input) {
        const q = input.trim();
        if (!q) return "Please type something!";

        if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit' || q.toLowerCase() === 'bye') {
            return "👋 Goodbye! It was great talking to you! Have a wonderful day! 😊";
        }

        if (q.toLowerCase() === 'help') {
            return this.getHelp();
        }

        // Try detailed response first
        const detailed = this.getDetailedResponse(q);
        if (detailed) return detailed;

        // Try what/why/how handlers
        if (q.toLowerCase().match(/what|why|how|who|define|meaning|explain|kya|kyu|kaise|kaun/)) {
            const answer = await this.getInternetAnswer(q);
            if (answer) return answer;
        }

        // Math
        const math = this.solveMath(q);
        if (math) return `🧮 **Math Result:**\n${math}`;

        // Accounts
        const gst = this.calculateGST(q);
        if (gst) return gst;

        const pl = this.calculateProfitLoss(q);
        if (pl) return pl;

        // Weather
        if (q.toLowerCase().match(/weather|temperature|humidity|rain|monsoon|delhi|mumbai|chennai|kolkata|bangalore|hyderabad|jaipur|pune/i)) {
            let city = q.replace(/weather|temperature|humidity|rain|monsoon|in|of|for/i, '').trim();
            if (!city || city.length < 2) city = 'delhi';
            const weather = await this.getWeather(city);
            if (weather) return weather;
        }

        // Internet search
        const search = await this.googleSearch(q);
        if (search) {
            return `🔍 **Search Results for "${q}":**\n\n${search.substring(0, 2000)}`;
        }

        return `🤔 I don't have information about "${q}" right now.

💡 Try these:
• "What is ${q}?"
• "Why does ${q} happen?"
• "Explain ${q} to me"
• "Tell me about ${q}"

🌐 I'm connected to the internet - or just ask something else!`;
    }

    // ==========================================
    // INTERNET SEARCH FOR ANSWERS
    // ==========================================
    async getInternetAnswer(query) {
        const search = await this.googleSearch(query);
        if (search) {
            return `🔍 **Answer to your question:**\n\n${search.substring(0, 2000)}`;
        }
        return null;
    }

    // ==========================================
    // MATH
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
                if (parseFloat(nums[1]) === 0) return "❌ Cannot divide by zero!";
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
            return `🏷️ **GST Calculation:**\n\nPrice: ₹${price}\nGST Rate: ${rate}%\nGST Amount: ₹${gst.toFixed(2)}\nTotal: ₹${(price + gst).toFixed(2)}`;
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
                return `💰 **Profit:**\n\nCost Price (CP): ₹${cp}\nSelling Price (SP): ₹${sp}\nProfit: ₹${p}\nProfit%: ${((p/cp)*100).toFixed(2)}%`;
            } else if (cp > sp) {
                const l = cp - sp;
                return `💸 **Loss:**\n\nCost Price (CP): ₹${cp}\nSelling Price (SP): ₹${sp}\nLoss: ₹${l}\nLoss%: ${((l/cp)*100).toFixed(2)}%`;
            } else {
                return `🤝 No Profit No Loss: CP = SP = ₹${cp}`;
            }
        } catch(e) { return null; }
    }

    getHelp() {
        return `
📚 **HIMO AI - HELP**
━━━━━━━━━━━━━━━━━━━━

🌐 **ANY QUESTION - ANY TIME!**

📋 **EXAMPLES:**

🎯 **General:**
• "Hi, how are you?"
• "Tell me about yourself"
• "Tell me a joke"
• "Give me a fun fact"

🌤️ **Weather:**
• "Weather in Delhi"
• "Mumbai temperature"

🧮 **Maths:**
• "25% of 200"
• "2+2"
• "Average of 10,20,30"

📊 **Accounts:**
• "GST 1000 18"
• "Profit CP=500 SP=700"
• "Balance sheet"
• "Journal entries"

🌌 **Space:**
• "What is a black hole?"
• "Tell me about Mars"
• "Why is the sky blue?"

💻 **Coding:**
• "How to learn coding?"
• "Python function"
• "What is a class?"

💡 **Just ask anything - I'll give you a detailed answer!**
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
