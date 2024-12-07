import Issue from "../issues/issue";
import IssueLocation from "../issues/issueLocation";
import IssueMedia from "../issues/IssueMedia";
import IssueMap from "../issues/IssueMap";
import SaveIssue from "../issues/SaveIssue";
import { View } from "react-native";
import { useState } from "react";

const REPORT_SCREENS = {
  TITLE: "title",
  ADDRESS: "address",
  MAP: "map",
  MEDIA: "media",
  SAVING: "saving",
};

const ReportIssue = () => {
  const [currentScreen, setCurrentScreen] = useState(REPORT_SCREENS.TITLE);

  const renderScreen = () => {
    switch (currentScreen) {
      case REPORT_SCREENS.TITLE:
        return (
          <Issue
            goToAddressScreen={() => setCurrentScreen(REPORT_SCREENS.ADDRESS)}
          />
        );
      case REPORT_SCREENS.ADDRESS:
        return (
          <IssueLocation
            goToTitleScreen={() => setCurrentScreen(REPORT_SCREENS.TITLE)}
            goToMapScreen={() => setCurrentScreen(REPORT_SCREENS.MAP)}
            goToMediaScreen={() => setCurrentScreen(REPORT_SCREENS.MEDIA)}
          />
        );
      case REPORT_SCREENS.MAP:
        return (
          <IssueMap
            goToAddressScreen={() => setCurrentScreen(REPORT_SCREENS.ADDRESS)}
          />
        );
      case REPORT_SCREENS.MEDIA:
        return (
          <IssueMedia
            goToAddressScreen={() => setCurrentScreen(REPORT_SCREENS.ADDRESS)}
            goToSavingScreen={() => setCurrentScreen(REPORT_SCREENS.SAVING)}
          />
        );
      case REPORT_SCREENS.SAVING:
        return <SaveIssue />;
      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

export default ReportIssue;
