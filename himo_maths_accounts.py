# ============================================
# 📊 HIMO - MATHS + ACCOUNTS COMPLETE ENGINE
# ============================================
# 🧮 All Maths Topics | 💰 All Accounts Topics
# 📚 Deep Knowledge with Formulas & Examples
# ============================================

import re
import math
from datetime import datetime

class HimoMathsAccounts:
    def __init__(self):
        print("\n" + "="*60)
        print("📊 HIMO - MATHS + ACCOUNTS COMPLETE ENGINE")
        print("="*60)
        print("""
📋 FEATURES:
  🧮 ARITHMETIC: +, -, ×, ÷, %, Average, Ratio
  📐 GEOMETRY: Area, Perimeter, Volume, Shapes
  📊 ALGEBRA: Equations, Polynomials, Factorization
  📈 STATISTICS: Mean, Median, Mode, Variance, SD
  💰 ACCOUNTS: Balance Sheet, P&L, Journal, Ledger
  🏷️ TAX: GST, Income Tax, VAT, Customs
  💹 FINANCE: SI, CI, Profit/Loss, Discount, Depreciation
  📊 RATIOS: Liquidity, Profitability, Solvency
        """)
        print("="*60)
        print("💡 Type 'help' for examples | 'exit' to quit\n")

    # ==========================================
    # PART 1: ARITHMETIC
    # ==========================================

    def arithmetic(self, query):
        nums = re.findall(r'[\d.]+', query)
        if not nums:
            return None

        try:
            # Addition
            if '+' in query and len(nums) >= 2:
                a, b = float(nums[0]), float(nums[1])
                return f"🧮 {a} + {b} = {a + b}"

            # Subtraction
            if '-' in query and len(nums) >= 2:
                a, b = float(nums[0]), float(nums[1])
                return f"🧮 {a} - {b} = {a - b}"

            # Multiplication
            if '*' in query or '×' in query:
                a, b = float(nums[0]), float(nums[1])
                return f"🧮 {a} × {b} = {a * b}"

            # Division
            if '/' in query or '÷' in query:
                a, b = float(nums[0]), float(nums[1])
                if b == 0:
                    return "❌ Division by zero is not allowed!"
                return f"🧮 {a} ÷ {b} = {a / b}"

            # Power/Exponent
            if '^' in query or '**' in query or 'power' in query.lower():
                a, b = float(nums[0]), float(nums[1])
                return f"🧮 {a}^{b} = {a ** b}"

            # Square Root
            if 'sqrt' in query.lower() or 'root' in query.lower():
                a = float(nums[0])
                if a < 0:
                    return "❌ Cannot take square root of negative number!"
                return f"🧮 √{a} = {math.sqrt(a)}"

            # Factorial
            if 'factorial' in query.lower() or '!' in query:
                a = int(float(nums[0]))
                if a < 0:
                    return "❌ Factorial of negative number is not defined!"
                return f"🧮 {a}! = {math.factorial(a)}"

            # Percentage
            if 'percent' in query.lower() or '%' in query:
                if len(nums) >= 2:
                    pct = float(nums[0])
                    total = float(nums[1])
                    return f"📊 {pct}% of {total} = {(pct/100) * total}"
                elif len(nums) == 1:
                    return f"📊 {nums[0]}% = {float(nums[0])/100}"

            # Average
            if 'average' in query.lower() or 'mean' in query.lower():
                if len(nums) > 1:
                    vals = [float(n) for n in nums]
                    avg = sum(vals) / len(vals)
                    return f"📊 Average of {', '.join(nums)} = {avg:.2f}"

            # Ratio
            if 'ratio' in query.lower():
                if len(nums) >= 2:
                    a, b = float(nums[0]), float(nums[1])
                    gcd = math.gcd(int(a), int(b))
                    if gcd > 1:
                        return f"📊 Ratio {int(a)}:{int(b)} = {int(a/gcd)}:{int(b/gcd)}"
                    return f"📊 Ratio {int(a)}:{int(b)}"

            # LCM
            if 'lcm' in query.lower():
                if len(nums) >= 2:
                    vals = [int(float(n)) for n in nums]
                    lcm = vals[0]
                    for i in range(1, len(vals)):
                        lcm = lcm * vals[i] // math.gcd(lcm, vals[i])
                    return f"📊 LCM of {', '.join([str(v) for v in vals])} = {lcm}"

            # HCF/GCD
            if 'hcf' in query.lower() or 'gcd' in query.lower():
                if len(nums) >= 2:
                    vals = [int(float(n)) for n in nums]
                    gcd = vals[0]
                    for i in range(1, len(vals)):
                        gcd = math.gcd(gcd, vals[i])
                    return f"📊 HCF/GCD of {', '.join([str(v) for v in vals])} = {gcd}"

        except Exception as e:
            return f"❌ Error: {e}"

        return None

    # ==========================================
    # PART 2: GEOMETRY
    # ==========================================

    def geometry(self, query):
        nums = re.findall(r'[\d.]+', query)
        q = query.lower()

        try:
            # Circle
            if 'circle' in q:
                if len(nums) >= 1:
                    r = float(nums[0])
                    area = math.pi * r * r
                    circumference = 2 * math.pi * r
                    return f"""
📐 CIRCLE - Radius {r}:
━━━━━━━━━━━━━━━━━━━━
• Area = πr² = {area:.2f} sq units
• Circumference = 2πr = {circumference:.2f} units
• Diameter = 2r = {2*r} units

📝 Formulas:
• Area = πr²
• Circumference = 2πr
• Diameter = 2r
"""

            # Rectangle
            if 'rectangle' in q and len(nums) >= 2:
                l, b = float(nums[0]), float(nums[1])
                area = l * b
                perimeter = 2 * (l + b)
                return f"""
📐 RECTANGLE - Length {l}, Breadth {b}:
━━━━━━━━━━━━━━━━━━━━
• Area = l × b = {area} sq units
• Perimeter = 2(l+b) = {perimeter} units
• Diagonal = √(l²+b²) = {math.sqrt(l*l + b*b):.2f} units

📝 Formulas:
• Area = l × b
• Perimeter = 2(l+b)
• Diagonal = √(l²+b²)
"""

            # Square
            if 'square' in q and len(nums) >= 1:
                s = float(nums[0])
                area = s * s
                perimeter = 4 * s
                return f"""
📐 SQUARE - Side {s}:
━━━━━━━━━━━━━━━━━━━━
• Area = s² = {area} sq units
• Perimeter = 4s = {perimeter} units
• Diagonal = s√2 = {s * math.sqrt(2):.2f} units

📝 Formulas:
• Area = s²
• Perimeter = 4s
• Diagonal = s√2
"""

            # Triangle
            if 'triangle' in q and len(nums) >= 2:
                b, h = float(nums[0]), float(nums[1])
                area = 0.5 * b * h
                return f"""
📐 TRIANGLE - Base {b}, Height {h}:
━━━━━━━━━━━━━━━━━━━━
• Area = ½ × b × h = {area} sq units

📝 Formula:
• Area = ½ × base × height
"""

            # Cube
            if 'cube' in q and len(nums) >= 1:
                s = float(nums[0])
                volume = s ** 3
                surface_area = 6 * s * s
                return f"""
📦 CUBE - Side {s}:
━━━━━━━━━━━━━━━━━━━━
• Volume = s³ = {volume} cubic units
• Surface Area = 6s² = {surface_area} sq units
• Diagonal = s√3 = {s * math.sqrt(3):.2f} units

📝 Formulas:
• Volume = s³
• Surface Area = 6s²
• Diagonal = s√3
"""

            # Cuboid
            if 'cuboid' in q and len(nums) >= 3:
                l, b, h = float(nums[0]), float(nums[1]), float(nums[2])
                volume = l * b * h
                surface_area = 2 * (l*b + b*h + h*l)
                return f"""
📦 CUBOID - Length {l}, Breadth {b}, Height {h}:
━━━━━━━━━━━━━━━━━━━━
• Volume = l × b × h = {volume} cubic units
• Surface Area = 2(lb+bh+hl) = {surface_area} sq units
• Diagonal = √(l²+b²+h²) = {math.sqrt(l*l + b*b + h*h):.2f} units

📝 Formulas:
• Volume = l × b × h
• Surface Area = 2(lb+bh+hl)
• Diagonal = √(l²+b²+h²)
"""

            # Sphere
            if 'sphere' in q and len(nums) >= 1:
                r = float(nums[0])
                volume = (4/3) * math.pi * r ** 3
                surface_area = 4 * math.pi * r * r
                return f"""
⚪ SPHERE - Radius {r}:
━━━━━━━━━━━━━━━━━━━━
• Volume = ⁴⁄₃πr³ = {volume:.2f} cubic units
• Surface Area = 4πr² = {surface_area:.2f} sq units

📝 Formulas:
• Volume = ⁴⁄₃πr³
• Surface Area = 4πr²
"""

            # Cylinder
            if 'cylinder' in q and len(nums) >= 2:
                r, h = float(nums[0]), float(nums[1])
                volume = math.pi * r * r * h
                curved_sa = 2 * math.pi * r * h
                total_sa = 2 * math.pi * r * (r + h)
                return f"""
🥫 CYLINDER - Radius {r}, Height {h}:
━━━━━━━━━━━━━━━━━━━━
• Volume = πr²h = {volume:.2f} cubic units
• Curved SA = 2πrh = {curved_sa:.2f} sq units
• Total SA = 2πr(r+h) = {total_sa:.2f} sq units

📝 Formulas:
• Volume = πr²h
• Curved SA = 2πrh
• Total SA = 2πr(r+h)
"""

            # Cone
            if 'cone' in q and len(nums) >= 2:
                r, h = float(nums[0]), float(nums[1])
                l = math.sqrt(r*r + h*h)
                volume = (1/3) * math.pi * r * r * h
                curved_sa = math.pi * r * l
                total_sa = math.pi * r * (r + l)
                return f"""
🔺 CONE - Radius {r}, Height {h}:
━━━━━━━━━━━━━━━━━━━━
• Slant Height = √(r²+h²) = {l:.2f} units
• Volume = ⅓πr²h = {volume:.2f} cubic units
• Curved SA = πrl = {curved_sa:.2f} sq units
• Total SA = πr(r+l) = {total_sa:.2f} sq units

📝 Formulas:
• Slant Height = √(r²+h²)
• Volume = ⅓πr²h
• Curved SA = πrl
• Total SA = πr(r+l)
"""

        except Exception as e:
            return f"❌ Error: {e}"

        return None

    # ==========================================
    # PART 3: ALGEBRA
    # ==========================================

    def algebra(self, query):
        q = query.lower()

        try:
            # Linear Equation: ax + b = c
            if 'solve' in q and '=' in q:
                # Extract numbers
                nums = re.findall(r'[\d.]+', q)
                if len(nums) >= 3:
                    a, b, c = float(nums[0]), float(nums[1]), float(nums[2])
                    if a != 0:
                        x = (c - b) / a
                        return f"""
📝 LINEAR EQUATION: {a}x + {b} = {c}
━━━━━━━━━━━━━━━━━━━━
Solution:
• {a}x = {c} - {b}
• {a}x = {c - b}
• x = ({c} - {b}) / {a}
• x = {x:.2f}

✅ x = {x:.2f}
"""

            # Quadratic Equation: ax² + bx + c = 0
            if 'quadratic' in q or 'ax2' in q or 'ax²' in q:
                nums = re.findall(r'[\d.]+', q)
                if len(nums) >= 3:
                    a, b, c = float(nums[0]), float(nums[1]), float(nums[2])
                    disc = b*b - 4*a*c
                    if disc > 0:
                        root1 = (-b + math.sqrt(disc)) / (2*a)
                        root2 = (-b - math.sqrt(disc)) / (2*a)
                        return f"""
📝 QUADRATIC EQUATION: {a}x² + {b}x + {c} = 0
━━━━━━━━━━━━━━━━━━━━
• Discriminant = b²-4ac = {disc}
• Roots are real and distinct

✅ Root 1 = {root1:.2f}
✅ Root 2 = {root2:.2f}
"""
                    elif disc == 0:
                        root = -b / (2*a)
                        return f"""
📝 QUADRATIC EQUATION: {a}x² + {b}x + {c} = 0
━━━━━━━━━━━━━━━━━━━━
• Discriminant = b²-4ac = {disc}
• Roots are real and equal

✅ Root = {root:.2f}
"""
                    else:
                        real = -b / (2*a)
                        imag = math.sqrt(-disc) / (2*a)
                        return f"""
📝 QUADRATIC EQUATION: {a}x² + {b}x + {c} = 0
━━━━━━━━━━━━━━━━━━━━
• Discriminant = b²-4ac = {disc}
• Roots are complex

✅ Root 1 = {real:.2f} + {imag:.2f}i
✅ Root 2 = {real:.2f} - {imag:.2f}i
"""

            # Factors
            if 'factor' in q:
                nums = re.findall(r'[\d.]+', q)
                if len(nums) >= 1:
                    n = int(float(nums[0]))
                    factors = []
                    for i in range(1, n+1):
                        if n % i == 0:
                            factors.append(i)
                    return f"📊 Factors of {n}: {', '.join([str(f) for f in factors])}"

        except Exception as e:
            return f"❌ Error: {e}"

        return None

    # ==========================================
    # PART 4: STATISTICS
    # ==========================================

    def statistics(self, query):
        nums = re.findall(r'[\d.]+', query)
        if len(nums) < 2:
            return None

        try:
            vals = [float(n) for n in nums]
            n = len(vals)

            # Mean
            mean = sum(vals) / n

            # Median
            sorted_vals = sorted(vals)
            if n % 2 == 0:
                median = (sorted_vals[n//2 - 1] + sorted_vals[n//2]) / 2
            else:
                median = sorted_vals[n//2]

            # Mode
            from collections import Counter
            counter = Counter(vals)
            max_count = max(counter.values())
            mode = [k for k, v in counter.items() if v == max_count]

            # Variance
            variance = sum((x - mean) ** 2 for x in vals) / n

            # Standard Deviation
            std_dev = math.sqrt(variance)

            # Range
            range_val = max(vals) - min(vals)

            return f"""
📊 STATISTICS - {n} Values:
━━━━━━━━━━━━━━━━━━━━
Data: {', '.join([str(v) for v in vals])}

📈 CENTRAL TENDENCY:
• Mean (Average) = {mean:.2f}
• Median = {median:.2f}
• Mode = {', '.join([str(m) for m in mode])}

📉 DISPERSION:
• Variance = {variance:.2f}
• Standard Deviation = {std_dev:.2f}
• Range = {range_val:.2f}
• Min = {min(vals):.2f}
• Max = {max(vals):.2f}

📝 Formulas:
• Mean = Σx / n
• Median = Middle value (sorted)
• Mode = Most frequent value
• Variance = Σ(x-μ)²/n
• Std Dev = √Variance
"""

        except Exception as e:
            return f"❌ Error: {e}"

    # ==========================================
    # PART 5: PROFIT & LOSS
    # ==========================================

    def profit_loss(self, query):
        nums = re.findall(r'[\d.]+', query)
        if len(nums) < 2:
            return None

        try:
            cp, sp = float(nums[0]), float(nums[1])

            if sp > cp:
                profit = sp - cp
                profit_pct = (profit / cp) * 100
                return f"""
💰 PROFIT CALCULATION:
━━━━━━━━━━━━━━━━━━━━
Cost Price (CP) = ₹{cp}
Selling Price (SP) = ₹{sp}

✅ Profit = SP - CP = ₹{profit}
✅ Profit% = (Profit/CP) × 100 = {profit_pct:.2f}%

📝 Formula:
Profit = SP - CP
Profit% = (Profit/CP) × 100

🎉 Great Profit!
"""

            elif cp > sp:
                loss = cp - sp
                loss_pct = (loss / cp) * 100
                return f"""
💸 LOSS CALCULATION:
━━━━━━━━━━━━━━━━━━━━
Cost Price (CP) = ₹{cp}
Selling Price (SP) = ₹{sp}

❌ Loss = CP - SP = ₹{loss}
❌ Loss% = (Loss/CP) × 100 = {loss_pct:.2f}%

📝 Formula:
Loss = CP - SP
Loss% = (Loss/CP) × 100

😊 Don't worry, better luck next time!
"""

            else:
                return f"""
🤝 NO PROFIT NO LOSS:
━━━━━━━━━━━━━━━━━━━━
CP = SP = ₹{cp}

📝 It's a break-even deal!
"""

        except Exception as e:
            return f"❌ Error: {e}"

    # ==========================================
    # PART 6: SIMPLE & COMPOUND INTEREST
    # ==========================================

    def interest(self, query):
        nums = re.findall(r'[\d.]+', query)
        q = query.lower()

        try:
            # Simple Interest
            if 'si' in q or 'simple interest' in q:
                if len(nums) >= 3:
                    p, r, t = float(nums[0]), float(nums[1]), float(nums[2])
                    si = (p * r * t) / 100
                    amount = p + si
                    return f"""
💰 SIMPLE INTEREST:
━━━━━━━━━━━━━━━━━━━━
Principal (P) = ₹{p}
Rate (R) = {r}% p.a.
Time (T) = {t} years

📊 SI = (P×R×T)/100
SI = ({p}×{r}×{t})/100 = ₹{si:.2f}

✅ Total Amount = P + SI = ₹{amount:.2f}

📝 Formula:
SI = (P × R × T) / 100
A = P + SI
"""

            # Compound Interest
            if 'ci' in q or 'compound interest' in q:
                if len(nums) >= 3:
                    p, r, t = float(nums[0]), float(nums[1]), float(nums[2])
                    amount = p * (1 + r/100) ** t
                    ci = amount - p
                    return f"""
💰 COMPOUND INTEREST:
━━━━━━━━━━━━━━━━━━━━
Principal (P) = ₹{p}
Rate (R) = {r}% p.a.
Time (T) = {t} years

📊 A = P(1 + R/100)^T
A = {p}(1 + {r}/100)^{t} = ₹{amount:.2f}

✅ Compound Interest = A - P = ₹{ci:.2f}
✅ Total Amount = ₹{amount:.2f}

📝 Formula:
A = P(1 + R/100)^T
CI = A - P
"""

        except Exception as e:
            return f"❌ Error: {e}"

        return None

    # ==========================================
    # PART 7: DISCOUNT
    # ==========================================

    def discount(self, query):
        nums = re.findall(r'[\d.]+', query)
        if len(nums) < 2:
            return None

        try:
            mp, disc_pct = float(nums[0]), float(nums[1])
            discount = (disc_pct / 100) * mp
            sp = mp - discount

            return f"""
🛍️ DISCOUNT CALCULATION:
━━━━━━━━━━━━━━━━━━━━
Marked Price (MP) = ₹{mp}
Discount% = {disc_pct}%

📊 Discount Amount = (Discount% × MP) / 100
= ({disc_pct} × {mp}) / 100 = ₹{discount:.2f}

✅ Selling Price = MP - Discount = ₹{sp:.2f}
💰 You Save ₹{discount:.2f}!

📝 Formula:
Discount = (Discount% × MP) / 100
SP = MP - Discount
"""

        except Exception as e:
            return f"❌ Error: {e}"

    # ==========================================
    # PART 8: GST
    # ==========================================

    def gst(self, query):
        nums = re.findall(r'[\d.]+', query)
        if len(nums) < 2:
            return None

        try:
            price, rate = float(nums[0]), float(nums[1])
            gst = (rate / 100) * price
            total = price + gst

            return f"""
🏷️ GST CALCULATION:
━━━━━━━━━━━━━━━━━━━━
Base Price = ₹{price}
GST Rate = {rate}%

📊 GST Amount = (Rate% × Price) / 100
= ({rate} × {price}) / 100 = ₹{gst:.2f}

✅ Total Price = Price + GST = ₹{total:.2f}

📝 Formula:
GST = (GST% × Price) / 100
Total = Price + GST

🔢 GST Slabs (India):
• 0% - Essential goods
• 5% - Basic essentials
• 12% - Standard goods
• 18% - Luxury goods
• 28% - Highest luxury
"""

        except Exception as e:
            return f"❌ Error: {e}"

    # ==========================================
    # PART 9: INCOME TAX (India)
    # ==========================================

    def income_tax(self, query):
        nums = re.findall(r'[\d.]+', query)
        if not nums:
            return None

        try:
            income = float(nums[0])

            # Indian Income Tax Slabs (New Regime 2023-24)
            if income <= 300000:
                tax = 0
                slab = "0%"
            elif income <= 600000:
                tax = (income - 300000) * 0.05
                slab = "5%"
            elif income <= 900000:
                tax = 15000 + (income - 600000) * 0.10
                slab = "10%"
            elif income <= 1200000:
                tax = 45000 + (income - 900000) * 0.15
                slab = "15%"
            elif income <= 1500000:
                tax = 90000 + (income - 1200000) * 0.20
                slab = "20%"
            else:
                tax = 150000 + (income - 1500000) * 0.30
                slab = "30%"

            # Add 4% Health & Education Cess
            cess = tax * 0.04
            total_tax = tax + cess

            return f"""
📊 INCOME TAX CALCULATION (India):
━━━━━━━━━━━━━━━━━━━━
Annual Income = ₹{income:,.2f}
Tax Slab = {slab}

📊 Tax Breakdown:
• Income Tax = ₹{tax:,.2f}
• Health & Education Cess (4%) = ₹{cess:,.2f}
• Total Tax = ₹{total_tax:,.2f}

✅ After Tax Income = ₹{income - total_tax:,.2f}

📝 New Regime Slabs (2023-24):
• 0-3L: 0%
• 3-6L: 5%
• 6-9L: 10%
• 9-12L: 15%
• 12-15L: 20%
• 15L+: 30%

💡 Deductions Available:
• 80C: Up to ₹1.5L
• 80D: Health Insurance
• 80E: Education Loan
• NPS: Additional ₹50K
"""

        except Exception as e:
            return f"❌ Error: {e}"

    # ==========================================
    # PART 10: ACCOUNTS - BALANCE SHEET
    # ==========================================

    def balance_sheet(self, query):
        return """
📊 BALANCE SHEET FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━

**LIABILITIES**          | **ASSETS**
━━━━━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━━━━
Capital              XXX  | Fixed Assets        XXX
+ Net Profit         XXX  |   - Land/Building   XXX
- Drawings           XXX  |   - Furniture       XXX
Creditors            XXX  |   - Machinery       XXX
Bills Payable        XXX  |   - Vehicles        XXX
Outstanding Expenses  XXX | Current Assets      XXX
Bank Loan            XXX  |   - Cash            XXX
                           |   - Bank            XXX
                           |   - Debtors         XXX
                           |   - Stock           XXX
                           |   - Prepaid Expenses XXX
━━━━━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━━━━
Total                XXX  | Total              XXX

📝 RULES:
• Assets = Liabilities + Capital
• Always Balanced!
• Debit = Credit

🏷️ ACCOUNT TYPES:
• Personal: Debtors, Creditors, Capital
• Real: Cash, Bank, Building, Furniture
• Nominal: Sales, Purchase, Rent, Salary
"""

    # ==========================================
    # PART 11: PROFIT & LOSS ACCOUNT
    # ==========================================

    def profit_loss_account(self, query):
        return """
📊 PROFIT & LOSS ACCOUNT:
━━━━━━━━━━━━━━━━━━━━━━━━━━

**Dr** (Expenses)         | **Cr** (Income)
━━━━━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Stock        XXX  | Sales               XXX
Purchases            XXX  | Closing Stock       XXX
Wages                XXX  | Returns Inward      XXX
Carriage Inward      XXX  | Commission Received XXX
Salaries             XXX  | Discount Received   XXX
Rent                 XXX  | Gross Profit        XXX
Insurance            XXX  |
Depreciation         XXX  |
Gross Profit         XXX  |
━━━━━━━━━━━━━━━━━━━━━━━━━|━━━━━━━━━━━━━━━━━━━━━━━━━━
Total                XXX  | Total              XXX

📝 GROSS PROFIT/LOSS:
• If Cr > Dr = Gross Profit
• If Dr > Cr = Gross Loss

📝 NET PROFIT/LOSS:
• Add all incomes
• Subtract all expenses
• = Net Profit/Loss
"""

    # ==========================================
    # PART 12: JOURNAL ENTRIES
    # ==========================================

    def journal_entries(self, query):
        return """
📝 JOURNAL ENTRIES - EXAMPLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **Cash Sales:**
Cash A/c                          Dr    1000
   To Sales A/c                          1000
(Goods sold for cash)

2️⃣ **Credit Purchase:**
Purchase A/c                      Dr    5000
   To Creditor A/c                       5000
(Goods purchased on credit)

3️⃣ **Payment to Creditor:**
Creditor A/c                       Dr    3000
   To Cash A/c                           3000
(Cash paid to creditor)

4️⃣ **Salary Paid:**
Salary A/c                         Dr    8000
   To Cash A/c                           8000
(Salary paid in cash)

5️⃣ **Depreciation:**
Depreciation A/c                   Dr    2000
   To Asset A/c                           2000
(Depreciation charged)

6️⃣ **Interest Received:**
Cash A/c                           Dr     500
   To Interest Received A/c               500
(Interest received in cash)

📝 GOLDEN RULES:
• Personal A/c: Debit receiver, Credit giver
• Real A/c: Debit what comes in, Credit what goes out
• Nominal A/c: Debit expenses/losses, Credit income/gains
"""

    # ==========================================
    # PART 13: FINANCIAL RATIOS
    # ==========================================

    def financial_ratios(self, query):
        return """
📊 FINANCIAL RATIOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. LIQUIDITY RATIOS:**

• **Current Ratio** = Current Assets / Current Liabilities
  Ideal: 2:1

• **Quick Ratio** = Quick Assets / Current Liabilities
  Ideal: 1:1

**2. PROFITABILITY RATIOS:**

• **Gross Profit Ratio** = (Gross Profit/Sales) × 100

• **Net Profit Ratio** = (Net Profit/Sales) × 100

• **ROE** = (Net Profit/Equity) × 100

• **ROA** = (Net Profit/Total Assets) × 100

**3. SOLVENCY RATIOS:**

• **Debt-to-Equity** = Total Debt / Total Equity
  Ideal: < 2:1

• **Interest Coverage** = EBIT / Interest Expense
  Ideal: > 3

**4. EFFICIENCY RATIOS:**

• **Inventory Turnover** = COGS / Average Inventory

• **Receivables Turnover** = Net Credit Sales / Avg Receivables

• **Asset Turnover** = Sales / Total Assets

💡 Higher ratios = Better performance (generally)
"""

    # ==========================================
    # PART 14: MAIN PROCESS
    # ==========================================

    def process(self, query):
        q = query.strip().lower()

        # Exit
        if q in ['exit', 'quit', 'bye']:
            return "👋 Goodbye! Keep learning and growing!"

        # Help
        if q == 'help':
            return self.get_help()

        # Try each function
        responses = [
            self.arithmetic(query),
            self.geometry(query),
            self.algebra(query),
            self.statistics(query),
            self.profit_loss(query),
            self.interest(query),
            self.discount(query),
            self.gst(query),
            self.income_tax(query),
        ]

        for response in responses:
            if response:
                return response

        # Accounts specific
        if 'balance sheet' in q or 'balancesheet' in q:
            return self.balance_sheet(q)
        if 'profit and loss' in q or 'p&l' in q or 'profit loss' in q:
            return self.profit_loss_account(q)
        if 'journal' in q:
            return self.journal_entries(q)
        if 'ratio' in q:
            return self.financial_ratios(q)

        return f"🤔 I didn't understand '{query}'\n💡 Type 'help' to see what I can do!"

    def get_help(self):
        return """
📚 HIMO - MATHS + ACCOUNTS HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━

🧮 ARITHMETIC:
• "2+2", "5×3", "10/2"
• "25% of 200"
• "Average of 10,20,30"
• "LCM of 4,6,8"
• "HCF of 12,18"

📐 GEOMETRY:
• "Circle radius 5"
• "Rectangle 4 6"
• "Square side 7"
• "Cube side 3"
• "Sphere radius 4"
• "Cylinder radius 3 height 5"

📊 ALGEBRA:
• "Solve 2x+3=7"
• "Quadratic 1 -3 2"
• "Factors of 24"

📈 STATISTICS:
• "Statistics 2 4 6 8 10"

💰 PROFIT/LOSS:
• "Profit CP=500 SP=700"
• "Loss CP=1000 SP=800"

💹 INTEREST:
• "SI P=10000 R=8 T=3"
• "CI P=10000 R=8 T=3"

🛍️ DISCOUNT:
• "Discount MP=1000 20%"

🏷️ GST:
• "GST price=1000 rate=18"

📊 INCOME TAX:
• "Income tax 1200000"

📊 ACCOUNTS:
• "Balance sheet"
• "Profit and loss account"
• "Journal entries"
• "Financial ratios"

💡 Examples:
• "Calculate 25% of 200"
• "Circle radius 7"
• "Profit CP=500 SP=700"
• "GST 1000 18"
• "Income tax 800000"
"""

# ==========================================
# MAIN FUNCTION
# ==========================================

def main():
    himo = HimoMathsAccounts()

    while True:
        try:
            user_input = input("\nYou > ").strip()
            if not user_input:
                continue

            response = himo.process(user_input)
            print(f"\nHimo > {response}")

        except KeyboardInterrupt:
            print("\n\nHimo > 👋 Goodbye! Keep learning!")
            break
        except Exception as e:
            print(f"Himo > ❌ Error: {e}")

if __name__ == "__main__":
    main()
