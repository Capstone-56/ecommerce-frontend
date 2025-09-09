import { Currency, CURRENCY_LOCALE_MAP } from "@/domain/enum/currency";

/**
 * Formats a price using Intl.NumberFormat with the appropriate locale for the given currency.
 * @param amount The numeric amount to format
 * @param currency The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string (e.g., '$123.45', '€123,45')
 */
export function formatCurrency(amount: number, currency: string): string {
  // Get the locale for the currency, fallback to en-AU if not found
  const locale = CURRENCY_LOCALE_MAP[currency as Currency] || 'en-AU';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    console.warn(`Currency formatting failed for ${currency} with locale ${locale}:`, error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Formats a price object with amount and currency properties.
 * @param price Object containing amount and currency, or null/undefined
 * @returns Formatted currency string or 'no currency available' if price is invalid
 */
export function formatPrice(price: { amount: number; currency: string } | null | undefined): string {
    if (!price || !price.currency) {
      return 'no currency available';
    }
    return formatCurrency(price.amount, price.currency);
  }
