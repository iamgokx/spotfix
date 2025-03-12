import { createContext, useContext, useState, ReactNode } from "react";

interface SubBranchCoordinator {
  name: string;
  departmentName: string;
  email: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  password: string;
}

interface SubBranchContextType {
  coordinator: SubBranchCoordinator;
  setCoordinator: (details: SubBranchCoordinator) => void;
  clearCoordinator: () => void;
}

const defaultCoordinator: SubBranchCoordinator = {
  name: "",
  departmentName: "",
  email: "",
  phoneNumber: "",
  latitude: 0,
  longitude: 0,
  password: "",
};

const SubBranchContext = createContext<SubBranchContextType | undefined>(
  undefined
);

export const SubBranchProvider = ({ children }: { children: ReactNode }) => {
  const [coordinator, setCoordinatorState] =
    useState<SubBranchCoordinator>(defaultCoordinator);

  const setCoordinator = (details: SubBranchCoordinator) => {
    setCoordinatorState(details);
  };

  const clearCoordinator = () => {
    setCoordinatorState(defaultCoordinator);
  };

  return (
    <SubBranchContext.Provider
      value={{ coordinator, setCoordinator, clearCoordinator }}>
      {children}
    </SubBranchContext.Provider>
  );
};

export const useSubBranch = () => {
  const context = useContext(SubBranchContext);
  if (!context) {
    throw new Error("useSubBranch must be used within a SubBranchProvider");
  }
  return context;
};
