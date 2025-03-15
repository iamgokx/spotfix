import React, { createContext, useState, useContext } from "react";

interface GovProposalDetails {
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
  estimateTime: string;
  budget: number;
  media: { uri: string; type: string }[];
  documents: { uri: string; type: "pdf" | "doc" | "docx" }[];
  marker: { latitude: string; longitude: string }[];
}

interface GovProposalContextType {
  details: GovProposalDetails;
  setDetails: React.Dispatch<React.SetStateAction<GovProposalDetails>>;
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

interface GovProposalProviderProps {
  children: React.ReactNode;
}

const GovProposalContext = createContext<GovProposalContextType | undefined>(
  undefined
);

export const useGovProposalContext = () => {
  const context = useContext(GovProposalContext);
  if (!context) {
    throw new Error(
      "useGovProposalContext must be used within a GovProposalProvider"
    );
  }
  return context;
};

export const GovProposalProvider: React.FC<GovProposalProviderProps> = ({
  children,
}) => {
  const [details, setDetails] = useState<GovProposalDetails>({
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
    estimateTime: "",
    budget: 0,
    media: [],
    documents: [],
    marker: [],
  });

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      estimateTime: "",
      budget: 0,
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
    <GovProposalContext.Provider
      value={{
        details,
        setDetails,
        clearDetails,
        addMedia,
        removeMedia,
        addDocument,
        removeDocument,
        marker,
        setMarker,
        region,
        setRegion,
      }}>
      {children}
    </GovProposalContext.Provider>
  );
};
