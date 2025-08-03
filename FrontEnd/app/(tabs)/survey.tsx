import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Slider from "@react-native-community/slider";

export default function Survey() {
  //For the symptoms
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
    const updatedSymptoms = [...symptomsPressed];
    updatedSymptoms[index] = !updatedSymptoms[index];
    setSymptomsPressed(updatedSymptoms);
  };

  //For the slider of how the respondant is feeling
  const [sliderValue, setSliderValue] = useState(1);

  const submit = () => {
    const symptomsShown = [];
    for (let i = 0; i < symptoms.length; i++) {
      if (symptomsPressed[i]) {
        symptomsShown.push(symptoms[i][0]);
      }
    }
    return symptomsShown;
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
          //For the question about symptoms
          <View
            style={{
              paddingTop: scaleHeight(20),
              height: scaleHeight(400),
              width: scaleWidth(390),
              borderColor: "#23272A",
              borderRadius: 40,
              borderWidth: 4,
              gap: scaleHeight(20),
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                color: "white",
                paddingBottom: scaleHeight(8),
              }}
            >
              Click all of the symptoms you are experiencing:
            </Text>
            {symptoms.map((symptom, index) => (
              <Pressable
                style={{
                  borderColor: "#D9D9D9",
                  borderWidth: 1,
                  backgroundColor: symptomsPressed[index]
                    ? "#D9D9D9"
                    : "#000000",
                  height: scaleHeight(50),
                  width: scaleWidth(100),
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index}
                onPress={() => {
                  changeSymptoms(index);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: symptomsPressed[index] ? "#000000" : "#D9D9D9",
                    fontSize: 12,
                  }}
                >
                  {symptom[0]}
                </Text>
              </Pressable>
            ))}
          </View>
          //For the scale from 1-5 of how the respondant is feeling
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
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={1}
              maximumValue={5}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              value={sliderValue}
              onValueChange={(value) => setSliderValue(value)}
            />
            <Text
              style={{
                color: "white",
              }}
            >
              {sliderValue}
            </Text>
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
          //For the submit button
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
