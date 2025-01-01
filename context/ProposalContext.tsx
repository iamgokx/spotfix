import React, { createContext, useState, useContext } from "react";

interface ProposalDetails {
  username: string;
  anonymous: boolean;
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
  documents: { uri: string; type: "pdf" | "doc" | "docx" }[];
  marker: { latitude: string; longitude: string }[];
}

interface ProposalContextType {
  details: ProposalDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProposalDetails>>;
  clearDetails: () => void;
  addMedia: (mediaItem: { uri: string; type: "image" | "video" }) => void;
  removeMedia: (uri: string) => void;
  addDocument: (documentItem: {
    uri: string;
    type: "pdf" | "doc" | "docx";
  }) => void;
  removeDocument: (uri: string) => void;

  marker: { latitude: number; longitude: number } | null;
  setMarker: React.Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number } | null>
  >;

  // New: Region state for map
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;
  setRegion: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    } | null>
    >;
}

interface ProposaProviderProps {
  children: React.ReactNode;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export const useProposalContext = () => {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error(
      "useProposalContext must be used within a ProposalProvider"
    );
  }
  return context;
};

export const ProposalProvider: React.FC<ProposaProviderProps> = ({
  children,
}) => {
  const [details, setDetails] = useState<ProposalDetails>({
    username: "",
    anonymous: false,
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
    documents: [],
    marker: [],
  });

  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  // New: Region state for the map
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const clearDetails = () => {
    setDetails({
      username: "",
      anonymous: false,
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
      documents: [],
      marker: [],
    });

    setMarker(null);
    setRegion(null);
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

  const addDocument = (documentItem: {
    uri: string;
    type: "pdf" | "doc" | "docx";
  }) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      documents: [...prevDetails.documents, documentItem],
    }));
  };

  const removeDocument = (uri: string) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      documents: prevDetails.documents.filter((item) => item.uri !== uri),
    }));
  };

  return (
    <ProposalContext.Provider
      value={{
        details,
        setDetails,
        clearDetails,
        addMedia,
        removeMedia,
        addDocument,
        removeDocument,
        marker, // Providing marker state
        setMarker, // Providing marker state updater
        region, // Providing region state
        setRegion, 
      }}>
      {children}
    </ProposalContext.Provider>
  );
};
