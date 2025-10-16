export interface AddressModel {
  addressLine: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

// typedefs for api
export interface AddressModelData {
  id: string;
  address: AddressModel;
  isDefault: boolean;
}

export type MutateAddressData = {
  address: AddressModel;
  makeDefault?: boolean;
};
