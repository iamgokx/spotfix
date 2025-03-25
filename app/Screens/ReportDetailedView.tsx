import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState, useCallback } from "react";
import { clearStorage, getStoredData } from "@/hooks/useJwt";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import watermark from "../../assets/images/watermark.png";
import * as Animatable from "react-native-animatable";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "@/components/branchCoordinators/CustomHeader";
import { ScrollView } from "react-native-gesture-handler";
import { withDecay } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const ReportDetailedView = () => {
  const { id, item } = useLocalSearchParams();

  const [itemValues, setitemValues] = useState(JSON.parse(item));

  const router = useRouter();
  const [issuesData, setIssuesData] = useState([]);

  const [mediaFiles, setmediaFiles] = useState();
  const [mediaFilesIssues, setmediaFilesIssues] = useState();

  useEffect(() => {
    if (itemValues) {
      const mediaArray = itemValues.report_media_files
        ? itemValues.report_media_files.split(",").map((item) => item.trim())
        : [];

      const mediaArrayIssues = itemValues.issue_media_files
        ? itemValues.issue_media_files.split(",").map((item) => item.trim())
        : [];

      console.log("issue media:", mediaArrayIssues);
      console.log("mediaArray:", mediaArray);

      setmediaFiles(mediaArray);
      setmediaFilesIssues(mediaArrayIssues);
    }
  }, []);

  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: currentColors.backgroundDarker,
        paddingBottom: 100,
      }}>
      <StatusBar hidden />
      <Animatable.View
        animation={"slideInDown"}
        style={{
          width: "100%",

          paddingTop: insets.top + 10,

          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          backgroundColor: currentColors.background,
          paddingBottom: 10,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,

            width: "100%",
          }}>
          <TouchableOpacity
            style={{ position: "absolute", left: 10 }}
            onPress={() => {
              router.back();
            }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>

          <Text style={{ color: currentColors.secondary, fontSize: 20 }}>
            Report
          </Text>
        </View>
      </Animatable.View>

      <View style={{ padding: 10, gap: 40 }}>
        <Animatable.View
          animation={"slideInUp"}
          style={{
            width: "100%",
            backgroundColor: currentColors.background,
            flexDirection: "row",
            borderRadius: 20,
            overflow: "hidden",
            marginTop: 20,
          }}>
          {mediaFilesIssues && (
            <Image
              source={{
                uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${mediaFilesIssues[0]}`,
              }}
              resizeMode="cover"
              style={{ width: "30%", borderRadius: 20 }}
            />
          )}

          <View style={{ width: "70%", padding: 10 }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 18,
                fontWeight: "bold",
              }}>
              {itemValues.title}
            </Text>
            <Text style={{ color: currentColors.textShade }}>
              Location: {itemValues.city}, {itemValues.state} -{" "}
              {itemValues.pincode}
            </Text>
            <Text style={{ color: currentColors.text }}>
              {formatDate(itemValues.date_time_created)}
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Text
                style={{
                  backgroundColor: currentColors.secondary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: currentColors.text,
                }}>
                {itemValues.issue_status}
              </Text>
              <Text
                style={{
                  backgroundColor: currentColors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: currentColors.textSecondary,
                }}>
                Priority: {itemValues.priority}
              </Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View
          animation={"slideInUp"}
          style={{
            gap: 10,
            paddingBottom: 40,

            borderBottomWidth: 1,
            borderBottomColor: currentColors.textShade,
          }}>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Feather
              name="user"
              color={currentColors.textShade}
              size={24}></Feather>
            <Text style={{ color: currentColors.secondary, fontSize: 18 }}>
              {" "}
              {itemValues.sub_dep_coordinator_name}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Feather
              name="at-sign"
              color={currentColors.textShade}
              size={24}></Feather>
            <Text style={{ color: currentColors.secondary, fontSize: 18 }}>
              {" "}
              {itemValues.sub_department_coordinator_id}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Feather
              name="phone"
              color={currentColors.textShade}
              size={24}></Feather>
            <Text style={{ color: currentColors.secondary, fontSize: 18 }}>
              {" "}
              {itemValues.sub_dep_coordinator_phone}
            </Text>
          </View>

          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons
              name="calendar"
              color={currentColors.textShade}
              size={24}></Ionicons>
            <Text style={{ color: currentColors.secondary, fontSize: 18 }}>
              {" "}
              {formatDate(itemValues.report_created_at)}
            </Text>
          </View>
        </Animatable.View>

        <Animatable.Text
          animation={"slideInUp"}
          delay={100}
          style={{
            color: currentColors.secondary,
            fontSize: 20,
            fontWeight: 900,
          }}>
          Report Title :{" "}
          <Text
            style={{
              color: currentColors.text,
              fontSize: 18,
              fontWeight: 900,
            }}>
            {itemValues.report_title}
          </Text>
        </Animatable.Text>

        <Animatable.Text
          animation={"slideInUp"}
          delay={150}
          style={{
            color: currentColors.secondary,
            fontSize: 20,
            fontWeight: 900,
          }}>
          Report Description :{" "}
          <Text
            style={{
              color: currentColors.text,
              fontSize: 18,
              fontWeight: 900,
            }}>
            {itemValues.report_description}
          </Text>
        </Animatable.Text>

        <Animatable.View animation={"slideInUp"} delay={200}>
          <Text
            style={{
              color: currentColors.secondary,
              fontSize: 20,
              fontWeight: 900,
            }}>
            Report Images :
          </Text>

          <View style={{ padding: 10, gap: 20 }}>
            {mediaFiles &&
              mediaFiles.map((img, index) => (
                <Image
                  key={`${img}-${index}`}
                  source={{
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/reports/${img}`,
                  }}
                  style={{ width: "100%", height: 250, borderRadius: 20 }}
                />
              ))}
          </View>
        </Animatable.View>
        <Animatable.View animation={"slideInUp"} delay={250}>
          <Text
            style={{
              color: currentColors.secondary,
              fontSize: 20,
              fontWeight: 900,
            }}>
            Issue Images :
          </Text>

          <View style={{ padding: 10, gap: 20 }}>
            {mediaFilesIssues &&
              mediaFilesIssues.map((img, index) => (
                <Image
                  key={`${img}-${index}`}
                  source={{
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${img}`,
                  }}
                  style={{ width: "100%", height: 250, borderRadius: 20 }}
                />
              ))}
          </View>
        </Animatable.View>

        <Animatable.View
          animation={"fadeInUp"}
          style={{
            paddingBottom: insets.bottom + 20,
            gap: 10,
          }}>
          <Image
            source={watermark}
            style={{ width: "100%", height: 100, objectFit: "contain" }}
          />
        </Animatable.View>
      </View>
    </ScrollView>
  );
};
export default ReportDetailedView;
