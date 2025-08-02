import { scaleHeight, scaleWidth } from "@/utils/scale";
import { ScrollView, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <>
      <ScrollView
        style={{}}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        //For the first row
        <View
          style={{
            height: scaleHeight(200),
            width: scaleWidth(390),
            backgroundColor: "000000",
            flexDirection: "row",
            gap: scaleWidth(15),
            alignItems: "center",
          }}
        >
          //For the first box in the first row
          <View
            style={{
              width: scaleWidth(150),
              height: scaleHeight(150),
              backgroundColor: "#23272A",
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: scaleWidth(15),
              flex: 1,
              borderRadius: 40,
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 30,
                color: "red",
              }}
            >
              HOT
              {/* To be changed */}
            </Text>
          </View>
          //For the second box in the first row
          <View
            style={{
              width: scaleWidth(150),
              height: scaleHeight(150),
              backgroundColor: "#23272A",
              display: "flex",
              justifyContent: "flex-start",
              flex: 1,
              marginRight: scaleWidth(15),
              borderRadius: 40,
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlignVertical: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              HOT
              {/* To be changed */}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: scaleHeight(200),
            width: scaleWidth(390),
            backgroundColor: "000000",
            flexDirection: "row",
            gap: scaleWidth(15),
            alignItems: "center",
          }}
        >
          //Second Row //For the first box in the second row
          <View
            style={{
              width: scaleWidth(150),
              height: scaleHeight(150),
              backgroundColor: "#23272A",
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: scaleWidth(15),
              marginTop: scaleHeight(-50),
              flex: 1,
              borderRadius: 40,
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlignVertical: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              HOT
              {/* to be changed */}
            </Text>
          </View>
          //For the second box in the second row
          <View
            style={{
              width: scaleWidth(150),
              height: scaleHeight(150),
              backgroundColor: "#23272A",
              display: "flex",
              justifyContent: "flex-start",
              flex: 1,
              marginRight: scaleWidth(15),
              marginTop: scaleHeight(-50),
              borderRadius: 40,
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlignVertical: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              HOT
              {/* to be changed */}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: scaleWidth(370),
            height: scaleHeight(210),
            backgroundColor: "#23272A",
            marginBottom: scaleHeight(20),
            marginTop: scaleHeight(-25),
            borderRadius: 40,
          }}
        ></View>
        <View
          style={{
            width: scaleWidth(370),
            height: scaleHeight(210),
            backgroundColor: "#23272A",
            borderRadius: 40,
            marginBottom: scaleHeight(50),
          }}
        ></View>
      </ScrollView>
    </>
  );
}
