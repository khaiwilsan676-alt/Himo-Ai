// Ultra-complete Math Master Engine for all operations including Percentage, Trig, Powers & Complex expressions

const MathMasterEngine = {
  // Main Solve Handler
  evaluate: function (query) {
    if (!query || typeof query !== "string") return null;

    let q = query.trim().toLowerCase();

    // 1. Percentage Natural Language Parsing: "20% of 500", "what is 15% of 80", "500 + 10%"
    // Example: "20% of 500" -> (20 / 100) * 500
    if (q.includes("% of") || q.includes("percent of")) {
      const match = q.match(/([\d.]+)\s*(?:%|percent)\s*of\s*([\d.]+)/i);
      if (match) {
        const rate = parseFloat(match[1]);
        const total = parseFloat(match[2]);
        if (!isNaN(rate) && !isNaN(total)) {
          return (rate / 100) * total;
        }
      }
    }

    // Example: "500 - 20%" (Discount/Off)
    const discountMatch = q.match(/([\d.]+)\s*([+\-])\s*([\d.]+)\s*%/);
    if (discountMatch) {
      const base = parseFloat(discountMatch[1]);
      const op = discountMatch[2];
      const pct = parseFloat(discountMatch[3]);
      if (!isNaN(base) && !isNaN(pct)) {
        const delta = (pct / 100) * base;
        return op === "+" ? base + delta : base - delta;
      }
    }

    // Clean & normalize expression symbols
    let sanitized = q
      .replace(/what is|calculate|solve|equal to|=|\?/gi, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/pi/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));

    // Handle percentage symbol in standard inline math e.g. "50 * 10%" -> "50 * (10 / 100)"
    sanitized = sanitized.replace(/([\d.]+)\s*%/g, "($1 / 100)");

    // Handle power symbol `^` e.g. "2^8" -> "Math.pow(2, 8)"
    sanitized = sanitized.replace(/([\d.]+)\s*\^\s*([\d.]+)/g, "Math.pow($1, $2)");

    // Handle Math functions: sqrt, cbrt, sin, cos, tan, log, abs
    sanitized = sanitized
      .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
      .replace(/cbrt\(([^)]+)\)/g, "Math.cbrt($1)")
      .replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)")
      .replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)")
      .replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)")
      .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
      .replace(/ln\(([^)]+)\)/g, "Math.log($1)")
      .replace(/abs\(([^)]+)\)/g, "Math.abs($1)");

    // Validate safe characters only before evaluating
    const safeRegex = /^[0-9+\-*/().\sMath,powsqrtcbrtsincostanlogabsEPI]+$/;
    if (!safeRegex.test(sanitized)) {
      return null;
    }

    try {
      // Safe dynamic calculation
      const result = Function(`"use strict"; return (${sanitized});`)();
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        // Format decimals nicely (max 6 decimal places)
        return Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
      }
    } catch (e) {
      return null;
    }

    return null;
  }
};

export default MathMasterEngine;
