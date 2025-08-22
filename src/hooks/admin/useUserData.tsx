// hooks/useUserData.ts
import { useState, useCallback } from "react";
import instance from "../../utils/axios";
import type {
  User,
  Admin,
  TabType,
  ApiResponse,
} from "../../types/admin/user.types";

export const useUserData = () => {
  const [data, setData] = useState<(User | Admin)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (endpoint: string, dataKey: TabType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await instance.get<ApiResponse<User | Admin>>(endpoint);
      const responseData = response.data[dataKey] || [];
      setData(responseData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch data";
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
