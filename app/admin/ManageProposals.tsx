import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  CurrentRenderContext,
  NavigationContainer,
} from "@react-navigation/native";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import CitizenProposalCard from "@/components/CitizenProposalCard";
import { Ionicons } from "@expo/vector-icons";
import watermark from "../../assets/images/watermark.png";
const Tab = createMaterialTopTabNavigator();

const ProposalList = ({ status }) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [citizenProposalData, setCitizenProposalData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getUserProposals = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/getCitizenProposals`
      );

      if (response) {
        const sortedData = [...response.data].sort((a, b) =>
          b.date_time_created.localeCompare(a.date_time_created)
        );
        setCitizenProposalData(sortedData);
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

  const approveProposal = async (id) => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/approveProposal`,
        {
          proposalId: id,
        }
      );

      if (response.data.status) {
        getUserProposals();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectProposal = async (id) => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/rejectProposal`,
        {
          proposalId: id,
        }
      );

      if (response.data.status) {
        getUserProposals();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarkest }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        data={citizenProposalData.filter(
          (item) => item.proposal_status === status
        )}
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
        renderItem={({ item }) => (
          <>
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
              suggestionCount={item.suggestion_count}
            />
            {status === "reviewing" && (
              <Animatable.View
                animation={"fadeInLeft"}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                  paddingRight: 20,
                }}>
                <TouchableOpacity
                  onPress={() => approveProposal(item.citizen_proposal_id)}
                  style={{
                    padding: 10,
                    borderRadius: 500,
                    backgroundColor: currentColors.secondary,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                    width: 120,
                  }}>
                  <Ionicons name={"checkmark"} size={24} color={"white"} />
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => rejectProposal(item.citizen_proposal_id)}
                  style={{
                    padding: 10,
                    borderRadius: 500,
                    backgroundColor: "red",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                    width: 120,
                  }}>
                  <Ionicons name={"trash-bin"} size={24} color={"white"} />
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </>
        )}
      />
    </View>
  );
};

const ManageProposals = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: currentColors.backgroundDarkest,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: currentColors.text,
          },
          tabBarIndicatorStyle: {
            backgroundColor: currentColors.secondary,
            height: 3,
          },
        }}>
        <Tab.Screen
          name="Reviewing"
          children={() => <ProposalList status="reviewing" />}
        />
        <Tab.Screen
          name="Approved"
          children={() => <ProposalList status="approved" />}
        />
        <Tab.Screen
          name="Rejected"
          children={() => <ProposalList status="rejected" />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default ManageProposals;
