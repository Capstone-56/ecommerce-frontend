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
  US: Currency.USD, // America
};
