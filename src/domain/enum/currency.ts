/**
 * Currency codes for each supported country.
 */
export enum Currency {
  AUD = "AUD", // Australian Dollar
  BDT = "BDT", // Bangladeshi Taka
  ZAR = "ZAR", // South African Rand
  CAD = "CAD", // Canadian Dollar
  SGD = "SGD", // Singapore Dollar
  SAR = "SAR", // Saudi Riyal
  EUR = "EUR", // Euro
  QAR = "QAR", // Qatari Riyal
  USD = "USD", // US Dollar
}

/**
 * Mapping of country codes to their respective currencies.
 */
export const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  AU: Currency.AUD, // Australia
  BD: Currency.BDT, // Bangladesh
  ZA: Currency.ZAR, // South Africa
  CA: Currency.CAD, // Canada
  SG: Currency.SGD, // Singapore
  SA: Currency.SAR, // Saudi Arabia
  IT: Currency.EUR, // Italy
  FR: Currency.EUR, // France
  QA: Currency.QAR, // Qatar
  US: Currency.USD, // United States
};

/**
 * Mapping of currencies to their respective locales for Intl.NumberFormat.
 * Using currency-based mapping for more reliable formatting since location can be manually changed.
 */
export const CURRENCY_LOCALE_MAP: Record<Currency, string> = {
  [Currency.AUD]: "en-AU", // Australian English
  [Currency.BDT]: "bn-BD", // Bengali (Bangladesh)
  [Currency.ZAR]: "en-ZA", // South African English
  [Currency.CAD]: "en-CA", // Canadian English
  [Currency.SGD]: "en-SG", // Singapore English
  [Currency.SAR]: "ar-SA", // Arabic (Saudi Arabia)
  [Currency.EUR]: "en-EU", // European English (fallback)
  [Currency.QAR]: "ar-QA", // Arabic (Qatar)
  [Currency.USD]: "en-US", // US English
};
