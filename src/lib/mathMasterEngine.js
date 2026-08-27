// ==========================================
// HIMO MATH, ACCOUNTING & SYMBOLS MASTER ENGINE (A to Z)
// ==========================================

export function evaluateMasterMath(text) {
  if (!text) return null;
  const clean = text.toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[“”"']/g, '')
    .trim();

  // 1. Currency & Financial Accounting Symbols ($ ¥ € ₹ £)
  if (clean.includes("$") || clean.includes("¥") || clean.includes("€") || clean.includes("₹") || clean.includes("accounting") || clean.includes("profit") || clean.includes("loss")) {
    return `💵 **Financial & Accounting Master Breakdown:**
• **Currencies Handled:** US Dollar ($), Japanese Yen (¥), Euro (€), Indian Rupee (₹), British Pound (£).
• **Core Accounting Formulas:**
  1. **Net Income:** Revenue - Expenses
  2. **Gross Profit:** Total Revenue - Cost of Goods Sold (COGS)
  3. **Accounting Equation:** Assets = Liabilities + Owner's Equity
  4. **ROI (Return on Investment):** (Net Profit / Cost of Investment) * 100%`;
  }

  // 2. Advanced Mathematical Symbols & Operations (×, ÷, +, -, %, ±, ∑, ∫)
  if (clean.includes("sum") || clean.includes("sigma") || clean.includes("integral") || clean.includes("formula")) {
    return `📐 **Mathematical Symbols & Core Formulas Directory (A to Z):**
• **(+) Addition & (-) Subtraction:** Basic arithmetic combining or finding differences.
• **(×) Multiplication & (÷) Division:** Scaling and partitioning numbers.
• **(±) Plus-Minus:** Indicates both positive and negative potential values.
• **(∑) Sigma (Summation):** Used to compute the sum of a sequence of numbers.
• **(∫) Integral:** Core calculus operator used to calculate areas under curves and accumulation.
• **(%) Percentage:** Proportion per hundred ((Part / Total) * 100).`;
  }

  // 3. Dynamic Arithmetic & Expression Evaluator
  let processed = clean
    .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/x/g, "*")
    .replace(/pi/g, Math.PI.toString())
    .replace(/divided by/g, "/")
    .replace(/upon/g, "/")
    .trim();

  // Handle Percentage e.g. "20% of 500"
  const percentOfMatch = processed.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/);
  if (percentOfMatch) {
    const p = parseFloat(percentOfMatch[1]);
    const total = parseFloat(percentMatch[2]);
    return `🔢 **Math Calculation Result:**\n• **${p}% of ${total}** = **${(p / 100) * total}**`;
  }

  // Handle Square Roots
  if (processed.includes("sqrt") || processed.includes("root")) {
    const numMatch = processed.match(/[\d.]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      return `🔢 **Square Root Result:**\n• **√${val}** = **${Math.sqrt(val)}**`;
    }
  }

  // Sanitize and evaluate standard mathematical strings safely (Fixed regex)
  const sanitized = processed.replace(/[^0-9+\-*/().\s%]/g, "").trim();
  if (sanitized && /[+\-*/%]/.test(sanitized)) {
    try {
      const finalExpr = sanitized.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)");
      const res = Function(`'use strict'; return (${finalExpr})`)();
      if (typeof res === "number" && !isNaN(res)) {
        return `🔢 **Math Calculation Result:**\n• Expression: \`${sanitized}\`\n• **Answer:** **${res}**`;
      }
    } catch (e) {
      return null;
    }
  }

  return null;
}
