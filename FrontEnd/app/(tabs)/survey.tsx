import { scaleHeight, scaleWidth } from "@/utils/scale";
import { Pressable, ScrollView, Text, View } from "react-native";
// import SurveyButton from "../../components/SurveyButton";

export default function Survey() {
  const symptoms = [
    ["Fever", false],
    ["Cough", false],
    ["Shortness of Breath", false],
    ["Fatigue", false],
    ["Muscle Pain", false],
    ["Loss of Taste or Smell", false],
    ["Sore Throat", false],
    ["Headache", false],
    ["Chills", false],
    ["Congestion or Runny Nose", false],
  ];
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        //For the entire survey
        <View
          style={{
            marginTop: scaleHeight(200),
            marginBottom: scaleHeight(200),
            height: scaleHeight(1000),
            width: scaleWidth(390),
            backgroundColor: "#000000",
            flexDirection: "column",
            gap: scaleHeight(20),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 40,
          }}
        >
          <View
            style={{
              height: scaleHeight(400),
              width: scaleWidth(390),
              borderColor: "#23272A",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {symptoms.map((symptom, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  
                }}
              >
                {symptom}
              </Pressable>
            ))}
          </View>
          <View
            style={{
              height: scaleHeight(400),
              width: scaleWidth(390),
              borderColor: "#23272A",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
          <View
            style={{
              height: scaleHeight(400),
              width: scaleWidth(390),
              borderColor: "#23272A",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>

          <View
            style={{
              height: scaleHeight(100),
              width: scaleWidth(390),
              borderColor: "#23272A",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
        </View>
      </ScrollView>
    </>
  );
}
