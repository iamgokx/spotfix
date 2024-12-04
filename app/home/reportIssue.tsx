import Issue from "../issues/issue";
import IssueLocation from "../issues/issueLocation";
import IssueMedia from "../issues/IssueMedia";
import IssueMap from "../issues/IssueMap";
import { View, Text } from "react-native";
import { useState } from "react";
const reportIssue = () => {
  const [isVisibleTitleScreen, setisVisibleTitleScreen] = useState(true);
  const [isVisibleAddressScreen, setisVisibleAddressScreen] = useState(false);
  const [isMapVisible, setisMapVisible] = useState(false);
  const [isMediaScreenVisible, setisMediaScreenVisible] = useState(false);

  const goToAddressScreen = () => {
    setisVisibleTitleScreen(false);
    setisVisibleAddressScreen(true);
    setisMapVisible(false);
    setisMediaScreenVisible(false);
  };
  const goToTitleScreen = () => {
    setisVisibleTitleScreen(true);
    setisVisibleAddressScreen(false);
    setisMapVisible(false);
    setisMediaScreenVisible(false);
  };
  const goToMapScreen = () => {
    setisVisibleTitleScreen(false);
    setisVisibleAddressScreen(false);
    setisMapVisible(true);
    setisMediaScreenVisible(false);
  };
  const goToMediaScreen = () => {
    setisVisibleTitleScreen(false);
    setisVisibleAddressScreen(false);
    setisMapVisible(false);
    setisMediaScreenVisible(true);
  };
  return (
    <View style={{ flex: 1 }}>
      {isVisibleTitleScreen && <Issue goToAddressScreen={goToAddressScreen} />}
      {isVisibleAddressScreen && (
        <IssueLocation
          goToTitleScreen={goToTitleScreen}
          goToMapScreen={goToMapScreen}
          goToMediaScreen={goToMediaScreen}
        />
      )}
      {isMapVisible && <IssueMap goToAddressScreen={goToAddressScreen} />}
      {isMediaScreenVisible && (
        <IssueMedia goToAddressScreen={goToAddressScreen} />
      )}
    </View>
  );
};
export default reportIssue;
