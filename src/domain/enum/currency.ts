/**
 * Currency codes for each supported country.
 */
export enum Currency {
  AUD = "AUD", // Australian Dollar
  BDT = "BDT", // Bangladeshi Taka
  BRL = "BRL", // Braizilian Real
  GBR = "GBR", // British Pound
  CAD = "CAD", // Canadian Dollar
  CNY = "CNY", // Chinese Yuan
  EUR = "EUR", // Euro
  GHS = "GHS", // Ghanaian Cedi,
  INR = "INR", // Indian Rupee
  JPY = "JPY", // Japanese Yen
  MYR = "MYR", // Malaysian Ringgit
  MVR = "MVR", // Maldivian Rufiyaa
  MXN = "MXN", // Mexican Peso
  PKR = "PKR", // Pakistani Rupee
  QAR = "QAR", // Qatari Riyal
  SAR = "SAR", // Saudi Riyal
  SGD = "SGD", // Singapore Dollar
  ZAR = "ZAR", // South African Rand
  AED = "AED", // UAE Dirham
  USD = "USD", // US Dollar
}

/**
 * Mapping of country codes to their respective currencies.
 */
export const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  AU: Currency.AUD,   // Australia
  BD: Currency.BDT,   // Bangladesh
  BR: Currency.BRL,   // Brazil
  CA: Currency.CAD,   // Canada
  CN: Currency.CNY,   // China
  FR: Currency.EUR,   // France
  DE: Currency.EUR,   // Germany
  GH: Currency.GHS,   // Ghana
  IN: Currency.INR,   // India
  IT: Currency.EUR,   // Italy
  JP: Currency.JPY,   // Japan
  MY: Currency.MYR,   // Malaysia
  MV: Currency.MVR,   // Maldives
  MX: Currency.MXN,   // Mexico
  PK: Currency.PKR,   // Pakistan
  QA: Currency.QAR,   // Qatar
  SA: Currency.SAR,   // Saudi Arabia
  SG: Currency.SGD,   // Singapore
  ZA: Currency.ZAR,   // South Africa
  UAE: Currency.AED,  // United Arab Emirates
  UK: Currency.GBR,   // United Kingdom
  US: Currency.USD,   // United States
};

/**
 * Mapping of currencies to their respective locales for Intl.NumberFormat.
 * Using currency-based mapping for more reliable formatting since location can be manually changed.
 */
export const CURRENCY_LOCALE_MAP: Record<Currency, string> = {
  [Currency.AUD]: "en-AU", // English (Australia)
  [Currency.BDT]: "bn-BD", // Bengali (Bangladesh)
  [Currency.BRL]: "pt-BR", // Portuguese (Brazil)
  [Currency.CAD]: "en-CA", // English (Canada)
  [Currency.CNY]: "zh-CN", // Chinese (China, Simplified)
  [Currency.EUR]: "en-EU", // English (Europe)
  [Currency.GHS]: "en-GH", // English (Ghana)
  [Currency.INR]: "en-IN", // English (India)
  [Currency.JPY]: "ja-JP", // Japanese (Japan)
  [Currency.MYR]: "ms-MY", // Bahasa Malaysia (Malaysia)
  [Currency.MVR]: "dv-MV", // Dhivehi (Maldives)
  [Currency.MXN]: "es-MX", // Spanish (Mexico)
  [Currency.PKR]: "en-IN", // English (India)
  [Currency.QAR]: "ar-QA", // Arabic (Qatar)
  [Currency.SAR]: "ar-SA", // Arabic (Saudi Arabia)
  [Currency.SGD]: "en-SG", // English (Singapore)
  [Currency.ZAR]: "en-ZA", // English (South Africa)
  [Currency.AED]: "ar-AE", // Arabic (United Arab Emirates)
  [Currency.GBR]: "en-UK", // English (United Kingdom)
  [Currency.USD]: "en-US", // English (United States)
};
