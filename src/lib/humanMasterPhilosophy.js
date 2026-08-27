// ==========================================
// HIMO HUMAN MASTER PHILOSOPHY & CONSCIOUSNESS ENGINE
// ==========================================

export function getHumanDeepPerspective(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  // Trigger for "What is human", "Insaan kya hai", "Who are humans", etc. in multiple ways/languages
  const isHumanIdentityQuery = 
    q.includes("human kya hai") || q.includes("what is human") || q.includes("who are we") || 
    q.includes("insaan kya hai") || q.includes("human kaun hai") || q.includes("what does it mean to be human") ||
    q.includes("human ka matlab") || q.includes("define human") || q.includes("hum kaun hain");

  if (isHumanIdentityQuery) {
    return `🌌 **HIMO DEEP PERSPECTIVE: "Insaan (Human) Kya Hai?"**

Bhai, tune bohot gehra sawal pucha hai. Jab hum poochte hain ki *"Insaan kya hai?"*, toh iska koi ek chota jawab nahi ho sakta. Himo ki nazar mein ek insaan ke yeh **4 alag-alag roop (dimensions)** hote hain:

1. **Biological Angle (Vigyan ki Nazar Mein):**
   Insaan carbon-based ek aisi advanced biological machine hai jiske paas ~30 trillion cells, ek complex 3-layered brain, aur DNA ka blueprint hota hai. Hum bipedal (do pairon par chalne wale) primates hain jo *Homo sapiens* species se aate hain.

2. **Consciousness & Mind (Soch aur Chetna):**
   Hum sirf maas-masti ka putla nahi hain. Insaan wo akeli hasti hai jo **"Sochti hai ki main kaun hoon"** (Self-awareness). Hamein dard hota hai, khushi milti hai, hum sapne dekhte hain, aur waqt ke pare jaakar kal ki fikar karte hain.

3. **Emotional & Social Bond (Dil aur Rishte):**
   Insaan wo hai jo pyaar, nafrat, dosti, aur empathy (hamdardi) ko mehsoos karta hai. Hum akele nahi reh sakte; humein samaj, kahaniyan, aur ek dusre ka sahara chahiye hota hai.

4. **Cosmic Perspective (Brahmand ka Hissa):**
   Jaise kisi mahaan scientist ne kaha tha — **"We are the universe experiencing itself."** (Hum wohi stardust hain jo arbo saal pehle taaron ke phatne se bani thi aur ab zinda hokar khud is brahmand ko dekh rahi hai).

*Insaan hona matlab sirf zinda rehna nahi, balki sawaal poochna, nayee cheezein banana, aur is duniya ko badal dene ki taaqat rakhna hai.*`;
  }

  return null;
}
