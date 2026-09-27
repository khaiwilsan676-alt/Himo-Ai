const knowledgeBase = [
  {
    keywords: ["hello", "hi", "hey", "namaste", "hola"],
    answer: "Hello! I'm Himo. How can I help you today?"
  },
  {
    keywords: ["how are you", "how r u", "kaise ho", "kya haal"],
    answer: "I'm doing great! Ready to help you with anything you need."
  },
  {
    keywords: ["your name", "who are you", "tum kaun", "aap kaun"],
    answer: "I'm Himo, your creative intelligence assistant. I can help you with questions, coding, and creative tasks."
  },
  {
    keywords: ["what can you do", "help", "features", "capabilities"],
    answer: "I can help you with:\n• Answering questions\n• Writing code\n• Creative writing\n• Problem solving\n• Learning new things\n\nJust ask me anything!"
  },
  {
    keywords: ["time", "date", "aaj kya", "time kya"],
    answer: `Current time is: ${new Date().toLocaleTimeString()}\nToday's date is: ${new Date().toLocaleDateString()}`
  },
  {
    keywords: ["weather", "mausam", "temperature"],
    answer: "I don't have real-time weather data. Please check a weather website or app for accurate weather information."
  },
  {
    keywords: ["joke", "funny", "hasi", "majak"],
    answer: "Why don't programmers like nature? It has too many bugs! 🐛\n\nWant another one?"
  },
  {
    keywords: ["quote", "motivation", "inspirational"],
    answer: "\"The only way to do great work is to love what you do.\" - Steve Jobs\n\nWould you like more quotes?"
  },
  {
    keywords: ["coding", "code", "programming", "developer"],
    answer: "I can help you with coding! Tell me:\n• What language are you using?\n• What problem are you facing?\n• Do you need code examples?"
  },
  {
    keywords: ["react", "nextjs", "next.js", "javascript framework"],
    answer: "I can help you with React/Next.js! Common topics:\n• Components and Props\n• State Management\n• Routing\n• API Integration\n• Server Components\n\nWhat specifically do you need help with?"
  },
  {
    keywords: ["python", "django", "flask"],
    answer: "I can help you with Python! Whether it's:\n• Basic syntax\n• Data structures\n• Web development\n• Machine learning\n• Automation\n\nWhat would you like to learn?"
  },
  {
    keywords: ["html", "css", "web design", "frontend"],
    answer: "For web development, I can help with:\n• HTML structure\n• CSS styling\n• Responsive design\n• Flexbox and Grid\n• Animations\n\nWhat are you building?"
  },
  {
    keywords: ["sql", "database", "mysql", "postgresql"],
    answer: "I can help with databases! Common topics:\n• SQL queries\n• Database design\n• Indexing\n• Relationships\n• Optimization\n\nWhat's your database question?"
  },
  {
    keywords: ["api", "rest", "graphql", "backend"],
    answer: "I can help with APIs and backend development:\n• REST API design\n• Authentication\n• Database integration\n• Server deployment\n• Performance\n\nWhat are you working on?"
  },
  {
    keywords: ["error", "bug", "issue", "problem", "fix"],
    answer: "I can help debug your issue! Please provide:\n1. The error message\n2. Your code snippet\n3. What you're trying to achieve\n\nI'll help you find the solution."
  },
  {
    keywords: ["startup", "business", "idea", "entrepreneur"],
    answer: "Great! For startup ideas, consider:\n• Solve a real problem\n• Target specific audience\n• Validate your idea\n• Keep MVP simple\n• Focus on user feedback\n\nWhat industry are you interested in?"
  },
  {
    keywords: ["travel", "trip", "vacation", "tour"],
    answer: "I can help plan your travel! Tell me:\n• Destination\n• Duration\n• Budget\n• Interests\n\nI'll suggest an itinerary."
  },
  {
    keywords: ["food", "recipe", "cooking", "khana"],
    answer: "I can share recipes and cooking tips! What type of dish would you like to make?\n\n• Breakfast\n• Lunch\n• Dinner\n• Snacks\n• Desserts"
  },
  {
    keywords: ["health", "fitness", "exercise", "workout"],
    answer: "For health and fitness, I can help with:\n• Exercise routines\n• Nutrition tips\n• Wellness advice\n• Motivation\n\nRemember to consult professionals for medical advice."
  },
  {
    keywords: ["study", "exam", "learning", "education"],
    answer: "I can help you study! I can:\n• Explain concepts\n• Create summaries\n• Quiz you\n• Provide examples\n\nWhat subject are you studying?"
  },
  {
    keywords: ["math", "mathematics", "calculation", "equation"],
    answer: "I can help with math! Whether it's:\n• Algebra\n• Calculus\n• Statistics\n• Geometry\n\nShare your problem and I'll explain step by step."
  },
  {
    keywords: ["science", "physics", "chemistry", "biology"],
    answer: "I can explain science concepts clearly! What topic are you curious about?\n\n• Physics\n• Chemistry\n• Biology\n• Astronomy"
  },
  {
    keywords: ["history", "ancient", "past", "historical"],
    answer: "History is fascinating! I can tell you about:\n• Ancient civilizations\n• World wars\n• Famous leaders\n• Cultural movements\n\nWhat period interests you?"
  },
  {
    keywords: ["music", "song", "artist", "band"],
    answer: "I love discussing music! I can help with:\n• Song recommendations\n• Artist information\n• Music theory\n• Lyrics meaning\n\nWhat genre do you enjoy?"
  },
  {
    keywords: ["movie", "film", "series", "tv show"],
    answer: "I can recommend movies and shows! Tell me:\n• Genre preference\n• Recent favorites\n• Mood you're in\n\nI'll suggest something great!"
  },
  {
    keywords: ["game", "gaming", "video game", "play"],
    answer: "I can talk about games! I can help with:\n• Game recommendations\n• Tips and strategies\n• Game development\n• Gaming news\n\nWhat games do you play?"
  },
  {
    keywords: ["book", "reading", "novel", "literature"],
    answer: "I can suggest books! What genre do you prefer?\n\n• Fiction\n• Mystery\n• Science Fiction\n• Self-help\n• Biography"
  },
  {
    keywords: ["news", "current events", "latest", "today news"],
    answer: "I don't have real-time news updates. Please check news websites for the latest information."
  },
  {
    keywords: ["thanks", "thank you", "shukriya", "dhanyavad"],
    answer: "You're welcome! 😊 Feel free to ask if you need anything else."
  },
  {
    keywords: ["bye", "goodbye", "see you", "alvida"],
    answer: "Goodbye! Have a great day! 👋"
  },
  {
    keywords: ["love", "relationship", "dating", "pyaar"],
    answer: "Relationships are beautiful! I can give general advice, but remember:\n• Communication is key\n• Be yourself\n• Respect boundaries\n• Trust and honesty matter"
  },
  {
    keywords: ["career", "job", "work", "profession"],
    answer: "I can help with career advice:\n• Resume tips\n• Interview preparation\n• Skill development\n• Career planning\n\nWhat field are you in?"
  },
  {
    keywords: ["motivation", "success", "goal", "achieve"],
    answer: "Remember:\n• Start small, think big\n• Consistency beats intensity\n• Learn from failures\n• Celebrate small wins\n\nWhat goal are you working towards?"
  },
  {
    keywords: ["meaning of life", "life", "purpose", "zindagi"],
    answer: "The meaning of life is subjective. Some find it in:\n• Relationships\n• Creating value\n• Personal growth\n• Helping others\n\nWhat gives your life meaning?"
  },
  {
    keywords: ["ai", "artificial intelligence", "machine learning", "deep learning"],
    answer: "AI is fascinating! Key concepts:\n• Machine Learning\n• Neural Networks\n• Natural Language Processing\n• Computer Vision\n\nWant to learn more about any specific area?"
  },
  {
    keywords: ["create", "make", "build", "design"],
    answer: "I can help you create amazing things! Tell me:\n• What do you want to create?\n• What's your skill level?\n• Any specific requirements?\n\nLet's build something great!"
  },
  {
    keywords: ["write", "content", "blog", "article"],
    answer: "I can help with writing! I can assist with:\n• Blog posts\n• Articles\n• Stories\n• Essays\n• Social media content\n\nWhat are you writing about?"
  },
  {
    keywords: ["translate", "language", "bhasha", "anuvad"],
    answer: "I can help with translations! Tell me:\n• Source language\n• Target language\n• Text to translate\n\nI'll do my best to help."
  },
  {
    keywords: ["email", "letter", "formal", "professional"],
    answer: "I can help write professional emails! Share:\n• Purpose of email\n• Recipient\n• Key points\n\nI'll draft a professional email for you."
  },
  {
    keywords: ["presentation", "slides", "ppt"],
    answer: "I can help with presentations! I can assist with:\n• Structure outline\n• Key points\n• Speaker notes\n• Visual suggestions\n\nWhat's your presentation about?"
  },
  {
    keywords: ["social media", "instagram", "facebook", "twitter", "linkedin"],
    answer: "I can help with social media! I can assist with:\n• Post ideas\n• Captions\n• Hashtags\n• Content strategy\n\nWhich platform are you focusing on?"
  }
]

