import { useState } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getUser`,
        {
          email,
          password,
        }
      );
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      return null;
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
