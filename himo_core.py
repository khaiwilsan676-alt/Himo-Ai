import json
import os
import re
import math
import time

MEMORY_DB = "himo_memory.json"

class CognitiveBrain:
    def __init__(self):
        self.memory = {
            "facts": {},
            "relations": [],
            "qa_memory": {
                "who are you": "Main Himo AI hoon — ek adaptive cognitive mind jo continuously seekhta aur evolve hota hai!",
                "hello himo": "Yo! Himo is fully active. Kya chal raha hai?",
                "what can you do": "Main context yaad rakhta hoon, complex logic deduce karta hoon, aur continuous seekh sakta hoon.",
                "kaise ho": "Main ekdum badhiya aur high performance mode mein hoon! Tum batao?"
            }
        }
        self.conversation_history = []  # Multi-turn episodic memory
        self.last_subject = None
        self.load_memory()

    def save_memory(self):
        with open(MEMORY_DB, "w") as f:
            json.dump(self.memory, f, indent=2)

    def load_memory(self):
        if os.path.exists(MEMORY_DB):
            with open(MEMORY_DB, "r") as f:
                saved = json.load(f)
            if "facts" in saved:
                self.memory["facts"].update(saved["facts"])
            if "relations" in saved:
                self.memory["relations"] = saved["relations"]
            if "qa_memory" in saved:
                self.memory["qa_memory"].update(saved["qa_memory"])
        self.save_memory()

    def tokenize(self, text):
        return re.findall(r'\b\w+\b', text.lower())

    def get_similarity(self, text1, text2):
        tokens1 = set(self.tokenize(text1))
        tokens2 = set(self.tokenize(text2))
        if not tokens1 or not tokens2:
            return 0.0
        intersection = tokens1.intersection(tokens2)
        return len(intersection) / math.sqrt(len(tokens1) * len(tokens2))

    def resolve_context(self, text):
        clean = text.strip()
        if self.last_subject:
            # Resolves pronouns to current topic
            clean = re.sub(r'\b(it|this|that|ye|yeh|iska|iski|isme)\b', self.last_subject, clean, flags=re.IGNORECASE)
        return clean

    def handle_slang_and_greetings(self, text):
        clean = text.lower().strip()
        
        # Casual Slangs & Chat Checks
        if re.search(r'\b(bhai|bro|buddy|yaar)\b', clean):
            if any(w in clean for w in ["kaisa hai", "kaise ho", "how are you", "kya haal"]):
                return "Ekdum solid bhai! Aaj kya build kar rahe hain?"
            if any(w in clean for w in ["sahi hai", "mast", "op", "nice", "great", "badhiya"]):
                return "Shukriya bhai! Main continuously improve kar raha hoon."

        if any(clean == w for w in ["hi", "hello", "hey", "himo", "yo", "namaste", "suno"]):
            return "Hey! Himo is here. Batao kya query hai?"

        if any(clean == w for w in ["thanks", "thank you", "shukriya", "dhanyawad"]):
            return "Anytime! Hamesha ready hoon assist karne ke liye."

        return None

    def extract_and_learn(self, text):
        clean = text.strip()

        # Direct explicit training: "When I say X say Y"
        match = re.search(r"when\s+i\s+say\s+(.+?)\s+(?:you\s+)?say\s+(.+)", clean, re.IGNORECASE)
        if match:
            q = match.group(1).strip().lower()
            a = match.group(2).strip()
            self.memory["qa_memory"][q] = a
            self.save_memory()
            return f"Understood! Jab tum '{q}' bologe, main bolunga: '{a}'"

        # Identity & Profile
        name_match = re.search(r"(?:my\s+name\s+is|mera\s+naam\s+hai|mera\s+naam)\s+([\w\s]+)", clean, re.IGNORECASE)
        if name_match:
            name = name_match.group(1).strip().replace("hai", "").strip()
            self.memory["facts"]["user_name"] = name
            self.save_memory()
            return f"Got it! Maine save kar liya hai ki tumhara naam {name} hai."

        like_match = re.search(r"(?:i\s+like|mujhe\s+pasand\s+hai)\s+([\w\s,]+)", clean, re.IGNORECASE)
        if like_match:
            pref = like_match.group(1).strip().replace("hai", "").strip()
            self.memory["facts"]["preference"] = pref
            self.save_memory()
            return f"Noted! Tumhe {pref} pasand hai."

        # Knowledge Triplet Linking
        is_query = any(clean.lower().startswith(w) for w in ["what", "who", "how", "does", "kya", "kaun", "batao", "explain"])
        if not is_query:
            rel_pattern = r"([\w\s\-]+?)\s+(is based on|is a|is an|is|uses|requires|has|features|supports|runs on|contains)\s+([\w\s\-]+)"
            rel_match = re.search(rel_pattern, clean, re.IGNORECASE)
            if rel_match:
                sub = rel_match.group(1).strip().lower()
                rel = rel_match.group(2).strip().lower()
                obj = rel_match.group(3).strip().lower()

                self.last_subject = sub
                exists = any(r["subject"] == sub and r["relation"] == rel and r["object"] == obj for r in self.memory["relations"])
                if not exists:
                    self.memory["relations"].append({"subject": sub, "relation": rel, "object": obj})
                    self.save_memory()
                    return f"Knowledge Synapse Linked: [{sub}] --({rel})--> [{obj}]"
                return f"Ye toh mujhe pehle se pata hai: [{sub}] {rel} [{obj}]."

        return None

    def query_graph(self, query):
        clean = query.lower().strip()

        # Multi-hop Forward Deduction
        fwd_match = re.search(r"(?:what\s+is|tell\s+me\s+about|who\s+is|kya\s+hai|batao)\s+([\w\s\-]+)", clean)
        if fwd_match:
            target = fwd_match.group(1).strip().replace("kya hai", "").strip()
            self.last_subject = target
            direct_facts = [r for r in self.memory["relations"] if r["subject"] == target]
            if direct_facts:
                deductions = []
                for fact in direct_facts:
                    intermediate = fact["object"]
                    rel1 = fact["relation"]
                    second_hops = [r for r in self.memory["relations"] if r["subject"] == intermediate]
                    if second_hops:
                        for hop2 in second_hops:
                            deductions.append(f"{target.capitalize()} {rel1} {intermediate}, which {hop2['relation']} {hop2['object']}")
                    else:
                        deductions.append(f"{target.capitalize()} {rel1} {intermediate}")
                return ". ".join(deductions) + "."

        # Reverse Queries
        rev_match = re.search(r"what\s+(uses|has|requires|supports)\s+([\w\s\-]+)", clean)
        if rev_match:
            rel = rev_match.group(1).strip()
            target_obj = rev_match.group(2).strip()
            matches = [r["subject"] for r in self.memory["relations"] if r["relation"] == rel and r["object"] == target_obj]
            if matches:
                return f"{', '.join(m.capitalize() for m in matches)} {rel} {target_obj}."

        # Truth Verification
        verify_match = re.search(r"(?:does|is)\s+([\w\s\-]+?)\s+(use|have|support|based on|a|an)\s+([\w\s\-]+)", clean)
        if verify_match:
            sub = verify_match.group(1).strip()
            obj = verify_match.group(3).strip()
            for r in self.memory["relations"]:
                if r["subject"] == sub and obj in r["object"]:
                    return f"Haan bilkul! {sub} {r['relation']} {r['object']}."
            return f"Mere current knowledge graph mein {sub} aur {obj} ka direct link nahi hai."

        return None

    def think_and_reply(self, user_text):
        resolved_text = self.resolve_context(user_text)

        # 1. Slang & Conversational Response
        slang_reply = self.handle_slang_and_greetings(user_text)
        if slang_reply:
            self._track(user_text, slang_reply)
            return slang_reply

        # 2. Extract & Learn New Synapses
        learn_feedback = self.extract_and_learn(resolved_text)
        if learn_feedback:
            self._track(user_text, learn_feedback)
            return learn_feedback

        # 3. User Identity Check
        if any(w in resolved_text.lower() for w in ["what is my name", "who am i", "mera naam kya hai", "mera naam"]):
            name = self.memory["facts"].get("user_name")
            ans = f"Aapka naam {name} hai." if name else "Aapne abhi tak mujhe apna naam nahi bataya."
            self._track(user_text, ans)
            return ans

        if any(w in resolved_text.lower() for w in ["what do i like", "mujhe kya pasand hai"]):
            pref = self.memory["facts"].get("preference")
            ans = f"Aapko {pref} pasand hai." if pref else "Aapne apni pasand abhi tak share nahi ki."
            self._track(user_text, ans)
            return ans

        # 4. Knowledge Graph Reasoning
        graph_reply = self.query_graph(resolved_text)
        if graph_reply:
            self._track(user_text, graph_reply)
            return graph_reply

        # 5. Semantic Memory Recall
        best_match = None
        highest_score = 0.0
        for pattern, response in self.memory["qa_memory"].items():
            score = self.get_similarity(resolved_text, pattern)
            if score > highest_score:
                highest_score = score
                best_match = response

        if highest_score >= 0.35 and best_match:
            self._track(user_text, best_match)
            return best_match

        # 6. Natural Intelligent Fallback
        fallback = f"Maine '{resolved_text}' process kiya. Agar ye koi fact hai toh mujhe sikha do jaise 'X is Y' ya 'When I say {resolved_text} say <answer>'."
        self._track(user_text, fallback)
        return fallback

    def _track(self, user_msg, ai_msg):
        self.conversation_history.append({"user": user_msg, "himo": ai_msg, "timestamp": time.time()})
        if len(self.conversation_history) > 10:
            self.conversation_history.pop(0)

mind = CognitiveBrain()

if __name__ == "__main__":
    print("="*50)
    print("  HIMO COGNITIVE BRAIN v5.0 (AI COMPANION ENGINE)")
    print("="*50)
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            break
        if not user_input:
            continue
        print(f"Himo: {mind.think_and_reply(user_input)}")
