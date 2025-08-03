import { scaleHeight, scaleWidth } from "@/utils/scale";
import { Text, View } from "react-native";
import { getToday } from "@/API_requests/Get";
import { useEffect, useState } from "react";
import { netChange as fetchNetChange } from "@/API_requests/Get";
import { getDiseaseOutbreaks } from "@/API_requests/Get";

export default function Dashboard() {
  const [today, setToday] = useState(0);
  const [error, setError] = useState("");
  const [netChange, setNetChange] = useState(0);
  const [diseaseType, setDiseaseType] = useState("");
  useEffect(() => {
    async function fetchTodayCount() {
      try {
        const { data: todayD } = await getToday();
        setToday(todayD.count); // adjust to match response shape
      } catch (err: any) {
        console.error("Error fetching today's reports:", err);
        setError(err.message);
      }
    }

    fetchTodayCount();
  }, []);
  useEffect(() => {
    async function fetchDiseaseData() {
      try {
        const { data: disease } = await getDiseaseOutbreaks();
        setDiseaseType(disease.type); // adjust to match response shape

        // Handle your response here - examples:
        // setDiseaseType(response.diseaseType);
        // setDiseaseData(response);
        // etc.
      } catch (error) {
        console.error("Failed to fetch disease data:", error);
        // Handle error - set error state, show toast, etc.
      }
    }

    fetchDiseaseData();
  }, []); // Runs once when component mounts

  useEffect(() => {
    async function fetchNetChangeData() {
      try {
        const { data: netChangeD } = await fetchNetChange();
        setNetChange(netChangeD.change); // adjust to match response shape
      } catch (err: any) {
        console.error("Error fetching today's reports:", err);
        setError(err.message);
      }
    }
    fetchNetChangeData();
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          gap: scaleHeight(2),
        }}
      >
        <View
          style={{
            backgroundColor: "#000000",
            width: "100%",
            height: scaleHeight(180),
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: scaleWidth(40),
          }}
        >
          <View
            style={{
              backgroundColor: "#23272A",
              width: scaleWidth(160),
              height: scaleHeight(150),
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                textAlign: "center",
                marginTop: scaleHeight(20),
              }}
            >
              {diseaseType || "No Data"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#23272A",
              width: scaleWidth(160),
              height: scaleHeight(150),
              borderRadius: 16,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                textAlign: "center",
                width: "100%",
              }}
            >
              {netChange > 0 ? "Increasing" : "Decreasing"}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#000000",
            width: "100%",
            height: scaleHeight(180),
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: scaleWidth(40),
          }}
        >
          <View
            style={{
              backgroundColor: "#23272A",
              width: scaleWidth(160),
              height: scaleHeight(150),
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                textAlign: "center",
                marginTop: scaleHeight(20),
              }}
            >
              Most people feel
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 24,
                textAlign: "center",
                marginTop: scaleHeight(20),
              }}
            >
              Most people feel
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#23272A",
              width: scaleWidth(160),
              height: scaleHeight(150),
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: "#7A7E81",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Reports Submitted Today
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 32,
                textAlign: "center",
              }}
            >
              {today}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
