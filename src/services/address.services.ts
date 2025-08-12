import axios from "../utils/axios"; // Your configured Axios instance
import type { Address } from "../types/user.types";

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  label?: string;
  isDefault?: boolean;
}

class AddressService {
  // Create a new address
  async createAddress(data: CreateAddressPayload): Promise<Address> {
    const response = await axios.post("api/user/address",  { address: data });
    return response.data.address;
  }

  // Get all addresses of the logged-in user
  async getAddresses(): Promise<Address[]> {
    const response = await axios.get("api/user/address");
    return response.data.addresses;
  }

  // Update an address
  async updateAddress(
    addressId: string,
    data: Partial<CreateAddressPayload>
  ): Promise<Address> {
    const response = await axios.put(`api/user/address/${addressId}`, { address: data });
    return response.data.address;
  }

  // Delete an address
  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const response = await axios.delete(`api/user/address/${addressId}`);
    return response.data;
  }

  // Set default address
  async setDefaultAddress(addressId: string): Promise<{ message: string }> {
    const response = await axios.patch(`api/user/address/${addressId}/default`);
    return response.data;
  }
}

const addressService = new AddressService();
export default addressService;
