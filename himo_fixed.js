const readline = require('readline');

class HimoAI {
    constructor() {
        console.log("\n" + "=".repeat(60));
        console.log("🔥 HIMO AI - COMPLETE VERSION FIXED");
        console.log("=".repeat(60));
        console.log(`
📋 FEATURES:
  🌤️ Weather AI
  🧮 Maths AI (Arithmetic + Geometry)
  🌌 Space AI
  💻 Coding AI
  🍽️ Food AI
  🎮 Games AI
  📚 A to Z Knowledge
  💰 Accounts AI (Balance Sheet, P&L, Journal, GST)
        `);
        console.log("=".repeat(60));
        console.log("💡 Type 'help' for examples | 'exit' to quit\n");
    }

    // ==========================================
    // 1. WEATHER
    // ==========================================
    weather(q) {
        if (q.includes('humidity')) return "💧 Humidity = Water vapor in air. Normal: 40-60%";
        if (q.includes('temperature')) return "🌡️ °F = (°C × 9/5) + 32 | °C = (°F - 32) × 5/9";
        if (q.includes('rain')) return "🌧️ Rain types: Light (<2.5mm/h), Moderate (2.5-7.5mm/h), Heavy (>7.5mm/h)";
        if (q.includes('monsoon')) return "🌧️ Indian Monsoon: June-September, 75% annual rainfall";
        return null;
    }

