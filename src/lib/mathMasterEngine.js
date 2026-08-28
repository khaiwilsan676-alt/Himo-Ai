

export const MathMasterEngine = {
  // ==========================================
  // 1. BASIC ARITHMETIC & OPERATORS (+, -, ×, ÷)
  // ==========================================
  add: (a, b) => Number(a) + Number(b),
  subtract: (a, b) => Number(a) - Number(b),
  multiply: (a, b) => Number(a) * Number(b),
  divide: (a, b) => {
    if (Number(b) === 0) throw new Error("Division by zero is not allowed.");
    return Number(a) / Number(b);
  },
  modulo: (a, b) => Number(a) % Number(b),
  power: (base, exp) => Math.pow(Number(base), Number(exp)),
  sqrt: (n) => {
    if (Number(n) < 0) throw new Error("Square root of negative number requires complex domain.");
    return Math.sqrt(Number(n));
  },
  cbrt: (n) => Math.cbrt(Number(n)),
  abs: (n) => Math.abs(Number(n)),
  round: (n, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(Number(n) * factor) / factor;
  },

  // ==========================================
  // 2. CURRENCY & FINANCIAL MATH ($, €)
  // ==========================================
  currency: {
    // Default standard rates (Adjustable)
    rates: {
      USD_TO_EUR: 0.92,
      EUR_TO_USD: 1.09,
      USD_TO_INR: 83.50,
      EUR_TO_INR: 90.75
    },

    formatUSD: (amount) => {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    },

    formatEUR: (amount) => {
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
    },

    usdToEur: function (amount, customRate) {
      const rate = customRate || this.rates.USD_TO_EUR;
      return Number(amount) * rate;
    },

    eurToUsd: function (amount, customRate) {
      const rate = customRate || this.rates.EUR_TO_USD;
      return Number(amount) * rate;
    },

    // Simple & Compound Interest
    simpleInterest: (principal, ratePercent, timeYears) => {
      return (Number(principal) * Number(ratePercent) * Number(timeYears)) / 100;
    },

    compoundInterest: (principal, ratePercent, timeYears, compoundFreqPerYear = 1) => {
      const p = Number(principal);
      const r = Number(ratePercent) / 100;
      const t = Number(timeYears);
      const n = Number(compoundFreqPerYear);
      const totalAmount = p * Math.pow(1 + r / n, n * t);
      return {
        totalAmount: totalAmount,
        interestEarned: totalAmount - p
      };
    },

    // EMI Calculator
    calculateEMI: (principal, annualRatePercent, tenureMonths) => {
      const p = Number(principal);
      const monthlyRate = Number(annualRatePercent) / (12 * 100);
      const n = Number(tenureMonths);

      if (monthlyRate === 0) return p / n;

      const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      return {
        monthlyEMI: emi,
        totalPayment: emi * n,
        totalInterest: emi * n - p
      };
    }
  },

  // ==========================================
  // 3. ALGEBRA & NUMBER THEORY
  // ==========================================
  algebra: {
    factorial: function (n) {
      n = Math.floor(Number(n));
      if (n < 0) throw new Error("Factorial is not defined for negative numbers.");
      if (n === 0 || n === 1) return 1;
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    },

    // Permutation P(n, r)
    nPr: function (n, r) {
      return this.factorial(n) / this.factorial(n - r);
    },

    // Combination C(n, r)
    nCr: function (n, r) {
      return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
    },

    // GCD / HCF
    gcd: (a, b) => {
      a = Math.abs(Number(a));
      b = Math.abs(Number(b));
      while (b) {
        let t = b;
        b = a % b;
        a = t;
      }
      return a;
    },

    // LCM
    lcm: function (a, b) {
      return (Math.abs(Number(a) * Number(b))) / this.gcd(a, b);
    },

    // Quadratic Equation: ax² + bx + c = 0
    solveQuadratic: (a, b, c) => {
      a = Number(a);
      b = Number(b);
      c = Number(c);

      if (a === 0) throw new Error("'a' cannot be zero in a quadratic equation.");

      const d = b * b - 4 * a * c; // Discriminant
      if (d > 0) {
        return {
          type: "Real and Distinct",
          root1: (-b + Math.sqrt(d)) / (2 * a),
          root2: (-b - Math.sqrt(d)) / (2 * a)
        };
      } else if (d === 0) {
        return {
          type: "Real and Equal",
          root: -b / (2 * a)
        };
      } else {
        const realPart = (-b / (2 * a)).toFixed(4);
        const imagPart = (Math.sqrt(-d) / (2 * a)).toFixed(4);
        return {
          type: "Complex",
          root1: `${realPart} + ${imagPart}i`,
          root2: `${realPart} - ${imagPart}i`
        };
      }
    },

    isPrime: (n) => {
      n = Number(n);
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    }
  },

  // ==========================================
  // 4. TRIGONOMETRY & LOGARITHMS
  // ==========================================
  trigonometry: {
    toRad: (deg) => (Number(deg) * Math.PI) / 180,
    toDeg: (rad) => (Number(rad) * 180) / Math.PI,

    sin: (deg) => Math.sin((Number(deg) * Math.PI) / 180),
    cos: (deg) => Math.cos((Number(deg) * Math.PI) / 180),
    tan: (deg) => Math.tan((Number(deg) * Math.PI) / 180),
    asin: (val) => (Math.asin(Number(val)) * 180) / Math.PI,
    acos: (val) => (Math.acos(Number(val)) * 180) / Math.PI,
    atan: (val) => (Math.atan(Number(val)) * 180) / Math.PI,

    log10: (n) => Math.log10(Number(n)),
    ln: (n) => Math.log(Number(n)),
    logBase: (n, base) => Math.log(Number(n)) / Math.log(Number(base))
  },

  // ==========================================
  // 5. GEOMETRY & MENSURATION (2D / 3D)
  // ==========================================
  geometry: {
    // 2D Shapes
    circleArea: (r) => Math.PI * Math.pow(Number(r), 2),
    circlePerimeter: (r) => 2 * Math.PI * Number(r),
    rectangleArea: (l, w) => Number(l) * Number(w),
    rectanglePerimeter: (l, w) => 2 * (Number(l) + Number(w)),
    triangleArea: (base, height) => 0.5 * Number(base) * Number(height),
    triangleAreaHeron: (a, b, c) => {
      a = Number(a); b = Number(b); c = Number(c);
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    },

    // 3D Shapes
    sphereVolume: (r) => (4 / 3) * Math.PI * Math.pow(Number(r), 3),
    sphereSurfaceArea: (r) => 4 * Math.PI * Math.pow(Number(r), 2),
    cylinderVolume: (r, h) => Math.PI * Math.pow(Number(r), 2) * Number(h),
    cylinderSurfaceArea: (r, h) => 2 * Math.PI * Number(r) * (Number(r) + Number(h)),
    coneVolume: (r, h) => (1 / 3) * Math.PI * Math.pow(Number(r), 2) * Number(h),
    pythagorasHypotenuse: (a, b) => Math.hypot(Number(a), Number(b))
  },

  // ==========================================
  // 6. STATISTICS & PROBABILITY
  // ==========================================
  statistics: {
    mean: (arr) => {
      if (!arr.length) return 0;
      return arr.reduce((acc, val) => acc + Number(val), 0) / arr.length;
    },

    median: (arr) => {
      if (!arr.length) return 0;
      const sorted = [...arr].map(Number).sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    mode: (arr) => {
      if (!arr.length) return [];
      const freq = {};
      let maxCount = 0;
      arr.forEach((v) => {
        freq[v] = (freq[v] || 0) + 1;
        if (freq[v] > maxCount) maxCount = freq[v];
      });
      return Object.keys(freq).filter((k) => freq[k] === maxCount).map(Number);
    },

    variance: function (arr) {
      if (arr.length <= 1) return 0;
      const avg = this.mean(arr);
      return arr.reduce((acc, val) => acc + Math.pow(Number(val) - avg, 2), 0) / arr.length;
    },

    standardDeviation: function (arr) {
      return Math.sqrt(this.variance(arr));
    }
  },

  // ==========================================
  // 7. UNIVERSAL EXPRESSION PARSER & EVALUATOR
  // Handles symbols: +, -, ×, ÷, *, /, $, € automatically
  // ==========================================
  evaluate: function (expression) {
    if (typeof expression !== "string" || !expression.trim()) {
      throw new Error("Invalid expression string.");
    }

    // Clean and normalize math symbols & currency symbols
    let sanitized = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[$€]/g, "") // Removes $ or € during direct math eval
      .replace(/\^/g, "**")
      .trim();

    // Security check: Only allow valid mathematical characters
    const validMathRegex = /^[0-9+\-*/().\s*%]+$/;
    if (!validMathRegex.test(sanitized)) {
      throw new Error("Invalid or unsafe characters in mathematical expression.");
    }

    try {
      // Safe dynamic calculation
      const result = Function(`"use strict"; return (${sanitized})`)();
      return result;
    } catch (err) {
      throw new Error("Could not evaluate expression: " + err.message);
    }
  }
};

export default MathMasterEngine;

