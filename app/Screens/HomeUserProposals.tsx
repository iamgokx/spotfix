import CustomHeader from "@/components/CustomHeader";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import CitizenProposalCard from "@/components/CitizenProposalCard";
const HomeUserProposals = ({ navigation }: any) => {
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;
  const [citizenProposalData, setCitizenProposalData] = useState();
  const getUserProposals = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/getCitizenProposals`,
        {
          email: "gokul lekhwar",
        }
      );

      if (response) {
        console.log("data received : ", response.data);
        setCitizenProposalData(response.data);
      }
    } catch (error) {
      console.log("error getting citizen proposals", error);
    }
  };

  useEffect(() => {
    getUserProposals();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        data={citizenProposalData}
        ListFooterComponent={
          <View style={{ width: "100%", height: 100, margin: 30 }}>
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins_300Light",
              }}>
              Nothing more to view.
            </Text>
          </View>
        }
        ListHeaderComponent={(item) => {
          return <Text style={{ marginTop: 10 }}></Text>;
        }}
        renderItem={({ item }: any) => {
          return (
            <CitizenProposalCard
              proposalId={item.citizen_proposal_id}
              username={item.citizen_name}
              dateTimeCreated={item.date_time_created}
              latitude={item.latitude}
              longitude={item.longitude}
              title={item.title}
              description={item.proposal_description}
              mediaFiles={item.media_files}
              profilePicture={item.citizen_picture_name}
            />
          );
        }}></FlatList>
    </View>
  );
};

export default HomeUserProposals;
