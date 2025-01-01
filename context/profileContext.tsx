import React, { createContext, useState, useContext } from "react";

interface ProfileDetails {
  media: { uri: string; type: string }[];
}

interface ProfileContextType {
  details: ProfileDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProfileDetails>>;
  clearDetails: () => void;
  addMedia: (mediaItem: { uri: string; type: "image" | "video" }) => void;
  removeMedia: (uri: string) => void;
}

interface ProfileProviderProps {
  children: React.ReactNode;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a IssueProvider");
  }
  return context;
};

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [details, setDetails] = useState<ProfileDetails>({
    media: [],
  });

  const clearDetails = () => {
    setDetails({
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
    <ProfileContext.Provider
      value={{ details, setDetails, clearDetails, addMedia, removeMedia }}>
      {children}
    </ProfileContext.Provider>
  );
};
