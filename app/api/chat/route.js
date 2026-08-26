import { NextResponse } from "next/server";

let memoryStore = {
  facts: {
    user_name: "Gagandeep",
    preference: "Next.js, UI engineering & Dark mode apps",
  },
  relations: [
    { subject: "nextjs", relation: "is based on", object: "react" },
    { subject: "react", relation: "is a", object: "javascript framework" },
    { subject: "javascript", relation: "is a", object: "web programming language" },
    { subject: "nextjs", relation: "uses", object: "typescript" },
    { subject: "nextjs", relation: "requires", object: "nodejs" },
  ],
  qaMemory: {
    "who are you": "Main Himo AI hoon — aapka personalized adaptive cognitive intelligence!",
    "hello himo": "Yo! Himo is live on Vercel Cloud 24/7. Kya build kar rahe hain aaj?",
    "what can you do": "Main context yaad rakhta hoon, complex logic deduce karta hoon, aur multi-hop relationships traverse karta hoon.",
    "kaise ho": "Ekdum mast! Cloud par high-speed execute ho raha hoon.",
  },
  lastSubject: null,
};

function tokenize(text) {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function getSimilarity(text1, text2) {
  const t1 = new Set(tokenize(text1));
  const t2 = new Set(tokenize(text2));
  if (!t1.size || !t2.size) return 0;
  const intersection = new Set([...t1].filter((x) => t2.has(x)));
  return intersection.size / Math.sqrt(t1.size * t2.size);
}

function processHimoBrain(userInput) {
  let clean = userInput.trim();

  if (memoryStore.lastSubject) {
    clean = clean.replace(/\b(it|this|that|ye|yeh|iska|isme)\b/gi, memoryStore.lastSubject);
  }

  const lower = clean.toLowerCase();
  if (/\b(bhai|bro|buddy|yaar)\b/.test(lower)) {
    if (/kaisa hai|kaise ho|how are you|kya haal/.test(lower)) {
      return "Ekdum solid bhai! Vercel cloud par 24/7 live chal raha hoon.";
    }
    if (/sahi hai|mast|op|nice|great|badhiya/.test(lower)) {
      return "Shukriya bhai! Himo hamesha ready hai.";
    }
  }

  if (["hi", "hello", "hey", "himo", "yo", "namaste", "hi himo"].includes(lower)) {
    return "Hey! Himo Cloud Engine is active. Batao kya query hai?";
  }

  const teachMatch = clean.match(/when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)/i);
  if (teachMatch) {
    const q = teachMatch[1].trim().toLowerCase();
    const a = teachMatch[2].trim();
    memoryStore.qaMemory[q] = a;
    return `Learned! Jab aap poochoge '${q}', main bolunga: '${a}'`;
  }

  const nameMatch = clean.match(/(?:my\s+name\s+is|mera\s+naam\s+hai|mera\s+naam)\s+([\w\s]+)/i);
  if (nameMatch) {
    const name = nameMatch[1].replace(/hai/gi, "").trim();
    memoryStore.facts["user_name"] = name;
    return `Understood! Maine yaad rakh liya ki aapka naam ${name} hai.`;
  }

  if (/what is my name|who am i|mera naam kya hai|mera naam/i.test(lower)) {
    const name = memoryStore.facts["user_name"];
    return name ? `Aapka naam ${name} hai.` : "Aapne abhi tak mujhe apna naam nahi bataya.";
  }

  if (/what do i like|mujhe kya pasand hai/i.test(lower)) {
    const pref = memoryStore.facts["preference"];
    return pref ? `Aapko ${pref} pasand hai.` : "Aapne apni pasand share nahi ki hai.";
  }

  const isQuery = /^(what|who|how|does|kya|kaun|batao|explain)/i.test(clean);
  if (!isQuery) {
    const relMatch = clean.match(
      /([\w\s\-]+?)\s+(is based on|is a|is an|is|uses|requires|has|features|supports|runs on)\s+([\w\s\-]+)/i
    );
    if (relMatch) {
      const sub = relMatch[1].trim().toLowerCase();
      const rel = relMatch[2].trim().toLowerCase();
      const obj = relMatch[3].trim().toLowerCase();

      memoryStore.lastSubject = sub;
      const exists = memoryStore.relations.some(
        (r) => r.subject === sub && r.relation === rel && r.object === obj
      );
      if (!exists) {
        memoryStore.relations.push({ subject: sub, relation: rel, object: obj });
        return `Knowledge Synapse Linked: [${sub}] --(${rel})--> [${obj}]`;
      }
      return `Ye fact mere knowledge base mein already exist karta hai: [${sub}] ${rel} [${obj}].`;
    }
  }

  const fwdMatch = clean.match(/(?:what\s+is|tell\s+me\s+about|who\s+is|kya\s+hai|batao)\s+([\w\s\-]+)/i);
  if (fwdMatch) {
    const target = fwdMatch[1].replace(/kya hai/gi, "").trim().toLowerCase();
    memoryStore.lastSubject = target;
    const directFacts = memoryStore.relations.filter((r) => r.subject === target);
    if (directFacts.length > 0) {
      const deductions = directFacts.map((fact) => {
        const intermediate = fact.object;
        const secondHops = memoryStore.relations.filter((r) => r.subject === intermediate);
        if (secondHops.length > 0) {
          const hop2 = secondHops[0];
          return `${target.toUpperCase()} ${fact.relation} ${intermediate}, which ${hop2.relation} ${hop2.object}`;
        }
        return `${target.toUpperCase()} ${fact.relation} ${intermediate}`;
      });
      return deductions.join(". ") + ".";
    }
  }

  const revMatch = clean.match(/what\s+(uses|has|requires|supports)\s+([\w\s\-]+)/i);
  if (revMatch) {
    const rel = revMatch[1].trim().toLowerCase();
    const targetObj = revMatch[2].trim().toLowerCase();
    const matches = memoryStore.relations
      .filter((r) => r.relation === rel && r.object === targetObj)
      .map((r) => r.subject.toUpperCase());
    if (matches.length > 0) {
      return `${matches.join(", ")} ${rel} ${targetObj}.`;
    }
  }

  let bestMatch = null;
  let highestScore = 0;
  for (const [pattern, response] of Object.entries(memoryStore.qaMemory)) {
    const score = getSimilarity(clean, pattern);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = response;
    }
  }

  if (highestScore >= 0.35 && bestMatch) {
    return bestMatch;
  }

  return `Maine '${clean}' process kiya. Agar ye koi fact hai toh format mein likho: 'X is Y' ya 'When I say ${clean} say <answer>'.`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";

    if (!message.trim()) {
      return NextResponse.json({ reply: "Message cannot be empty." }, { status: 400 });
    }

    const reply = processHimoBrain(message);
    return NextResponse.json({ reply, active_subject: memoryStore.lastSubject });
  } catch (error) {
    return NextResponse.json({ reply: "Internal Server Error in Himo Brain." }, { status: 500 });
  }
}
