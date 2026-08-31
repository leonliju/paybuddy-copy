/**
 * Centralized Chart Color & Theme System for PayBuddy
 * - Consistent, high-contrast, visually distinct colors for every category
 * - Theme-matched to Obsidian / Metallic Silver / Vibrant Category Accents
 * - Shared tooltips, renderers, and formatters for Recharts
 */

// Master Category Color Mapping
export const CATEGORY_COLORS = {
  Food: '#00D09C',          // Crisp Emerald Green (Dining, Groceries, Cafes)
  'Food & Dining': '#00D09C',
  Travel: '#38BDF8',        // Electric Sky Blue (Flights, Fuel, Cabs, Transit)
  Transport: '#38BDF8',
  Commute: '#38BDF8',
  Bills: '#F59E0B',         // Vibrant Warm Amber (Electricity, Water, WiFi, Subscriptions)
  Utilities: '#F59E0B',
  Shopping: '#A855F7',      // Radiant Royal Violet (E-commerce, Apparel, Electronics)
  Retail: '#A855F7',
  Education: '#3B82F6',     // Deep Sapphire Blue (Courses, Tuition, Books)
  Medical: '#EF4444',       // Crimson Coral Red (Pharmacy, Doctor, Diagnostics)
  Healthcare: '#EF4444',
  Health: '#EF4444',
  Entertainment: '#EC4899', // Vibrant Rose Pink (Movies, Streaming, Events, Gaming)
  Investment: '#10B981',    // Forest Jade Green (Mutual Funds, Stocks, Gold)
  Investments: '#10B981',
  Savings: '#06B6D4',       // Cyan Blue
  Income: '#22C55E',        // Vivid Mint Green
  Salary: '#14B8A6',        // Teal Cyan
  Personal: '#8B5CF6',      // Purple
  Other: '#71717A',         // Refined Cool Slate (Miscellaneous)
  Uncategorized: '#71717A',
};

// Distinct fallback palette for arbitrary or unknown categories
// Arranged with alternating hues to guarantee adjacent pie slices and bars have high visual contrast
export const FALLBACK_CHART_PALETTE = [
  '#00D09C', // Emerald
  '#38BDF8', // Sky Blue
  '#F59E0B', // Amber
  '#A855F7', // Violet
  '#EF4444', // Red
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#64748B', // Slate
];

/**
 * Returns a consistent color for a given category name.
 * Normalizes strings and falls back to a high-contrast palette if unknown.
 */
export function getCategoryColor(category, index = 0) {
  if (!category) return FALLBACK_CHART_PALETTE[index % FALLBACK_CHART_PALETTE.length];
  
  const key = String(category).trim();
  
  // Direct match
  if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key];
  
  // Case-insensitive match
  const lowerKey = key.toLowerCase();
  for (const [catName, color] of Object.entries(CATEGORY_COLORS)) {
    if (catName.toLowerCase() === lowerKey) return color;
  }
  
  // Substring / keyword matching
  if (lowerKey.includes('food') || lowerKey.includes('dine') || lowerKey.includes('eat') || lowerKey.includes('rest')) return CATEGORY_COLORS.Food;
  if (lowerKey.includes('travel') || lowerKey.includes('uber') || lowerKey.includes('ola') || lowerKey.includes('fuel') || lowerKey.includes('flight')) return CATEGORY_COLORS.Travel;
  if (lowerKey.includes('bill') || lowerKey.includes('util') || lowerKey.includes('recharge') || lowerKey.includes('rent')) return CATEGORY_COLORS.Bills;
  if (lowerKey.includes('shop') || lowerKey.includes('cloth') || lowerKey.includes('amazon') || lowerKey.includes('flipkart')) return CATEGORY_COLORS.Shopping;
  if (lowerKey.includes('edu') || lowerKey.includes('course') || lowerKey.includes('book') || lowerKey.includes('fee')) return CATEGORY_COLORS.Education;
  if (lowerKey.includes('med') || lowerKey.includes('health') || lowerKey.includes('pharma') || lowerKey.includes('doctor')) return CATEGORY_COLORS.Medical;
  if (lowerKey.includes('movie') || lowerKey.includes('stream') || lowerKey.includes('game') || lowerKey.includes('ent')) return CATEGORY_COLORS.Entertainment;
  if (lowerKey.includes('invest') || lowerKey.includes('stock') || lowerKey.includes('fund') || lowerKey.includes('sip')) return CATEGORY_COLORS.Investment;
  if (lowerKey.includes('income') || lowerKey.includes('salary') || lowerKey.includes('earn')) return CATEGORY_COLORS.Income;

  return FALLBACK_CHART_PALETTE[Math.abs(index) % FALLBACK_CHART_PALETTE.length];
}

/**
 * Currency formatter helper for INR
 */
export function formatINR(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Chart Tooltip Style Preset
 */
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#121214',
  borderColor: 'rgba(255, 255, 255, 0.18)',
  borderRadius: '16px',
  color: '#FFFFFF',
  padding: '10px 14px',
  boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
};

/**
 * Common Animation Config for smooth entrance
 */
export const CHART_ANIMATION = {
  animationDuration: 850,
  animationEasing: 'ease-out',
  animationBegin: 0,
};
