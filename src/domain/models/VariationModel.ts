
export interface VariantValue {
  value: string;
  id: string;
}
export interface VariationModel {
  id: string,
  name: string,
  category: string,
  variations?: VariantValue[],
  variant_values?: VariantValue[],
}
