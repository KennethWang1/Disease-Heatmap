import { findDiseaseOutbreak } from "@/API_requests/Post";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
// import * as SecureStore from "expo-secure-store";

// import Slider from "@react-native-community/slider";

export default function Survey() {
  /*For the symptoms*/
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

  //For how the respondant is feeling
  const ratings = [
    [1, false],
    [2, false],
    [3, false],
    [4, false],
    [5, false],
  ];

  const [ratingPressed, setRatingPressed] = useState(ratings.map(() => false));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeRating = (index: number) => {
    const updatedRating = ratingPressed.map((_, i) => i == index);
    setRatingPressed(updatedRating);
  };

  const submit = async () => {
    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);

    const symptomsShown = [];
    let wellnessNumber = 0;

    for (let i = 0; i < symptoms.length; i++) {
      if (symptomsPressed[i]) {
        symptomsShown.push(symptoms[i][0]);
      }
    }

    for (let i = 0; i < ratings.length; i++) {
      if (ratingPressed[i]) {
        wellnessNumber = i + 1; // Fixed: adding 1 since ratings are 1-5, not 0-4
      }
    }

    try {
      const isSuccess = await findDiseaseOutbreak(
        "name",
        symptomsShown,
        wellnessNumber,
        3,
        0.24
      );

      // isSuccess is now the value of response.ok
      if (isSuccess) {
        Alert.alert(
          "Success",
          "You have successfully submitted your survey for t"
        );
        console.log("Response was OK (status 200-299)");
      } else {
        Alert.alert(
          "Error",
          "You have already submitted the survey today. Try again tomorrow."
        );
        console.log("Response was not OK (status outside 200-299 range)");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              How bad are your symptoms, on a scale of 1-5?
            </Text>
            {ratings.map((ratings, index) => (
              <Pressable
                style={{
                  borderColor: "#D9D9D9",
                  borderWidth: 1,
                  backgroundColor: ratingPressed[index] ? "#D9D9D9" : "#000000",
                  height: scaleHeight(50),
                  width: scaleWidth(100),
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index}
                onPress={() => {
                  changeRating(index);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: ratingPressed[index] ? "#000000" : "#D9D9D9",
                    fontSize: 12,
                  }}
                >
                  {ratings[0]}
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
          >
            <Pressable
              style={{
                height: scaleHeight(100),
                width: scaleWidth(390),
              }}
              onPress={() => submit()}
            ></Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
