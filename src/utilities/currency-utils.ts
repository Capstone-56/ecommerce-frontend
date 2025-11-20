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
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Formats a price with the given amount and currency.
 * @param amount The numeric price amount
 * @param currency The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string or 'no currency available' if invalid
 */
export function formatPrice(amount: number, currency: string): string {
    // Example with "Price not available"
  if (amount == null) {
    return 'Price not available';
  }
    return formatCurrency(amount, currency);
  }
