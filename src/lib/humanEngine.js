// ==========================================
// HIMO HUMAN BIOLOGY & ANATOMY MASTER ENGINE (A to Z)
// ==========================================

export function getHumanMasterInfo(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  const isHumanQuery = 
    q.includes("human") || q.includes("body") || q.includes("brain") || 
    q.includes("dna") || q.includes("cell") || q.includes("heart") || 
    q.includes("nervous system") || q.includes("skeleton") || q.includes("evolution") ||
    q.includes("anatomy") || q.includes("organ") || q.includes("blood");

  if (isHumanQuery) {
    if (q.includes("brain") || q.includes("nervous")) {
      return `🧠 **HUMAN BRAIN & NERVOUS SYSTEM (A to Z Breakdown):**
• **Cerebrum:** Controls higher functions like thinking, memory, voluntary muscle movement, and speech.
• **Cerebellum:** Regulates balance, posture, and fine motor coordination.
• **Brainstem (Medulla, Pons, Midbrain):** Controls vital involuntary functions like breathing, heart rate, and blood pressure.
• **Neurons:** The core building blocks of the nervous system (~86 billion neurons) transmitting electrical and chemical signals via synapses.`;
    }

    if (q.includes("dna") || q.includes("genetics") || q.includes("cell")) {
      return `🧬 **HUMAN GENETICS, DNA & CELLS:**
• **DNA (Deoxyribonucleic Acid):** Double-helix molecule carrying genetic instructions packaged into 23 pairs of chromosomes (46 total).
• **Cells:** The fundamental unit of life; an adult human body consists of ~30 trillion cells.
• **Key Organelles:** Nucleus (genetic command center), Mitochondria (powerhouse producing ATP), Ribosomes (protein synthesis).`;
    }

    if (q.includes("heart") || q.includes("blood") || q.includes("circulatory")) {
      return `❤️ **CIRCULATORY SYSTEM & HEART DYNAMICS:**
• **The Heart:** A muscular 4-chambered organ (2 atria, 2 ventricles) pumping ~7,500 liters of blood daily.
• **Blood Vessels:** Arteries (carry oxygenated blood away from heart), Veins (return deoxygenated blood), and Capillaries (site of gas/nutrient exchange).
• **Blood Components:** Red blood cells (oxygen transport), White blood cells (immunity), Platelets (clotting), and Plasma.`;
    }

    if (q.includes("evolution") || q.includes("origin")) {
      return `🌍 **HUMAN EVOLUTION & ANTHROPOLOGY:**
• **Scientific Classification:** *Homo sapiens*, belonging to the primate order and hominid family.
• **Evolutionary Timeline:** Diverged from common ancestors with chimpanzees ~6 to 7 million years ago. Key milestones include *Australopithecus*, *Homo habilis*, *Homo erectus*, and archaic *Homo sapiens* emerging in Africa ~300,000 years ago.`;
    }

    return `👤 **HUMAN BIOLOGY & ANATOMY MASTER ENCYCLOPEDIA:**
Humans are complex multicellular mammals characterized by advanced cognitive capabilities, bipedal locomotion, and complex social structures.
• **Major Systems:** Skeletal, Muscular, Nervous, Circulatory, Respiratory, Digestive, Endocrine, Immune, and Reproductive systems working in homeostasis to sustain life.`;
  }

  return null;
}
