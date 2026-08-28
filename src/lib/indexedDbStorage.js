const DB_NAME = "HimoOmniDB";
const DB_VERSION = 2;
const STORE_CHATS = "chat_sessions";
const STORE_TRAINED_BRAIN = "newton_brain_memory";

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return resolve(null);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_CHATS)) {
        db.createObjectStore(STORE_CHATS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_TRAINED_BRAIN)) {
        db.createObjectStore(STORE_TRAINED_BRAIN, { keyPath: "topic" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function saveChatToDB(chatObj) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CHATS, "readwrite");
      const store = tx.objectStore(STORE_CHATS);
      store.put(chatObj);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

export async function getAllChatsFromDB() {
  try {
    const db = await openDB();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CHATS, "readonly");
      const store = tx.objectStore(STORE_CHATS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function deleteChatFromDB(chatId) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CHATS, "readwrite");
      const store = tx.objectStore(STORE_CHATS);
      store.delete(chatId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

export async function saveTrainedKnowledge(topic, answer) {
  try {
    const db = await openDB();
    if (!db) return;
    const cleanTopic = topic.trim().toLowerCase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_TRAINED_BRAIN, "readwrite");
      const store = tx.objectStore(STORE_TRAINED_BRAIN);
      store.put({
        topic: cleanTopic,
        rawTopic: topic.trim(),
        answer: answer.trim(),
        trainedAt: Date.now()
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

export async function getTrainedKnowledge(query) {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_TRAINED_BRAIN, "readonly");
      const store = tx.objectStore(STORE_TRAINED_BRAIN);
      const req = store.getAll();
      req.onsuccess = () => {
        const memories = req.result || [];
        const cleanQ = query.trim().toLowerCase();
        const found = memories.find((m) => cleanQ.includes(m.topic) || m.topic.includes(cleanQ));
        resolve(found ? found.answer : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function deleteTrainedKnowledge(topicOrQuery) {
  try {
    const db = await openDB();
    if (!db) return null;
    const cleanQ = topicOrQuery.trim().toLowerCase();

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_TRAINED_BRAIN, "readwrite");
      const store = tx.objectStore(STORE_TRAINED_BRAIN);
      const req = store.getAll();

      req.onsuccess = () => {
        const memories = req.result || [];
        const target = memories.find(m => cleanQ.includes(m.topic) || m.topic.includes(cleanQ));
        if (target) {
          store.delete(target.topic);
          resolve(target.rawTopic || target.topic);
        } else {
          resolve(null);
        }
      };
      tx.oncomplete = () => {};
      tx.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function clearAllTrainedKnowledge() {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_TRAINED_BRAIN, "readwrite");
      const store = tx.objectStore(STORE_TRAINED_BRAIN);
      store.clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}
