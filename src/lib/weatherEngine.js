// ==========================================
// HIMO DYNAMIC WEATHER, CLIMATE & RAIN GLOBAL MASTER ENGINE
// ==========================================

export function getWeatherClimateInfo(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  // Trigger for Rain specific queries
  if (q.includes("rain") || q.includes("precipitation") || q.includes("rainfall") || q.includes("cloud") || q.includes("monsoon")) {
    
    if (q.includes("type") || q.includes("kinds")) {
    return `🌧️ **TYPES OF RAIN & PRECIPITATION (A to Z World Guide):**
1. **Convectional Rainfall:** Occurs due to intense surface heating (common in equatorial regions / afternoon thunderstorms).
2. **Orographic (Relief) Rainfall:** Happens when moisture-laden winds are forced to rise over mountain ranges, cooling and condensing on the windward side.
3. **Frontal (Cyclonic) Rainfall:** Formed when warm air masses collide with cold air masses, forcing the lighter warm air to rise over dense cold air.
4. **Other Forms:** Drizzle, Sleet, Hail, and Snow.`;
    }

    if (q.includes("world") || q.includes("highest") || q.includes("lowest") || q.includes("record") || q.includes("where")) {
    return `🌍 **WORLD RAINFALL RECORDS & DISTRIBUTION:**
• **Wettest Place on Earth:** Mawsynram and Cherrapunji (Meghalaya, India), receiving over 11,000+ mm of annual rainfall due to orographic lifting of monsoon winds from the Bay of Bengal.
• **Driest Places on Earth:** Atacama Desert (Chile) and the Dry Valleys (Antarctica), where some areas have seen virtually no rainfall for centuries.
• **Global Pattern:** Heavy rainfall concentrates near the equator (Intertropical Convergence Zone), while major deserts lie near 30° N/S latitudes due to descending dry air cells.`;
    }

    if (q.includes("acid rain")) {
    return `⚗️ **ACID RAIN DYNAMICS:**
• Caused by emissions of Sulfur Dioxide ($SO_2$) and Nitrogen Oxides ($NO_x$) from fossil fuel burning and industrial plants.
• These gases react with water molecules in the atmosphere to produce sulfuric and nitric acids.
• **Effects:** Lowers pH of soil and water bodies, damages forests, corrodes buildings and historical monuments (e.g., Taj Mahal).`;
    }

    if (q.includes("cloud seeding") || q.includes("artificial")) {
    return `🧪 **ARTIFICIAL RAIN & CLOUD SEEDING:**
• A weather modification technique to induce precipitation.
• Substances like Silver Iodide, Potassium Iodide, or Sodium Chloride (salt) are dispersed into clouds via aircraft or drones to act as condensation nuclei, forcing water droplets to coalesce and fall as rain.`;
    }

    // Comprehensive A to Z Universal Rain Master Breakdown
    return `🌧️ **RAIN & PRECIPITATION A to Z MASTER ENCYCLOPEDIA:**
Rain is liquid water in the form of droplets that have condensed from atmospheric water vapor and then become heavy enough to fall under gravity.
• **Formation Process (The Bergeron & Collision-Coalescence Processes):** 
  1. Evaporation from oceans and land creates atmospheric moisture.
  2. Warm air rises, cools, and water vapor condenses around microscopic particles (dust, salt, smoke) called cloud condensation nuclei.
  3. Droplets merge and grow until they exceed the upward buoyant force of air currents, falling to Earth as precipitation.
• **Global Significance:** Replenishes freshwater reservoirs, drives agriculture, regulates global temperatures, and balances the global water (hydrological) cycle.`;
  }

  // General Climate/Weather trigger fallback
  const isClimateQuery = 
    q.includes("weather") || q.includes("climate") || q.includes("atmosphere") || 
    q.includes("monsoon") || q.includes("greenhouse") || q.includes("global warming") || 
    q.includes("storm") || q.includes("cyclone") || q.includes("hurricane") || 
    q.includes("el nino") || q.includes("la nina") || q.includes("temperature") || 
    q.includes("wind") || q.includes("pressure") || q.includes("ozone");

  if (isClimateQuery) {
    return `🌍 **Himo Meteorological & Environmental Analysis:**
Regarding your query about **"${query}"**, this atmospheric mechanism is governed by fluid thermodynamics, solar radiation balance, and moisture transport. Meteorologists monitor these systems globally via satellite networks to predict environmental shifts with high precision.`;
  }

  return null;
}