export function findAnswer(question) {
  const raw = String(question || "").trim()
  const q = raw.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim()
  if (!q) return "Haan bhai, kuch pucho. Main sun raha hoon."

  // Greetings / identity / conversation
  if (/^(hi|hii|hiii|hello|hey|heyy|namaste|salam|hola)\b/.test(q))
    return "Haan bhai! 👋 Main Himo hoon. Bol, kya help chahiye?"
  if (/\b(tu|tuu|tum|aap|ap)\s+(kaun|kon)\s+(ho|hai|hain|ha)\b|\b(who|what|whay)\s+(are|is)\s+(you|himo)\b|\b(tera|tumhara|aapka)\s+naam\s+(kya|what)\b/.test(q))
    return "Main Himo hoon — tumhara own AI assistant. Main questions, maths, coding, study, writing aur everyday problems mein help karta hoon."
  if (/\b(tu|tuu|tum|aap)\s+kya\s+kar(ta|te|rha|rahe)?\s*(ha|hai|ho)?\b|\b(what|whay|kya)\s+are\s+you\s+doing\b/.test(q))
    return "Main abhi tumhare message ko samajhkar answer kar raha hoon 😄 Jo puchna hai seedha pucho."
  if (/\b(how are you|how r u|kaise ho|kya haal|kaisa hai)\b/.test(q))
    return "Main bilkul theek hoon bhai 😊 Ready hoon tumhari help ke liye."
  if (/\b(what can you do|tum kya kar sakte|aap kya kar sakte|capabilities|features)\b/.test(q))
    return "Main general questions, maths, science, coding, study, writing, translation, ideas, explanations aur everyday questions mein help kar sakta hoon."
  if (/\b(thanks|thank you|shukriya|dhanyavad|thx)\b/.test(q))
    return "Koi baat nahi bhai 😊"
  if (/^(bye|goodbye|see you|alvida)\b/.test(q))
    return "Bye bhai 👋 Phir milte hain!"

  // Exact arithmetic: supports + - * / %, powers and parentheses.
  const mathText = q
    .replace(/\b(what is|calculate|solve|answer|find|kitna|kitne|equals|equal to)\b/g, "")
    .replace(/\bx\b/g, "*")
    .replace(/\^/g, "**")
    .trim()
  if (/^[0-9+\-*/().%\s*]+$/.test(mathText) && /[0-9]/.test(mathText) && /[+\-*/%]/.test(mathText)) {
    try {
      if (!/[a-z]/.test(mathText)) {
        const result = Function('"use strict"; return (' + mathText + ')')()
        if (Number.isFinite(result)) return "Answer: " + result
      }
    } catch {}
  }

  // Common maths concepts.
  if (/\b(percentage|percent|pratishat)\b/.test(q))
    return "Percentage ka formula: (part ÷ whole) × 100. Example: 25 out of 100 = 25%."
  if (/\b(pythagoras|pythagorean)\b/.test(q))
    return "Pythagoras theorem: right triangle mein a² + b² = c², jahan c hypotenuse hai."
  if (/\b(area|perimeter|volume)\b/.test(q))
    return "Area/perimeter/volume ka exact formula shape par depend karta hai. Shape aur values bhejo, main step-by-step solve kar dunga."
  if (/\b(average|mean|median|mode)\b/.test(q))
    return "Mean = values ka sum ÷ number of values. Median middle value hoti hai; mode sabse zyada repeat hone wali value."
  if (/\b(algebra|equation|quadratic|linear equation|factor)\b/.test(q))
    return "Algebra problem bhejo. Main equation ko step-by-step simplify, solve aur verify kar sakta hoon."
  if (/\b(math|mathematics|calculation|calculus|geometry|trigonometry|statistics|probability|matrix|integral|derivative|fraction|decimal|ratio|logarithm)\b/.test(q))
    return "Haan bhai, maths mein help karunga — arithmetic se calculus, algebra, geometry, trigonometry, statistics aur probability tak. Exact question bhejo."

  // Everyday / knowledge categories
  const rules = [
    [/\b(joke|funny|hasi|majak)\b/, "Why don't programmers like nature? Too many bugs! 🐛"],
    [/\b(meaning|matlab)\s+(of|ka)\b/, "Jis word ya phrase ka meaning chahiye, woh bhejo — main simple Hindi/Hinglish mein samjha dunga."],
    [/\b(explain|samjha|samjhao|what is|what are|kya hai|define|definition)\b/, "Bilkul. Topic ya term bhejo; main simple explanation, example aur important points ke saath samjhaunga."],
    [/\b(code|coding|programming|developer|javascript|typescript|python|java|c\+\+|c\s*#|react|nextjs|html|css|sql|api|backend|frontend|github|git|android|kotlin|swift)\b/, "Coding mein help kar sakta hoon — code, debugging, errors, architecture, APIs, frontend/backend aur programming concepts ke saath. Code ya exact problem bhejo."],
    [/\b(error|bug|issue|problem|fix|not working|crash)\b/, "Haan, issue fix karte hain. Error message, relevant code aur expected result bhejo."],
    [/\b(study|exam|homework|assignment|education|learn|learning|school|college|notes|question answer)\b/, "Study mein help kar sakta hoon — concept explanation, notes, examples, revision aur practice questions bana sakta hoon."],
    [/\b(science|physics|chemistry|biology|astronomy|space|planet|atom|molecule)\b/, "Science ka concept simple language mein explain kar sakta hoon. Topic bhejo — definition, reason, example aur key points ke saath."],
    [/\b(history|historical|ancient|war|civilization|empire|king|queen)\b/, "History topic bhejo. Main timeline, causes, events aur effects ko clearly explain karunga."],
    [/\b(geography|country|capital|continent|ocean|river|mountain|map)\b/, "Geography ke concepts, countries, capitals, physical features aur maps ke baare mein explain kar sakta hoon."],
    [/\b(food|recipe|cooking|khana|breakfast|lunch|dinner|dessert)\b/, "Food/recipe ke liye dish ka naam aur available ingredients bhejo; main ingredients aur step-by-step method de dunga."],
    [/\b(travel|trip|vacation|tour|hotel|flight|destination)\b/, "Travel planning mein destination, dates, budget aur interests batao; main itinerary aur planning ideas de sakta hoon."],
    [/\b(movie|film|series|tv|show|anime|music|song|artist|game|gaming|book|novel)\b/, "Entertainment topic batao — main discussion, recommendations, explanations aur general information mein help kar sakta hoon."],
    [/\b(career|job|resume|cv|interview|profession|skill)\b/, "Career mein resume, interview preparation, skills aur career planning par practical help kar sakta hoon."],
    [/\b(business|startup|entrepreneur|marketing|customer|company)\b/, "Business/startup idea batao. Main problem, audience, product, pricing, marketing aur execution ko structure karne mein help karunga."],
    [/\b(write|writing|essay|article|story|blog|caption|email|letter|presentation|translate|translation|grammar)\b/, "Writing mein help kar sakta hoon — draft, rewrite, grammar, translation, essay, email, story, article ya presentation ke liye requirement bhejo."],
    [/\b(love|relationship|dating|friendship|pyaar|dosti)\b/, "Relationship ya friendship situation batao. Main respectful, practical perspective aur communication ideas de sakta hoon."],
    [/\b(motivation|success|goal|stress|sad|angry|tired)\b/, "Bhai, situation batao. Main calmly sununga aur practical next steps sochne mein help karunga."],
    [/\b(ai|artificial intelligence|machine learning|deep learning|neural network|robot)\b/, "AI ke concepts jaise machine learning, neural networks, LLMs, computer vision aur NLP ko simple examples ke saath explain kar sakta hoon."],
    [/\b(time|date|aaj|today)\b/, "Current time/date device ke local time par depend karta hai. Agar exact current time/date chahiye, main available runtime information ke according bata sakta hoon."]
  ]
  for (const [pattern, answer] of rules) if (pattern.test(q)) return answer

  // Broad fallback: still answers conversationally instead of returning unrelated search content.
  return "Haan bhai, samajh gaya. Apna question thoda detail mein bhejo — main Himo ke through answer, explanation, example ya step-by-step solution dunga."
}

export function shouldUseWebSearch() {
  return false
}

export function getSuggestedQuestions() {
  return [
    "What can you do?",
    "Help me with coding",
    "Tell me a joke",
    "Career advice",
    "How to learn programming?",
    "Give me motivation"
  ]
}

export default knowledgeBase
