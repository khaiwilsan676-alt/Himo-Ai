export function evaluateAdvancedMath(text) {
  if (!text) return null;
  let clean = text.toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/what is|calculate|solve|\?|=|kya hoga|batao|ans|answer/g, "")
    .trim();

  const percentMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const ans = (p / 100) * total;
    return `Calculation Result: **${ans}** (${p}% of ${total})`;
  }

  if (clean.includes("sqrt") || clean.includes("root")) {
    const numMatch = clean.match(/[\d.]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      const ans = Math.sqrt(val);
      return `Square Root Result: **√${val} = ${ans}**`;
    }
  }

  let processed = clean
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/x/g, "*")
    .replace(/pi/g, Math.PI.toString())
    .replace(/divided by/g, "/")
    .replace(/upon/g, "/");

  processed = processed.replace(/[^0-9+\-*/().\s%MathPI]/g, "").trim();

  if (processed && /[+\-*/%]/.test(processed)) {
    try {
      const sanitized = processed.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)");
      const res = Function(`'use strict'; return (${sanitized})`)();
      if (typeof res === "number" && !isNaN(res)) {
        return `Calculation Result: **${res}**`;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}
