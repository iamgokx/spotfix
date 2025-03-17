import CustomHeader from "@/components/CustomHeader";
import { View, Text, RefreshControl, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import GovProposalCard from "@/components/GovProposalCard";

import watermark from "../../assets/images/watermark.png";
import * as Animatable from "react-native-animatable";
const HomeDepartmentProposals = ({ navigation }: any) => {
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;
  const [govProposalData, setgovProposalData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const getUserProposals = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/getGovProposals`
      );

      if (response) {
        const sortedData = [...response.data].sort((a, b) => b.date_time_created.localeCompare(a.date_time_created));
        setgovProposalData(sortedData);
      }
    } catch (error) {
      console.log("error getting citizen proposals", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserProposals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    getUserProposals();
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        data={govProposalData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <Animatable.View
            animation={"fadeInUp"}
            style={{
              marginTop: 100,
              paddingBottom: insets.bottom + 100,
              gap: 10,
            }}>
            <Image
              source={watermark}
              style={{ width: 300, height: 100, objectFit: "contain" }}
            />
          </Animatable.View>
        }
        ListHeaderComponent={(item) => {
          return <Text style={{ marginTop: 10 }}></Text>;
        }}
        ItemSeparatorComponent={(item) => {
          return (
            <Text
              style={{
                // backgroundColor: currentColors.textShade,
                height: 1,
                marginVertical: 20,
              }}></Text>
          );
        }}
        renderItem={({ item }: any) => {
          return (
            <GovProposalCard
              govProposalId={item.gov_proposal_id}
              username={item.department_name}
              dateTimeCreated={item.date_time_created}
              latitude={item.latitude}
              longitude={item.longitude}
              title={item.title}
              description={item.proposal_description}
              mediaFiles={item.media_files}
              profilePicture={""}
              suggestionCount={item.suggestion_count}
            />
          );
        }}></FlatList>
    </View>
  );
};

export default HomeDepartmentProposals;
