export const aiKnowledgeBase = [
  // General & Identity
  {
    id: "what-is-ai",
    category: "General",
    keywords: ["what is ai", "artificial intelligence kya hai", "define ai", "what's ai"],
    question: "What is AI?",
    answer: "Artificial Intelligence (AI) refers to computer systems engineered to simulate human intelligence. This includes learning from patterns, reasoning, problem-solving, speech recognition, and visual perception."
  },
  {
    id: "who-are-you",
    category: "General",
    keywords: ["who are you", "who made you", "aap kaun ho", "tum kaun ho", "what is himo"],
    question: "Who created you and what can you do?",
    answer: "I am Himo, an intelligent creative workspace assistant. I can assist you with writing, code generation, debugging, logic design, project ideation, and problem-solving across multiple domains."
  },

  // Web & Full-Stack Development
  {
    id: "react-vs-nextjs",
    category: "Code",
    keywords: ["difference between react and nextjs", "react vs next", "nextjs kyu use kare"],
    question: "What is the difference between React and Next.js?",
    answer: "React is a client-side JavaScript library for building user interfaces. Next.js is a full-stack framework built on top of React that introduces Server-Side Rendering (SSR), Static Site Generation (SSG), file-based API routing, and automatic image optimization."
  },
  {
    id: "use-effect-guide",
    category: "Code",
    keywords: ["how does useeffect work", "useeffect kya hai", "react useeffect"],
    question: "How does useEffect work in React?",
    answer: "The `useEffect` hook allows functional components to execute side effects (like data fetching, manual DOM mutations, or subscriptions) after rendering. You can manage execution timing using the dependency array."
  },
  {
    id: "var-let-const",
    category: "Code",
    keywords: ["difference between var let const", "var vs let vs const", "javascript variables"],
    question: "What is the difference between var, let, and const in JavaScript?",
    answer: "`var` is function-scoped and hoisted. `let` and `const` are block-scoped; `let` permits value reassignment, whereas `const` requires an initial assignment and prevents identifier reassignment."
  },
  {
    id: "async-await",
    category: "Code",
    keywords: ["what is async await", "promises vs async await", "javascript async"],
    question: "What is async/await in JavaScript?",
    answer: "`async/await` is syntactic sugar over JavaScript Promises. It allows asynchronous, non-blocking code to be written and structured cleanly like synchronous code using `try...catch` blocks."
  },

  // Science, Tech & Computing
  {
    id: "quantum-computing",
    category: "Science",
    keywords: ["explain quantum computing", "quantum computer kya hai", "superposition"],
    question: "Explain quantum computing simply",
    answer: "Traditional computers process information using classical bits (0 or 1). Quantum computers use qubits, which leverage quantum phenomena like superposition and entanglement to represent multiple states simultaneously, speeding up complex computational simulations."
  },
  {
    id: "what-is-an-api",
    category: "Tech",
    keywords: ["what is an api", "api kaise kaam karti hai", "rest api"],
    question: "What is an API and how does it work?",
    answer: "An Application Programming Interface (API) is a set of rules and protocols enabling software applications to communicate. It acts as an intermediary, processing client requests and returning server responses in formats like JSON."
  },

  // Everyday Productivity & Concepts
  {
    id: "pomodoro-technique",
    category: "Productivity",
    keywords: ["pomodoro technique", "time management technique", "focus study method"],
    question: "What is the Pomodoro Technique?",
    answer: "The Pomodoro Technique is a time-management method that breaks work into 25-minute uninterrupted intervals separated by 5-minute short breaks. After completing four cycles, you take a longer 15–30 minute rest."
  },
  {
    id: "why-sky-is-blue",
    category: "General",
    keywords: ["why is the sky blue", "aakash neela kyu hota hai", "rayleigh scattering"],
    question: "Why is the sky blue?",
    answer: "Sunlight contains all colors of the visible spectrum. When sunlight enters Earth's atmosphere, shorter blue wavelengths scatter significantly more than other colors due to gases and particles (Rayleigh scattering)."
  }
]

export function findPredefinedAnswer(query) {
  if (!query || typeof query !== "string") return null
  const cleaned = query.toLowerCase().trim()

  for (const item of aiKnowledgeBase) {
    if (cleaned === item.question.toLowerCase().trim()) {
      return item.answer
    }
    const keywordMatch = item.keywords.some((kw) => cleaned.includes(kw) || kw.includes(cleaned))
    if (keywordMatch) {
      return item.answer
    }
  }

  return null
}
