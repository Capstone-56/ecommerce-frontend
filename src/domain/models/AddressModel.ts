export interface AddressModel {
  addressLine: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

export interface AddressModelData {
  id: string;
  address: AddressModel;
  isDefault: boolean;
}
