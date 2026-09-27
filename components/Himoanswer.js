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
  const q = String(question || "").toLowerCase().trim().replace(/[?!.,]/g, " ")
  const normalized = q.replace(/\s+/g, " ")

  // High-priority identity/introduction intents. These must be checked first
  // so broad keywords cannot return an unrelated answer.
  if (/^(tu|tuu|tum|aap|ap)\s+(kaun|kon)\s+(ho|hai|hain|ha)|^(who|what|whay)\s+(are|is)\s+(you|himo)|\b(tera|tumhara|aapka)\s+naam\s+(kya|what)/.test(normalized)) {
    return "Main Himo hoon — tumhara AI assistant. Main questions ka jawab, explanations, coding, maths, writing aur problem-solving mein help karta hoon."
  }

  if (/\b(kya|what)\s+(kar|doing|doing\s+right)\s+(raha|rahe|rhe|ho|hai)|\b(what|kya|whay)\s+are\s+you\s+doing|\b(tu|tuu|tum)\s+kya\s+kar(ta|te|rha|rahe)?\s*(ha|hai|ho)?\b/.test(normalized)) {
    return "Main Himo hoon aur abhi tumhare message ka jawab de raha hoon. Jo puchna hai seedha pucho."
  }

  if (/^(hello|hi|hey|namaste|hola)\b/.test(normalized)) {
    return "Hello! Main Himo hoon. Kya help chahiye?"
  }

  if (/\bhow\s+(are|r)\s+you\b|\bkaise\s+ho\b|\bkya\s+haal\b/.test(normalized)) {
    return "Main bilkul theek hoon 😊 Tumhara question solve karne ke liye ready hoon."
  }

  if (/\b(what\s+can\s+you\s+do|tum\s+kya\s+kar\s+sakte|aap\s+kya\s+kar\s+sakte|capabilities|features)\b/.test(normalized)) {
    return "Main questions answer kar sakta hoon, concepts explain kar sakta hoon, coding/math mein help, writing/translation aur problem-solving kar sakta hoon."
  }

  // Lightweight local fallback: common A-Z everyday intents + arithmetic when the API is unavailable.
  const arithmetic = normalized.replace(/,/g, "").replace(/\b(what is|calculate|solve|kitna|find)\b/g, "").trim()
  if (/^[0-9+\-*/().%\s]+$/.test(arithmetic) && /[0-9]/.test(arithmetic)) {
    try {
      const result = Function('"use strict"; return (' + arithmetic + ')')()
      if (Number.isFinite(result)) return "Answer: " + result
    } catch {}
  }

  // Exact/specific topic matching. Avoid broad single-word matches such as
  // "help", "work", "life" and "play", which caused unrelated replies.
  const specificRules = [
    [/\b(joke|funny|hasi|majak)\b/, "Why don't programmers like nature? It has too many bugs! 🐛"],
    [/\b(time|date|aaj\s+kya|time\s+kya)\b/, `Current time is: ${new Date().toLocaleTimeString()}\\nToday's date is: ${new Date().toLocaleDateString()}`],
    [/\b(weather|mausam|temperature)\b/, "I don't have real-time weather data."],
    [/\b(coding|code|programming|developer|javascript|python|react|nextjs|html|css|sql|database|api|debug|bug|error)\b/, "Haan, coding mein help kar sakta hoon. Apna code, error ya requirement bhejo."],
    [/\b(math|mathematics|calculation|equation|algebra|geometry|percentage)\b|^[0-9+\\-*/().%\\s]+$/, "Math problem bhejo — main calculation step-by-step solve karunga."],
    [/\b(write|rewrite|email|essay|article|story|caption|translate|grammar)\b/, "Haan, writing/translation mein help kar sakta hoon. Text ya requirement bhejo."],
    [/\b(study|exam|learning|education)\b/, "Haan, study mein help kar sakta hoon — concept, notes, examples ya questions bhejo."],
    [/\b(thanks|thank\s+you|shukriya|dhanyavad)\b/, "You're welcome! 😊"],
    [/\b(bye|goodbye|see\s+you|alvida)\b/, "Bye! 👋"]
  ]

  for (const [pattern, answer] of specificRules) {
    if (pattern.test(normalized)) return answer
  }

  return "Haan, main Himo hoon. Apna question seedha batao — main usi ka answer dunga."
}

export function shouldUseWebSearch(question) {
  const q = String(question || "").toLowerCase().trim()
  if (!q) return false

  const signals = [
    /\b(latest|breaking|current|right now|just now|today|tonight|this week|this month|recent|recently|2026)\b/,
    /\b(aaj|abhi|filhaal|vartamaan|taaza|nayi|naya)\b/,
    /\b(news|weather|mausam|temperature|forecast|score|live score|stock price|share price|crypto price|bitcoin price|exchange rate)\b/,
    /\b(search|google|web|internet|online)\s+(for|about|me|karo|kar|search)\b/,
    /\b(find|lookup|look up|search)\b.*\b(for|about|me|online|internet)\b/
  ]

  return signals.some((pattern) => pattern.test(q))
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
