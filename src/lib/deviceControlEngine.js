// Deep Link Schemes & Universal Web Intents for Direct App Launching

const APP_SCHEMES = {
  whatsapp: ["whatsapp://", "https://wa.me/"],
  youtube: ["vnd.youtube://", "youtube://", "https://youtube.com"],
  instagram: ["instagram://", "https://instagram.com"],
  facebook: ["fb://", "https://facebook.com"],
  twitter: ["twitter://", "x://", "https://twitter.com"],
  x: ["twitter://", "x://", "https://twitter.com"],
  telegram: ["tg://", "https://t.me/"],
  snapchat: ["snapchat://", "https://snapchat.com"],
  spotify: ["spotify://", "https://open.spotify.com"],
  gmail: ["googlegmail://", "mailto:"],
  mail: ["mailto:"],
  maps: ["geo:0,0?q=", "google.navigation:q=", "https://maps.google.com"],
  camera: ["intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end", "camera:"],
  calculator: ["intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end", "calculator:"],
  dialer: ["tel:"],
  phone: ["tel:"],
  settings: ["intent:#Intent;action=android.settings.SETTINGS;end"]
};

export function handleDeviceControl(query) {
  if (!query || typeof query !== "string") return null;
  const q = query.toLowerCase().trim();

  // Match: "open whatsapp", "launch youtube", "open instagram", "kholo camera"
  const openMatch = q.match(/(?:open|launch|start|chalu karo|kholo)\s+([a-z0-9_\s]+)/i);
  if (!openMatch && !q.startsWith("call ") && !q.startsWith("dial ")) return null;

  let targetApp = "";
  if (openMatch) {
    targetApp = openMatch[1].replace(/app|application/gi, "").trim();
  } else if (q.startsWith("call ") || q.startsWith("dial ")) {
    targetApp = "dialer";
  }

  const matchedKey = Object.keys(APP_SCHEMES).find(key => targetApp.includes(key) || key.includes(targetApp));

  if (matchedKey && APP_SCHEMES[matchedKey]) {
    const urls = APP_SCHEMES[matchedKey];
    
    // Attempt Direct Native Launch
    if (typeof window !== "undefined") {
      try {
        window.location.href = urls[0];
      } catch (e) {
        if (urls[1]) window.open(urls[1], "_blank");
      }
    }

    return `Opening ${targetApp.toUpperCase()} on your device...`;
  }

  // Generic fallback: Try universal intent if app name not in map
  if (targetApp && typeof window !== "undefined") {
    window.location.href = `intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${targetApp};end`;
    return `Trying to launch ${targetApp}...`;
  }

  return null;
}
