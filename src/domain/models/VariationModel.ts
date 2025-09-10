
export interface VariantValue {
  value: string;
  id: string;
}
export interface VariationModel {
  id: string,
  name: string,
  category: string,
  variant_values: VariantValue[],
}
