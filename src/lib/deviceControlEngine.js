// Advanced Mobile & Web App Launcher Engine with Strict Triggering

const APP_LAUNCH_MAP = {
  whatsapp: {
    intent: "intent:#Intent;package=com.whatsapp;scheme=whatsapp;end",
    scheme: "whatsapp://send",
    web: "https://api.whatsapp.com/send"
  },
  youtube: {
    intent: "intent:#Intent;package=com.google.android.youtube;scheme=vnd.youtube;end",
    scheme: "vnd.youtube://",
    web: "https://youtube.com"
  },
  instagram: {
    intent: "intent:#Intent;package=com.instagram.android;scheme=instagram;end",
    scheme: "instagram://app",
    web: "https://instagram.com"
  },
  facebook: {
    intent: "intent:#Intent;package=com.facebook.katana;scheme=fb;end",
    scheme: "fb://",
    web: "https://facebook.com"
  },
  twitter: {
    intent: "intent:#Intent;package=com.twitter.android;scheme=twitter;end",
    scheme: "twitter://",
    web: "https://twitter.com"
  },
  x: {
    intent: "intent:#Intent;package=com.twitter.android;scheme=twitter;end",
    scheme: "twitter://",
    web: "https://x.com"
  },
  telegram: {
    intent: "intent:#Intent;package=org.telegram.messenger;scheme=tg;end",
    scheme: "tg://",
    web: "https://t.me"
  },
  snapchat: {
    intent: "intent:#Intent;package=com.snapchat.android;scheme=snapchat;end",
    scheme: "snapchat://",
    web: "https://snapchat.com"
  },
  spotify: {
    intent: "intent:#Intent;package=com.spotify.music;scheme=spotify;end",
    scheme: "spotify://",
    web: "https://open.spotify.com"
  },
  gmail: {
    intent: "intent:#Intent;package=com.google.android.gm;scheme=mailto;end",
    scheme: "mailto:",
    web: "https://mail.google.com"
  },
  maps: {
    intent: "intent:#Intent;package=com.google.android.apps.maps;scheme=geo;end",
    scheme: "geo:0,0?q=",
    web: "https://maps.google.com"
  },
  calculator: {
    intent: "intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end",
    scheme: "calculator:",
    web: null
  },
  settings: {
    intent: "intent:#Intent;action=android.settings.SETTINGS;end",
    scheme: null,
    web: null
  },
  wifi: {
    intent: "intent:#Intent;action=android.settings.WIFI_SETTINGS;end",
    scheme: null,
    web: null
  }
};

function dispatchLaunchUrl(url) {
  if (typeof window === "undefined" || !url) return;
  try {
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
  } catch (e) {
    window.location.href = url;
  }
}

export async function handleDeviceAction(query, cameraTriggerCallback, screenshotCallback) {
  if (!query || typeof query !== "string") return null;
  const q = query.toLowerCase().trim();

  // 1. Screenshot Triggers ("take a screenshot", "take a screen shot", "screenshot lo")
  if (
    q.includes("screenshot") || 
    q.includes("screen shot") || 
    q.includes("capture screen")
  ) {
    if (screenshotCallback) {
      screenshotCallback();
      return "Taking Screenshot of current screen...";
    }
  }

  // 2. Camera / Picture Triggers ("take a picture", "open camera")
  if (
    q.includes("picture") || 
    q.includes("photo") || 
    q.includes("camera")
  ) {
    if (q.includes("take") || q.includes("click") || q.includes("open") || q.includes("kholo") || q.includes("khicho")) {
      if (cameraTriggerCallback) {
        cameraTriggerCallback();
        return "Opening Camera to take picture...";
      }
    }
  }

  // 3. Strict App Opening Rule: ONLY when command starts with 'open', 'launch', 'kholo', 'start'
  const isExplicitOpenCommand = /^(?:open|launch|start|kholo|chalu\s+karo)\b/i.test(q);
  if (!isExplicitOpenCommand) {
    return null; // Don't trigger if it's just a general question about an app
  }

  // Remove command & filler words: "open", "launch", "kholo", "my", "the", "mera", "meri", "app", "please"
  const cleanedTarget = q
    .replace(/^(open|launch|start|kholo|chalu\s+karo)\s+/i, "")
    .replace(/\b(my|the|mera|meri|apna|apni|app|application|please)\b/gi, "")
    .replace(/[?!.,]/g, "")
    .trim();

  if (!cleanedTarget) return null;

  // Match target app
  const matchedKey = Object.keys(APP_LAUNCH_MAP).find(
    key => cleanedTarget.includes(key) || key.includes(cleanedTarget)
  );

  if (matchedKey) {
    const appConfig = APP_LAUNCH_MAP[matchedKey];
    dispatchLaunchUrl(appConfig.intent || appConfig.scheme || appConfig.web);
    return `Opening ${matchedKey.toUpperCase()}...`;
  }

  // Generic direct package launcher fallback
  dispatchLaunchUrl(`intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${cleanedTarget};end`);
  return `Trying to open ${cleanedTarget}...`;
}
