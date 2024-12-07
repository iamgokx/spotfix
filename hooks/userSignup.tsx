import { useState } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import { useRouter } from "expo-router";
const useSignup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Signup = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://${API_IP_ADDRESS}:8000/api/users/otp`,
        {
          params: { email },
        }
      );
      setIsLoading(false);
      console.log("response data : ", response.data);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Unexpected error occurred.");
        console.error("Axios Error:", err.response?.data || err.message);
      } else {
        setError("Unexpected error occurred.");
        console.error("Unknown Error:", err);
      }
      return null;
    }
  };
  const VerfyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://${API_IP_ADDRESS}:8000/api/users/otp/verify`,
        { params: { email, otp } }
      );
      setIsLoading(false);
      console.log("response data:", response.data);
      if (response.data.userStatus) {
        router.replace("/auth/finalVerification");
        return true;
      }
      if (response.data.otpStatus == false) {
        console.log("opt dont match");
        return false;
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "OTP verification failed.");
        console.error("Axios Error:", err.response?.data || err.message);
      } else {
        setError("Unexpected error occurred.");
        console.error("Unknown Error:", err);
      }
      return null;
    }
  };

  return { Signup, isLoading, error, VerfyOtp };
};

export default useSignup;
