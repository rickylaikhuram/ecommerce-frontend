// services/userService.ts
import instance from "../utils/axios";
import type { User } from "../types/user.types";

export interface UpdatePersonalInfoData {
  name: string;
}

export interface UpdateEmailData {
  email: string;
}

export interface UpdatePhoneData {
  phone: string;
}

export interface VerifyOtpData {
  otp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  errors?: any;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  // Get user profile
  async getUserProfile(): Promise<User> {
    try {
      const response = await instance.get("/api/user/profile");
      return response.data.user;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }

  // Update personal information (name)
  async updatePersonalInfo(data: UpdatePersonalInfoData): Promise<User> {
    try {
      const response = await instance.patch("/api/user/profile/name", data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update personal information"
      );
    }
  }

  // Send OTP for email update
  async sendEmailUpdateOtp(data: UpdateEmailData): Promise<string> {
    try {
      const response = await instance.patch("/api/user/profile/email", data);
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      const errors = error.response?.data?.errors;

      if (errors && errors.email) {
        throw new Error(errors.email[0] || errorMessage);
      }
      throw new Error(errorMessage);
    }
  }

  // Verify OTP for email update
  async verifyEmailUpdateOtp(data: VerifyOtpData): Promise<User> {
    try {
      const response = await instance.patch(
        "/api/user/profile/email/verify",
        data
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
  }

  // Send OTP for phone update
  async sendPhoneUpdateOtp(data: UpdatePhoneData): Promise<string> {
    try {
      const response = await instance.patch("/api/user/profile/phone", data);
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      const errors = error.response?.data?.errors;

      if (errors && errors.phone) {
        throw new Error(errors.phone[0] || errorMessage);
      }
      throw new Error(errorMessage);
    }
  }

  // Verify OTP for phone update
  async verifyPhoneUpdateOtp(data: VerifyOtpData): Promise<User> {
    try {
      const response = await instance.patch(
        "/api/user/profile/phone/verify",
        data
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<string> {
    try {
      const response = await instance.patch(
        "/api/user/profile/change-password",
        data
      );
      return response.data.message; // backend should return { message: "Password updated successfully" }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      throw new Error(errorMessage);
    }
  }
}

export const userService = new UserService();
export default userService;
