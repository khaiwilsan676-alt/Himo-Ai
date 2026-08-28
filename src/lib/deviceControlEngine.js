// Advanced System Hardware & App Control Engine

const SYSTEM_INTENTS = {
  wifi: "intent:#Intent;action=android.settings.WIFI_SETTINGS;end",
  internet: "intent:#Intent;action=android.settings.WIRELESS_SETTINGS;end",
  network: "intent:#Intent;action=android.settings.DATA_ROAMING_SETTINGS;end",
  airplane: "intent:#Intent;action=android.settings.AIRPLANE_MODE_SETTINGS;end",
  bluetooth: "intent:#Intent;action=android.settings.BLUETOOTH_SETTINGS;end",
  settings: "intent:#Intent;action=android.settings.SETTINGS;end",
  camera: "intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end",
  display: "intent:#Intent;action=android.settings.DISPLAY_SETTINGS;end"
};

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
  maps: ["geo:0,0?q=", "google.navigation:q=", "https://maps.google.com"],
  calculator: ["intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end", "calculator:"],
  phone: ["tel:"],
  dialer: ["tel:"]
};

export async function handleDeviceAction(query, cameraTriggerCallback, screenshotCallback) {
  if (!query || typeof query !== "string") return null;
  const q = query.toLowerCase().trim();

  // 1. Take a Picture / Camera Capture
  if (
    q.includes("take a picture") || 
    q.includes("photo khicho") || 
    q.includes("click photo") || 
    q.includes("take picture") ||
    q.includes("capture image") ||
    q.includes("open camera") ||
    q.includes("camera kholo")
  ) {
    if (cameraTriggerCallback) {
      cameraTriggerCallback();
      return "Opening Camera to capture picture...";
    }
    if (typeof window !== "undefined") {
      window.location.href = SYSTEM_INTENTS.camera;
      return "Opening Camera...";
    }
  }

  // 2. Take a Screenshot
  if (
    q.includes("take a screenshot") || 
    q.includes("screenshot lo") || 
    q.includes("capture screen") || 
    q.includes("screenshot")
  ) {
    if (screenshotCallback) {
      screenshotCallback();
      return "Taking Screenshot of current screen...";
    }
  }

  // 3. Close Internet / Wi-Fi / Data Control
  if (
    q.includes("close internet") || 
    q.includes("turn off internet") || 
    q.includes("off internet") || 
    q.includes("band karo internet") ||
    q.includes("wifi off") ||
    q.includes("internet setting") ||
    q.includes("open wifi") ||
    q.includes("wifi settings")
  ) {
    if (typeof window !== "undefined") {
      window.location.href = SYSTEM_INTENTS.wifi;
    }
    return "Opening Wi-Fi & Network Settings to control internet...";
  }

  // 4. App Launchers
  const openMatch = q.match(/(?:open|launch|start|chalu karo|kholo)\s+([a-z0-9_\s]+)/i);
  if (openMatch) {
    const targetApp = openMatch[1].replace(/app|application/gi, "").trim();
    const matchedKey = Object.keys(APP_SCHEMES).find(key => targetApp.includes(key) || key.includes(targetApp));

    if (matchedKey && APP_SCHEMES[matchedKey]) {
      const urls = APP_SCHEMES[matchedKey];
      if (typeof window !== "undefined") {
        try {
          window.location.href = urls[0];
        } catch (e) {
          if (urls[1]) window.open(urls[1], "_blank");
        }
      }
      return `Opening ${targetApp.toUpperCase()}...`;
    }

    if (SYSTEM_INTENTS[targetApp]) {
      if (typeof window !== "undefined") {
        window.location.href = SYSTEM_INTENTS[targetApp];
      }
      return `Opening ${targetApp}...`;
    }
  }

  return null;
}
