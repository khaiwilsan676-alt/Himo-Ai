export function generateAutomaticAnswer(query) {
  const q = query.toLowerCase().trim();
  const cleanTopic = q.replace(/what is|who is|how does|why do|explain|tell me about|\?/gi, "").trim();
  const capitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

  if (q.includes("why") || q.includes("how")) {
    return `🔬 **Himo Scientific Breakdown:**\nWhen examining **${cleanTopic}**, it operates through foundational laws of physics, chemistry, or natural mechanics. The underlying process involves systematic energy transfer, structural equilibrium, and cause-and-effect execution that drives the phenomenon forward.`;
  }

  if (q.includes("who") || q.includes("where") || q.includes("history")) {
    return `🏛️ **Himo Historical & Contextual Synthesis:**\n**${capitalized}** holds a significant position in structural chronology. It is defined by its core origin, developmental milestones, and lasting impact on its respective domain or environment.`;
  }

  if (q.includes("code") || q.includes("program") || q.includes("function") || q.includes("python") || q.includes("javascript")) {
    return `💻 **Himo Technical Synthesizer:**\n**${capitalized}** is a powerful architectural framework or concept in software engineering. It utilizes syntax parsing, modular logic, and runtime execution to build scalable digital solutions.\n\n\`\`\`javascript\n// Automatic snippet for ${cleanTopic}\nfunction execute${cleanTopic.replace(/\s+/g, '')}() {\n  return "Optimized logic active for ${cleanTopic}";\n}\nexecute${cleanTopic.replace(/\s+/g, '')}();\n\`\`\``;
  }

  return `🧠 **Himo Himo Response:**\nRegarding **"${capitalized}"**, our cognitive engine breaks this down into three core pillars:\n1. **Core Definition:** ${capitalized} represents a functional category with defined systemic properties.\n2. **Operational Mechanics:** It interacts directly with environmental or digital structures to produce measurable outcomes.\n3. **Utility:** Used extensively across modern applications for optimization and problem-solving.`;
}
