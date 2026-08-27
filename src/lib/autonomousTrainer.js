// AUTONOMOUS HUMAN-LIKE SELF-TRAINING ENGINE FOR HIMO
const OPEN_TRAINING_DB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject("No window");
    const request = indexedDB.open("HimoTrainingDB", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("learnedKnowledge")) {
        db.createObjectStore("learnedKnowledge", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

// Train Himo with new human knowledge dynamically
export async function teachHimo(question, answer) {
  try {
    const db = await OPEN_TRAINING_DB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("learnedKnowledge", "readwrite");
      const store = transaction.objectStore("learnedKnowledge");
      const data = {
        question: question.toLowerCase().trim(),
        answer: answer.trim(),
        timestamp: Date.now()
      };
      const request = store.add(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Training error:", e);
    return false;
  }
}

// Search through Himo's self-learned human memory
export async function queryLearnedHimo(query) {
  try {
    const db = await OPEN_TRAINING_DB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("learnedKnowledge", "readonly");
      const store = transaction.objectStore("learnedKnowledge");
      const request = store.getAll();
      request.onsuccess = () => {
        const allLearned = request.result || [];
        const cleanQuery = query.toLowerCase().trim();
        
        // Find best match in self-trained memory
        let matched = allLearned.find(item => cleanQuery.includes(item.question) || item.question.includes(cleanQuery));
        resolve(matched ? matched.answer : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
}