    // ==========================================
    // 2. MATHS - ARITHMETIC
    // ==========================================
    maths(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums) return null;
        try {
            // Addition
            if (q.includes('+') && nums.length >= 2) {
                return `🧮 ${nums[0]} + ${nums[1]} = ${parseFloat(nums[0]) + parseFloat(nums[1])}`;
            }
            // Subtraction
            if (q.includes('-') && nums.length >= 2) {
                return `🧮 ${nums[0]} - ${nums[1]} = ${parseFloat(nums[0]) - parseFloat(nums[1])}`;
            }
            // Multiplication
            if ((q.includes('*') || q.includes('×')) && nums.length >= 2) {
                return `🧮 ${nums[0]} × ${nums[1]} = ${parseFloat(nums[0]) * parseFloat(nums[1])}`;
            }
            // Division
            if ((q.includes('/') || q.includes('÷')) && nums.length >= 2) {
                if (parseFloat(nums[1]) === 0) return "❌ Cannot divide by zero";
                return `🧮 ${nums[0]} ÷ ${nums[1]} = ${parseFloat(nums[0]) / parseFloat(nums[1])}`;
            }
            // Percentage
            if ((q.includes('%') || q.includes('percent')) && nums.length >= 2) {
                return `📊 ${nums[0]}% of ${nums[1]} = ${(parseFloat(nums[0])/100) * parseFloat(nums[1])}`;
            }
            // Average
            if (q.includes('average') || q.includes('mean')) {
                if (nums.length > 1) {
                    const vals = nums.map(Number);
                    return `📊 Average = ${vals.reduce((a,b) => a+b, 0) / vals.length}`;
                }
            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // 3. GEOMETRY
    // ==========================================
    geometry(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums) return null;
        const n = nums.map(Number);
        const ql = q.toLowerCase();

        try {
            // Circle
            if (ql.includes('circle') && n.length >= 1) {
                const r = n[0];
                return `📐 CIRCLE (Radius ${r}):
• Area = πr² = ${(Math.PI * r * r).toFixed(2)}
• Circumference = 2πr = ${(2 * Math.PI * r).toFixed(2)}
• Diameter = 2r = ${2 * r}
📝 Formulas: Area=πr², Circumference=2πr`;
            }

            // Rectangle
            if (ql.includes('rectangle') && n.length >= 2) {
                const [l, b] = [n[0], n[1]];
                return `📐 RECTANGLE (${l} × ${b}):
• Area = l×b = ${l * b}
• Perimeter = 2(l+b) = ${2 * (l + b)}
• Diagonal = √(l²+b²) = ${Math.sqrt(l*l + b*b).toFixed(2)}
📝 Formulas: Area=l×b, Perimeter=2(l+b)`;

            }

            // Square
            if (ql.includes('square') && n.length >= 1) {
                const s = n[0];
                return `📐 SQUARE (Side ${s}):
• Area = s² = ${s * s}
• Perimeter = 4s = ${4 * s}
• Diagonal = s√2 = ${(s * Math.sqrt(2)).toFixed(2)}
📝 Formulas: Area=s², Perimeter=4s`;

            }

            // Triangle
            if (ql.includes('triangle') && n.length >= 2) {
                const [b, h] = [n[0], n[1]];
                return `📐 TRIANGLE (Base ${b}, Height ${h}):
• Area = ½×b×h = ${0.5 * b * h}
📝 Formula: Area = ½ × base × height`;

            }

            // Cube
            if (ql.includes('cube') && n.length >= 1) {
                const s = n[0];
                return `📦 CUBE (Side ${s}):
• Volume = s³ = ${s * s * s}
• Surface Area = 6s² = ${6 * s * s}
• Diagonal = s√3 = ${(s * Math.sqrt(3)).toFixed(2)}
📝 Formulas: Volume=s³, SA=6s²`;

            }

            // Sphere
            if (ql.includes('sphere') && n.length >= 1) {
                const r = n[0];
                return `⚪ SPHERE (Radius ${r}):
• Volume = ⁴⁄₃πr³ = ${((4/3) * Math.PI * r * r * r).toFixed(2)}
• Surface Area = 4πr² = ${(4 * Math.PI * r * r).toFixed(2)}
📝 Formulas: Volume=⁴⁄₃πr³, SA=4πr²`;

            }

            // Cylinder
            if (ql.includes('cylinder') && n.length >= 2) {
                const [r, h] = [n[0], n[1]];
                return `🥫 CYLINDER (Radius ${r}, Height ${h}):
• Volume = πr²h = ${(Math.PI * r * r * h).toFixed(2)}
• Curved SA = 2πrh = ${(2 * Math.PI * r * h).toFixed(2)}
• Total SA = 2πr(r+h) = ${(2 * Math.PI * r * (r + h)).toFixed(2)}
📝 Formulas: Volume=πr²h, CSA=2πrh, TSA=2πr(r+h)`;

            }

            // Cone
            if (ql.includes('cone') && n.length >= 2) {
                const [r, h] = [n[0], n[1]];
                const l = Math.sqrt(r*r + h*h);
                return `🔺 CONE (Radius ${r}, Height ${h}):
• Slant Height = √(r²+h²) = ${l.toFixed(2)}
• Volume = ⅓πr²h = ${((1/3) * Math.PI * r * r * h).toFixed(2)}
• Curved SA = πrl = ${(Math.PI * r * l).toFixed(2)}
• Total SA = πr(r+l) = ${(Math.PI * r * (r + l)).toFixed(2)}
📝 Formulas: Slant Height=√(r²+h²), Volume=⅓πr²h, CSA=πrl, TSA=πr(r+l)`;

            }
        } catch(e) { return null; }
        return null;
    }

    // ==========================================
    // 4. ACCOUNTS - BALANCE SHEET
    // ==========================================
    balanceSheet() {
        return `
📊 BALANCE SHEET FORMAT:
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

📝 RULES:
• Assets = Liabilities + Capital
• Always Balanced!
• Debit = Credit

🏷️ ACCOUNT TYPES:
• Personal: Debtors, Creditors, Capital
• Real: Cash, Bank, Building
• Nominal: Sales, Purchase, Rent, Salary
`;
    }

    // ==========================================
    // 5. ACCOUNTS - PROFIT & LOSS
    // ==========================================
    profitLoss() {
        return `
📊 PROFIT & LOSS ACCOUNT:
━━━━━━━━━━━━━━━━━━━━━━━━━━

Dr (Expenses)         | Cr (Income)
━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━
Opening Stock         | Sales
Purchases             | Closing Stock
Wages                 | Returns Inward
Carriage Inward       | Commission Rec
Salaries              | Discount Rec
Rent                  | Gross Profit
Insurance             |
Depreciation          |
Gross Profit          |
━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━
Total                 | Total

📝 RULES:
• Cr > Dr = Gross Profit
• Dr > Cr = Gross Loss
• Net Profit = Total Income - Total Expenses
`;
    }

    // ==========================================
    // 6. ACCOUNTS - JOURNAL ENTRIES
    // ==========================================
    journalEntries() {
        return `
📝 JOURNAL ENTRIES:

1️⃣ Cash Sales:
Cash A/c                          Dr    1000
   To Sales A/c                          1000
(Goods sold for cash)

2️⃣ Credit Purchase:
Purchase A/c                      Dr    5000
   To Creditor A/c                       5000
(Goods purchased on credit)

3️⃣ Payment to Creditor:
Creditor A/c                       Dr    3000
   To Cash A/c                           3000
(Cash paid)

4️⃣ Salary Paid:
Salary A/c                         Dr    8000
   To Cash A/c                           8000
(Salary paid)

5️⃣ Depreciation:
Depreciation A/c                   Dr    2000
   To Asset A/c                           2000
(Depreciation charged)

6️⃣ Interest Received:
Cash A/c                           Dr     500
   To Interest Received A/c               500
(Interest received)

📝 GOLDEN RULES:
• Personal: Debit receiver, Credit giver
• Real: Debit what comes in, Credit what goes out
• Nominal: Debit expenses/losses, Credit income/gains
`;
    }

    // ==========================================
    // 7. GST
    // ==========================================
    gst(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) {
            return `
🏷️ GST COMPLETE GUIDE:

🔢 GST Slabs (India):
• 0% - Essential goods
• 5% - Basic essentials
• 12% - Standard goods
• 18% - Luxury goods
• 28% - Highest luxury

📝 Formula:
GST = (GST% × Price) / 100
Total = Price + GST

💡 Example: "GST 1000 18"
`;
        }
        try {
            const price = parseFloat(nums[0]);
            const rate = parseFloat(nums[1]);
            const gst = (rate/100) * price;
            return `
🏷️ GST CALCULATION:
━━━━━━━━━━━━━━━━━━━━
Base Price = ₹${price}
GST Rate = ${rate}%

GST = (${rate}% × ${price}) / 100 = ₹${gst.toFixed(2)}
Total = ₹${(price + gst).toFixed(2)}

📝 Formula:
GST = (GST% × Price) / 100
Total = Price + GST
`;
        } catch(e) { return null; }
    }

