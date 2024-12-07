import React, { createContext, useState, useContext } from "react";

interface SignupDetails {
  name: string;
  phoneNumber: string;
  aadharCardNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  password: string;
  generatedCountry: string;
  generatedState: string;
  generatedCity: string;
  generatedDistrict: string;
  generatedTaluka: string;
  generatedPincode: string;
  generatedAddress: string;
  locality: string;
}

interface SignupContextType {
  details: SignupDetails;
  setDetails: React.Dispatch<React.SetStateAction<SignupDetails>>;
  clearDetails: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignupContext = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignupContext must be used within a SignupProvider");
  }
  return context;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [details, setDetails] = useState<SignupDetails>({
    name: "",
    phoneNumber: "",
    aadharCardNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    password: "",
    generatedCountry: "",
    generatedState: "",
    generatedCity: "",
    generatedDistrict: "",
    generatedTaluka: "",
    generatedPincode: "",
    generatedAddress: "",
    locality: "",
  });

  const clearDetails = () => {
    setDetails({
      name: "",
      phoneNumber: "",
      aadharCardNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
      password: "",
      generatedCountry: "",
      generatedState: "",
      generatedCity: "",
      generatedDistrict: "",
      generatedTaluka: "",
      generatedPincode: "",
      generatedAddress: "",
      locality: "",
    });
  };

  return (
    <SignupContext.Provider value={{ details, setDetails, clearDetails }}>
      {children}
    </SignupContext.Provider>
  );
};
