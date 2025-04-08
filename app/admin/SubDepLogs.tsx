import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";

const Tab = createMaterialTopTabNavigator();

const AdminDepLogs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [depNameLogs, setDepNameLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDepLogs = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubDepCoordNameLogs`
      );
      if (response.data.status) {
        setDepNameLogs(response.data.logs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDepLogs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    const utcDate = new Date(item.timestamp);
    const formattedDate = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return (
      <View
        key={`deplog-${item.id}-${item.timestamp}-${index}`}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          width: "100%",
        }}>
        <Text style={{ fontWeight: "bold" }}>{item.action}</Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>ID : </Text>{" "}
          {item.id}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>Old data : </Text>
          {item.oldData}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>New data: </Text>{" "}
          {item.newData}
        </Text>
        <Text style={{ color: "gray" }}>
          <Text style={{ color: currentColors.secondary }}>Timestamp : </Text>{" "}
          {formattedDate}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        data={depNameLogs}
        keyExtractor={(item, index) =>
          `depName${item.id || index}-${item.timestamp}`
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const AdminNameLogs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [depCoordNameLogs, setDepCoordNameLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDepLogs = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubDepPincodesLogs`
      );
      if (response.data.status) {
        setDepCoordNameLogs(response.data.logs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDepLogs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    const utcDate = new Date(item.timestamp);
    const formattedDate = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <View
        key={`depcoordnamelog-${item.id}-${item.timestamp}-${index}`}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          width: "100%",
        }}>
       <Text style={{ fontWeight: "bold" }}>{item.action}</Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>ID : </Text>{" "}
          {item.id}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>Old data : </Text>
          {item.oldData}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>New data: </Text>{" "}
          {item.newData}
        </Text>
        <Text style={{ color: "gray" }}>
          <Text style={{ color: currentColors.secondary }}>Timestamp : </Text>{" "}
          {formattedDate}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        keyExtractor={(item, index) =>
          `depCoordNamelogs${item.id || index}-${item.timestamp}`
        }
        data={depCoordNameLogs}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const AdminEmailLogs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [depCoordEmailLogs, setDepCoordEmailLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDepLogs = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubDepCoordEmailLogs`
      );
      if (response.data.status) {
        setDepCoordEmailLogs(response.data.logs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDepLogs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    const utcDate = new Date(item.timestamp);
    const formattedDate = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <View
        key={`emaillog-${item.id}-${item.timestamp}-${index}`}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          width: "100%",
        }}>
        <Text style={{ fontWeight: "bold" }}>{item.action}</Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>ID : </Text>{" "}
          {item.id}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>Old data : </Text>
          {item.oldData}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>New data: </Text>{" "}
          {item.newData}
        </Text>
        <Text style={{ color: "gray" }}>
          <Text style={{ color: currentColors.secondary }}>Timestamp : </Text>{" "}
          {formattedDate}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        data={depCoordEmailLogs}
        keyExtractor={(item, index) =>
          `emaillog${item.id || index}-${item.timestamp}`
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};
const AdminPhoneLogs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [depCoordEmailLogs, setDepCoordEmailLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDepLogs = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubDepCoordPhoneLogs`
      );
      if (response.data.status) {
        setDepCoordEmailLogs(response.data.logs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDepLogs();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    const utcDate = new Date(item.timestamp);
    const formattedDate = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <View
        key={`emaillog-${item.id}-${item.timestamp}-${index}`}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          width: "100%",
        }}>
        <Text style={{ fontWeight: "bold" }}>{item.action}</Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>ID : </Text>{" "}
          {item.id}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>Old data : </Text>
          {item.oldData}
        </Text>
        <Text style={{ color: currentColors.text }}>
          <Text style={{ color: currentColors.secondary }}>New data: </Text>{" "}
          {item.newData}
        </Text>
        <Text style={{ color: "gray" }}>
          <Text style={{ color: currentColors.secondary }}>Timestamp : </Text>{" "}
          {formattedDate}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <FlatList
        data={depCoordEmailLogs}
        keyExtractor={(item, index) =>
          `emaillog${item.id || index}-${item.timestamp}`
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};


const SubDepLogs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: currentColors.backgroundDarkest,
            },
            tabBarStyle: { backgroundColor: "black" },
            tabBarActiveTintColor: "#fff",
            tabBarIndicatorStyle: { backgroundColor: "#fff", height: 3 },
          }}>
          <Tab.Screen name="Name" component={AdminDepLogs} />
          <Tab.Screen name="Pincodes" component={AdminNameLogs} />
          <Tab.Screen name="Email" component={AdminEmailLogs} />
          <Tab.Screen name="Phone" component={AdminPhoneLogs} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default SubDepLogs;
