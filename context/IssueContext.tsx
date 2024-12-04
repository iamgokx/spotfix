import React, { createContext, useState, useContext } from "react";

interface IssueDetails {
  title: string;
  description: string;
  suggestions: string;
  department: string;
  latitude: string;
  longitude: string;
  generatedState: string;
  generatedCity: string;
  generatedPincode: string;
  generatedAddress: string;
  generatedLocality: string;
  media: { uri: string; type: string }[];
}

interface IssueContextType {
  details: IssueDetails;
  setDetails: React.Dispatch<React.SetStateAction<IssueDetails>>;
  clearDetails: () => void;
  addMedia: (mediaItem: { uri: string; type: "image" | "video" }) => void;
  removeMedia: (uri: string) => void;
}

interface IssueProviderProps {
  children: React.ReactNode;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssueContext = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssueContext must be used within a IssueProvider");
  }
  return context;
};

export const IssueProvider: React.FC<IssueProviderProps> = ({ children }) => {
  const [details, setDetails] = useState<IssueDetails>({
    title: "",
    description: "",
    suggestions: "",
    department: "",
    latitude: "",
    longitude: "",
    generatedState: "",
    generatedCity: "",
    generatedPincode: "",
    generatedAddress: "",
    generatedLocality: "",
    media: [],
  });

  const clearDetails = () => {
    setDetails({
      title: "",
      description: "",
      suggestions: "",
      department: "",
      latitude: "",
      longitude: "",
      generatedState: "",
      generatedCity: "",
      generatedPincode: "",
      generatedAddress: "",
      generatedLocality: "",
      media: [],
    });
  };

  const addMedia = (mediaItem: { uri: string; type: "image" | "video" }) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      media: [...prevDetails.media, mediaItem],
    }));
  };

  const removeMedia = (uri: string) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      media: prevDetails.media.filter((item) => item.uri !== uri),
    }));
  };

  return (
    <IssueContext.Provider
      value={{ details, setDetails, clearDetails, addMedia, removeMedia }}>
      {children}
    </IssueContext.Provider>
  );
};
