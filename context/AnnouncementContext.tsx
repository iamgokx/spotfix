import Announcements from "@/app/branchCoordinators/Announcements";
import React, { createContext, useState, useContext } from "react";

interface AnnouncementDetails {
  title: string;
  description: string;

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

interface AnnouncementContextType {
  details: AnnouncementDetails;
  setDetails: React.Dispatch<React.SetStateAction<AnnouncementDetails>>;
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

interface AnnouncementProps {
  children: React.ReactNode;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(
  undefined
);

export const useAnnouncementContext = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error(
      "useAnnouncementContext must be used within a AnnouncementProvider"
    );
  }
  return context;
};

export const AnnouncementProvider: React.FC<AnnouncementProps> = ({
  children,
}) => {
  const [details, setDetails] = useState<AnnouncementDetails>({
   
    title: "",
    description: "",
    
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
     
      title: "",
      description: "",
     
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
    <AnnouncementContext.Provider
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
    </AnnouncementContext.Provider>
  );
};
