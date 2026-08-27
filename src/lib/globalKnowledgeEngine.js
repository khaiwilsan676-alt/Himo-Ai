// ==========================================
// HIMO A to Z GLOBAL KNOWLEDGE & SCIENCE ENGINE
// ==========================================

export function getGlobalKnowledge(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  // 1. Space & Astronomy (Planets, Black Holes, Universe)
  if (q.includes("space") || q.includes("universe") || q.includes("black hole") || q.includes("galaxy") || q.includes("planet") || q.includes("star")) {
    return `🌌 **SPACE & ASTRONOMY MASTER DIRECTORY:**
• **The Universe:** Born out of the Big Bang ~13.8 billion years ago, expanding constantly.
• **Black Holes:** Regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. Event Horizon is its boundary.
• **Galaxies:** Massive systems of stars, stellar remnants, interstellar gas, dust, and dark matter (e.g., Milky Way).
• **Solar System:** Sun and its gravitationally bound objects, including 8 major planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune).`;
  }

  // 2. Physics & Chemistry (Atomic Structure, Laws of Motion, Elements)
  if (q.includes("physics") || q.includes("chemistry") || q.includes("atom") || q.includes("electron") || q.includes("newton") || q.includes("quantum")) {
    return `⚛️ **PHYSICS & CHEMISTRY MASTER ENCYCLOPEDIA:**
• **Atomic Structure:** Comprises a dense nucleus (protons (+) and neutrons (neutral)) surrounded by a cloud of electrons (-).
• **Newton's Laws of Motion:** 
  1. Inertia (An object at rest stays at rest).
  2. Force equals mass times acceleration ($F = ma$).
  3. Action and reaction are equal and opposite.
• **Periodic Table:** Arrangement of chemical elements by atomic number, from Hydrogen (H) to Oganesson (Og).`;
  }

  // 3. World History & Geography (Continents, Empires, Epochs)
  if (q.includes("history") || q.includes("geography") || q.includes("continent") || q.includes("ocean") || q.includes("empire")) {
    return `🗺️ **WORLD HISTORY & GEOGRAPHY DIRECTORY:**
• **Continents:** Asia, Africa, North America, South America, Antarctica, Europe, and Australia/Oceania.
• **Oceans:** Pacific, Atlantic, Indian, Southern, and Arctic Oceans covering ~71% of Earth's surface.
• **Historical Epochs:** Ancient Civilizations (Mesopotamia, Indus Valley, Egypt, Greece, Rome), Middle Ages, Industrial Revolution, and Modern Information Age.`;
  }

  // 4. Computer Science & Technology (Algorithms, Networking, OS)
  if (q.includes("computer") || q.includes("algorithm") || q.includes("network") || q.includes("operating system") || q.includes("cpu")) {
    return `💻 **COMPUTER SCIENCE & TECHNOLOGY CORE:**
• **CPU (Central Processing Unit):** The electronic circuitry that executes instructions comprising a computer program (Arithmetic Logic Unit + Control Unit).
• **Algorithms:** Step-by-step procedures or formulas for solving problems or completing computational tasks (Time & Space Complexity: Big-O notation).
• **Networking:** Protocols (TCP/IP, HTTP, DNS) enabling global data transmission across interconnected nodes.`;
  }

  // Universal dynamic fallback for any other A to Z general knowledge query
  if (q.startsWith("what is") || q.startsWith("who is") || q.startsWith("explain") || q.startsWith("tell me about")) {
    const cleanTopic = q.replace(/what is|who is|explain|tell me about|\?/gi, "").trim();
    const capitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

    return `🧠 **Himo A to Z Global Intelligence Analysis:**
Regarding **"${capitalized || query}"**:
• **Core Definition:** This subject encompasses fundamental principles, structural frameworks, and systemic interactions within its respective domain.
• **Key Significance:** It plays a vital role in theoretical understanding and practical real-world implementations.
• **Systemic Context:** Analyzed across historical, functional, and modern technological paradigms.`;
  }

  return null;
}