    // ==========================================
    // 8. INCOME TAX
    // ==========================================
    incomeTax(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums) return null;
        try {
            const income = parseFloat(nums[0]);

            // Indian Tax Slabs (New Regime 2023-24)
            let tax = 0;
            let slab = "";

            if (income <= 300000) { tax = 0; slab = "0%"; }
            else if (income <= 600000) { tax = (income - 300000) * 0.05; slab = "5%"; }
            else if (income <= 900000) { tax = 15000 + (income - 600000) * 0.10; slab = "10%"; }
            else if (income <= 1200000) { tax = 45000 + (income - 900000) * 0.15; slab = "15%"; }
            else if (income <= 1500000) { tax = 90000 + (income - 1200000) * 0.20; slab = "20%"; }
            else { tax = 150000 + (income - 1500000) * 0.30; slab = "30%"; }

            const cess = tax * 0.04;
            const totalTax = tax + cess;

            return `
📊 INCOME TAX (India):
━━━━━━━━━━━━━━━━━━━━
Annual Income = ₹${income.toFixed(2)}
Slab = ${slab}

Tax = ₹${tax.toFixed(2)}
Cess (4%) = ₹${cess.toFixed(2)}
Total Tax = ₹${totalTax.toFixed(2)}
After Tax = ₹${(income - totalTax).toFixed(2)}

📝 Slabs (New Regime 2023-24):
0-3L: 0% | 3-6L: 5% | 6-9L: 10%
9-12L: 15% | 12-15L: 20% | 15L+: 30%
`;
        } catch(e) { return null; }
    }

    // ==========================================
    // 9. PROFIT/LOSS
    // ==========================================
    profitLossCalc(q) {
        const nums = q.match(/[\d.]+/g);
        if (!nums || nums.length < 2) return null;
        try {
            const cp = parseFloat(nums[0]);
            const sp = parseFloat(nums[1]);

            if (sp > cp) {
                const p = sp - cp;
                return `💰 PROFIT:
CP = ₹${cp}, SP = ₹${sp}
Profit = ₹${p}
Profit% = ${((p/cp)*100).toFixed(2)}%

📝 Formula: Profit = SP - CP, Profit% = (Profit/CP) × 100
🎉 Great!`;
            } else if (cp > sp) {
                const l = cp - sp;
                return `💸 LOSS:
CP = ₹${cp}, SP = ₹${sp}
Loss = ₹${l}
Loss% = ${((l/cp)*100).toFixed(2)}%

📝 Formula: Loss = CP - SP, Loss% = (Loss/CP) × 100
😊 Better luck next time!`;
            } else {
                return `🤝 No Profit No Loss: CP = SP = ₹${cp}`;
            }
        } catch(e) { return null; }
    }

    // ==========================================
    // 10. SPACE
    // ==========================================
    space(q) {
        const planets = {
            'mercury': '🪐 Mercury: Smallest, 0 moons, -180°C to 430°C',
            'venus': '🪐 Venus: Hottest, 0 moons, 462°C, Retrograde',
            'earth': '🪐 Earth: Only life, 1 moon, 15°C avg',
            'mars': '🪐 Mars: Red planet, 2 moons, Olympus Mons',
            'jupiter': '🪐 Jupiter: Largest, 95 moons, Great Red Spot',
            'saturn': '🪐 Saturn: Rings, 146 moons, floats on water!',
            'uranus': '🪐 Uranus: Rotates on side, 27 moons, -197°C',
            'neptune': '🪐 Neptune: Strongest winds, 16 moons, -201°C'
        };
        for (const p of Object.keys(planets)) {
            if (q.includes(p)) return planets[p];
        }
        if (q.includes('sun')) return "☀️ Sun: G-type star, 1,391,000 km diameter, 5,500°C surface";
        if (q.includes('black hole')) return "🕳️ Black Hole: Gravity so strong light can't escape!";
        if (q.includes('galaxy') || q.includes('milky')) return "🌌 Milky Way: Spiral galaxy, 100,000 light-years diameter";
        if (q.includes('moon')) return "🌙 Moon: 3,474 km diameter, 384,400 km from Earth";
        return null;
    }

    // ==========================================
    // 11. FOOD
    // ==========================================
    food(q) {
        const foods = {
            'moong': '🌾 Moong Dal: 24g protein, 340 cal, Benefits: Digestion, Weight loss',
            'masoor': '🌾 Masoor Dal: 25g protein, 350 cal, Benefits: Anemia, Heart health',
            'chana': '🌾 Chana Dal: 20g protein, 370 cal, Benefits: Diabetes, Heart health',
            'urad': '🌾 Urad Dal: 25g protein, 350 cal, Benefits: Energy, Skin health',
            'rajma': '🌾 Rajma: 24g protein, 330 cal, Benefits: Heart health, Weight loss',
            'apple': '🍎 Apple: 52 cal, Benefits: Heart, Digestion, Skin, Season: Sep-Nov',
            'banana': '🍌 Banana: 89 cal, Benefits: Energy, Heart, Bones, Season: Year-round',
            'mango': '🥭 Mango: 60 cal, Benefits: Immunity, Eyes, Skin, Season: Mar-Jul',
            'orange': '🍊 Orange: 47 cal, Benefits: Immunity, Skin, Heart, Season: Oct-Mar',
            'wheat': '🌾 Wheat: 13g protein, 330 cal, Benefits: Digestion, Heart health',
            'ragi': '🌾 Ragi: 10g protein, 350 cal, Benefits: Calcium rich, Bones',
            'oats': '🌾 Oats: 17g protein, 350 cal, Benefits: Cholesterol, Weight loss',
            'almond': '🥜 Almond: 579 cal, Benefits: Brain, Heart, Skin',
            'spinach': '🥬 Spinach: 23 cal, Benefits: Bones, Blood, Eyes',
            'broccoli': '🥦 Broccoli: 34 cal, Benefits: Immunity, Bones, Eyes',
            'carrot': '🥕 Carrot: 41 cal, Benefits: Eyes, Skin, Immunity'
        };
        for (const f of Object.keys(foods)) {
            if (q.includes(f)) return foods[f];
        }
        return null;
    }

    // ==========================================
    // 12. GAMES
    // ==========================================
    games(q) {
        const games = {
            'cricket': '🏏 Cricket: 11 players, Test/ODI/T20, Rules: Bat-ball, Runs, Wickets',
            'football': '⚽ Football: 11 players, 90 min, Rules: Goal scoring, Offside',
            'chess': '♟️ Chess: 2 players, Strategy game, Rules: Checkmate, 16 pieces each',
            'ludo': '🎲 Ludo: 2-4 players, Roll dice, First to reach home wins'
        };
        for (const g of Object.keys(games)) {
            if (q.includes(g)) return games[g];
        }
        return null;
    }

    // ==========================================
    // 13. A TO Z
    // ==========================================
    atoz(q) {
        if (q.length === 1 && q.match(/[a-z]/i)) {
            const topics = {
                'a': 'A: Astronomy, AI, Algorithms, Atom, Anatomy',
                'b': 'B: Biology, Black Holes, Big Bang, Binary, Botany',
                'c': 'C: Chemistry, Coding, Climate, Cosmos, Calculus',
                'd': 'D: Dark Matter, Dark Energy, DNA, Debugging',
                'e': 'E: Energy, Exoplanets, Evolution, Encryption',
                'f': 'F: Finance, Functions, Fossils, Friction',
                'g': 'G: Galaxies, Gravity, Genetics, Graphs, GST',
                'h': 'H: History, Humidity, HTML, Hydrogen',
                'i': 'I: Internet, Investment, IP Address, Ion',
                'j': 'J: Java, JavaScript, Jupiter, Journal',
                'k': 'K: Kepler, Kinematics, Knowledge, Kuiper Belt',
                'l': 'L: Languages, Light, Ledger, Linked List',
                'm': 'M: Mathematics, Mars, Memory, Moon, ML',
                'n': 'N: NASA, Nebulae, Networking, Neutron',
                'o': 'O: Ocean, Orbit, Operating System, Oxygen',
                'p': 'P: Physics, Python, Planets, Profit',
                'q': 'Q: Quantum, Quasar, Queue, Query',
                'r': 'R: Robotics, Rocket, Ratio, Recursion',
                's': 'S: Solar System, Stars, Statistics, Saturn',
                't': 'T: Technology, Telescope, Tax, Tree',
                'u': 'U: Universe, Uranus, Utility, Unix',
                'v': 'V: Venus, Virus, Variables, Velocity',
                'w': 'W: Weather, Web, Wind, Windows',
                'x': 'X: X-ray, Xenophobia, Xylem',
                'y': 'Y: Yellow, Yield, Yoga, YAML',
                'z': 'Z: Zen, Zero, Zebra, ZIP, Zodiac'
            };
            const key = q.toLowerCase();
            if (topics[key]) return `📚 ${topics[key]}`;
        }
        return null;
    }

    // ==========================================
    // 14. CODING
    // ==========================================
    coding(q) {
        const errors = {
            'indentation': '🔧 Use 4 spaces consistently',
            'nameerror': '🔧 Define variable before use',
            'typeerror': '🔧 Convert types (int() or str())',
            'valueerror': '🔧 Check input values',
            'indexerror': '🔧 Check list bounds, use len()-1',
            'keyerror': '🔧 Use .get() for dictionaries',
            'syntaxerror': '🔧 Check colons, brackets, quotes'
        };
        for (const e of Object.keys(errors)) {
            if (q.includes(e)) return errors[e];
        }
        if (q.includes('function')) {
            return `💻 Python Function:
function add(a, b) {
    return a + b;
}
console.log(add(5,3)); // 8`;
        }
        if (q.includes('class')) {
            return `💻 Python Class:
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        return \`Hello, \${this.name}!\`;
    }
}
const p = new Person("Himo");
console.log(p.greet());`;
        }
        return null;
    }

    // ==========================================
    // 15. MAIN PROCESS
    // ==========================================
    process(input) {
        const q = input.trim().toLowerCase();

        if (q === 'exit' || q === 'quit' || q === 'bye') {
            return "👋 Goodbye! Himo is always learning!";
        }

        if (q === 'help') {
            return this.getHelp();
        }

        // Check each AI in priority order
        const responses = [
            this.weather(q),
            this.maths(q),
            this.geometry(q),
            this.profitLossCalc(q),
            this.gst(q),
            this.incomeTax(q),
            this.balanceSheet(),
            this.profitLoss(),
            this.journalEntries(),
            this.space(q),
            this.food(q),
            this.games(q),
            this.atoz(q),
            this.coding(q)
        ];

        // Check for specific keywords
        if (q.includes('balance sheet') || q.includes('balancesheet')) {
            return this.balanceSheet();
        }
        if (q.includes('profit and loss') || q.includes('p&l') || q.includes('profit loss')) {
            return this.profitLoss();
        }
        if (q.includes('journal') || q.includes('journal entries') || q.includes('journal entry')) {
            return this.journalEntries();
        }
        if (q.includes('gst')) {
            return this.gst(q);
        }
        if (q.includes('tax') || q.includes('income tax')) {
            return this.incomeTax(q);
        }
        if (q.includes('circle') || q.includes('rectangle') || q.includes('square') || q.includes('triangle') || 
            q.includes('cube') || q.includes('sphere') || q.includes('cylinder') || q.includes('cone')) {
            const geo = this.geometry(q);
            if (geo) return geo;
        }

        for (const response of responses) {
            if (response) return response;
        }

        return this.defaultResponse(input);
    }

    defaultResponse(input) {
        return `🤔 I didn't understand "${input}"

💡 Try these:
• "2+2" → Maths
• "Circle radius 5" → Geometry
• "Balance sheet" → Accounts
• "GST 1000 18" → GST
• "Profit CP=500 SP=700" → Profit/Loss
• "Income tax 1200000" → Tax
• "Mars" → Space
• "Apple" → Food
• "help" → All commands

🌐 Himo has ALL knowledge! Just ask differently.`;
    }

    getHelp() {
        return `
📚 HIMO AI - COMPLETE HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━

🧮 MATHS:
• "2+2", "5×3", "10/2"
• "25% of 200"
• "Average of 10,20,30"
• "LCM of 4,6,8"

📐 GEOMETRY:
• "Circle radius 5"
• "Rectangle 4 6"
• "Square side 7"
• "Cube side 3"
• "Sphere radius 4"
• "Cylinder radius 3 height 5"

💰 PROFIT/LOSS:
• "Profit CP=500 SP=700"
• "Loss CP=1000 SP=800"

🏷️ GST:
• "GST 1000 18"

📊 INCOME TAX:
• "Income tax 1200000"

📊 ACCOUNTS:
• "Balance sheet"
• "Profit and loss account"
• "Journal entries"

🌌 SPACE:
• "Mars", "Sun", "Black hole", "Galaxy"

🍽️ FOOD:
• "Apple", "Moong Dal", "Ragi", "Almond"

🎮 GAMES:
• "Cricket", "Football", "Chess"

📚 A TO Z:
• "A", "B", "C" ... "Z"

💻 CODING:
• "Function", "Class", "IndentationError"

🌤️ WEATHER:
• "Humidity", "Temperature", "Rain"

💡 Example: "GST 1000 18" → Calculates GST
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

function ask() {
    rl.question("\nYou: ", (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log("\nHimo: 👋 Goodbye! Keep learning!");
            rl.close();
            return;
        }
        const response = himo.process(input);
        console.log(`\nHimo:\n${response}`);
        ask();
    });
}

ask();
