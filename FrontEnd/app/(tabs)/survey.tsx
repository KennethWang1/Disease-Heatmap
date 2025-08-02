import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useState } from "react";
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
  const [symptomsPressed, setSymptomsPressed] = useState(
    symptoms.map(() => false)
  );

  const changeSymptoms = (index: number) => {
    const updatedSymptoms = symptomsPressed;
    updatedSymptoms[index] = !updatedSymptoms[index];
    setSymptomsPressed(updatedSymptoms);
  };

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
              borderColor: "red",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {symptoms.map((symptom, index) => (
              <Pressable
                style={{
                  backgroundColor: "red",
                  height: scaleHeight(50),
                  width: scaleWidth(100),
                  borderRadius: 40,
                }}
                key={index}
                onPress={() => {
                  changeSymptoms(index);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    color: symptoms[index][1] ? "red" : "blue",
                  }}
                >
                  {symptom[0]}
                </Text>
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
