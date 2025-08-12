// src/services/userService.ts
import axios from "../utils/axios";
import type { User } from "../types/user.types";

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await axios.get("/api/user/profile");
    return response.data.user;
  },

  updateProfile: async (
    data: Partial<Pick<User, "name" | "phone">>
  ): Promise<User> => {
    const response = await axios.put("/api/user/profile", data);
    return response.data;
  },

  updatePhone: async (phone: string): Promise<User> => {
    const response = await axios.patch("/api/user/profile", { phone });
    return response.data;
  },
};
