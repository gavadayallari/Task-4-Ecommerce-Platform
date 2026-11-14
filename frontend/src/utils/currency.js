/**
 * Currency utility helpers for formatting amounts in Indian Rupees (INR - ₹).
 */

export const CURRENCY_SYMBOL = '₹';

/**
 * Format a number as Indian Rupee (INR) currency.
 * e.g. 129999 -> "₹1,29,999.00"
 * 
 * @param {number|string} amount
 * @param {boolean} includeDecimals (default: true)
 * @returns {string}
 */
export const formatPrice = (amount, includeDecimals = true) => {
  const num = Number(amount);
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0.00`;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(num);
};

export default formatPrice;

