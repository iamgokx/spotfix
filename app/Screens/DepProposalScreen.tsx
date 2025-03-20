import CustomHeader from "@/components/CustomHeader";
import { View, Text, RefreshControl, Image, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import GovProposalCard from "@/components/GovProposalCard";
import * as Animatable from "react-native-animatable";
import { getStoredData } from "@/hooks/useJwt";
import watermark from "../../assets/images/watermark.png";
import { Ionicons } from "@expo/vector-icons";
const DepProposalScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;
  const [govProposalData, setgovProposalData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProposalDate, setfilteredProposalDate] = useState([]);

  const getUserProposals = async () => {
    const user = await getStoredData();
    const useremail = user.email;
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/getIndividualDepProposals`,
        {
          email: useremail,
        }
      );

      if (response) {
        setgovProposalData(response.data);
        setfilteredProposalDate(response.data);
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

  useEffect(() => {
    const filtered = govProposalData?.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setfilteredProposalDate(filtered);
  }, [searchQuery, govProposalData]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: currentColors.backgroundDarkest,
        width: "100%",
      }}>
       <View
          style={{
            backgroundColor: currentColors.backgroundLighter,
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 30,
            paddingHorizontal: 10,
            overflow: "hidden",
            marginVertical : 10,
          }}>
          <TextInput
            style={{ width: "90%", color: currentColors.text }}
            placeholder="Search for proposals..."
            placeholderTextColor={currentColors.textShade}
            value={searchQuery}
            onChangeText={(text)=> setSearchQuery(text)}
          />
          <Ionicons name="search" color={currentColors.secondary} size={24} />
        </View>
      
 
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        data={filteredProposalDate}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
        }}
       
        ListFooterComponent={
          <View
            style={{
              marginTop: 100,
              paddingBottom: insets.bottom + 100,
              gap: 10,
          
              width: "100%",
              alignItems : 'center', justifyContent : 'center'
            }}>
            <Image
              source={watermark}
              style={{ width: 300, height: 100, objectFit: "contain" }}
            />
          </View>
        }></FlatList>
    </View>
  );
};

export default DepProposalScreen;
