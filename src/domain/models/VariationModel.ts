
export interface VariantValue {
  value: string;
  id: string;
}
export interface VariationModel {
  id: string,
  name: string,
  categories: string[],
  variations?: VariantValue[],
}
