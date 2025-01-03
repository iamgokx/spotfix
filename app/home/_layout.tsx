import { TabBar } from "@/components/TabBar";
import MyDrawer from ".";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { IssueProvider } from "../../context/IssueContext";
import { useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import { navigate } from "expo-router/build/global-state/routing";

const HomeLayout = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <IssueProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
        
        >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarStyle: {
              paddingTop: 10,
              backgroundColor: "white",
              elevation: 20,
              height: 70,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
            tabBarIcon: (focused) => (
              <Ionicons
                name="home"
                color={focused ? "#0066ff" : "gray"}
                size={27}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="announcements"
          options={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "white",
              elevation: 20,
              height: 80,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
            tabBarIcon: (focused) => (
              <Ionicons
                name="megaphone"
                color={focused ? "#0066ff" : "gray"}
                size={27}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reportIssue"
          options={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "white",
              elevation: 20,
              height: 80,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
            tabBarIcon: (focused) => (
              <Ionicons
                name="pulse-outline"
                color={focused ? "#0066ff" : "gray"}
                size={27}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "white",
              elevation: 20,
              height: 80,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
            tabBarIcon: (focused) => (
              <Ionicons
                name="analytics"
                color={focused ? "#0066ff" : "gray"}
                size={27}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="proposals"
          options={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "white",
              elevation: 20,
              height: 80,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
          
            tabBarIcon: (focused) => (
              <Ionicons
                name="newspaper"
                color={focused ? "#0066ff" : "gray"}
                size={27}
              />
            ),
          }}
        />
      </Tabs>
    </IssueProvider>
  );
};

export default HomeLayout;
