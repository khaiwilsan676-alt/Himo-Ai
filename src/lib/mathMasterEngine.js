const MathMasterEngine = {
  evaluate: function (query) {
    if (!query || typeof query !== "string") return null;
    let q = query.trim().toLowerCase();

    // 1. Table Generator ("table of 7", "7 ka table", "table 12", "pahada 5", "2x10 table")
    const isTableQuery = /table|pahada|pahara/i.test(q) || /^\d+\s*[x*×]\s*(?:table|all)$/i.test(q);
    const tableNumMatch = q.match(/\b(\d+)\b/);

    if (isTableQuery && tableNumMatch) {
      const num = parseInt(tableNumMatch[1], 10);
      if (!isNaN(num) && num > 0 && num <= 1000) {
        let tableOutput = `**Multiplication Table of ${num}:**\n\n`;
        for (let i = 1; i <= 10; i++) {
          tableOutput += `• ${num} × ${i} = ${num * i}\n`;
        }
        return tableOutput.trim();
      }
    }

    // 2. Percentage Operations ("20% of 500", "500 - 18%")
    if (q.includes("% of") || q.includes("percent of")) {
      const match = q.match(/([\d.]+)\s*(?:%|percent)\s*of\s*([\d.]+)/i);
      if (match) {
        const rate = parseFloat(match[1]);
        const total = parseFloat(match[2]);
        if (!isNaN(rate) && !isNaN(total)) return `${query} = **${(rate / 100) * total}**`;
      }
    }

    const discountMatch = q.match(/([\d.]+)\s*([+\-])\s*([\d.]+)\s*%/);
    if (discountMatch) {
      const base = parseFloat(discountMatch[1]);
      const op = discountMatch[2];
      const pct = parseFloat(discountMatch[3]);
      if (!isNaN(base) && !isNaN(pct)) {
        const delta = (pct / 100) * base;
        const res = op === "+" ? base + delta : base - delta;
        return `${query} = **${res}**`;
      }
    }

    // 3. Clean Inline Math Evaluation
    let sanitized = q
      .replace(/what is|calculate|solve|equal to|=|\?/gi, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/pi/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));

    sanitized = sanitized.replace(/([\d.]+)\s*%/g, "($1 / 100)");
    sanitized = sanitized.replace(/([\d.]+)\s*\^\s*([\d.]+)/g, "Math.pow($1, $2)");

    sanitized = sanitized
      .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
      .replace(/cbrt\(([^)]+)\)/g, "Math.cbrt($1)")
      .replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)")
      .replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)")
      .replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)")
      .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
      .replace(/ln\(([^)]+)\)/g, "Math.log($1)")
      .replace(/abs\(([^)]+)\)/g, "Math.abs($1)");

    const safeRegex = /^[0-9+\-*/().\sMath,powsqrtcbrtsincostanlogabsEPI]+$/;
    if (!safeRegex.test(sanitized)) return null;

    try {
      const result = Function(`"use strict"; return (${sanitized});`)();
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        const cleanVal = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
        return `${query} = **${cleanVal}**`;
      }
    } catch (e) {
      return null;
    }

    return null;
  }
};

export default MathMasterEngine;
