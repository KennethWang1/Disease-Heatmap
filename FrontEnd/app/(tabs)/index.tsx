import { Text, View } from "react-native";
import Globe3D from "@/components/Globe";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { StyleSheet } from "react-native";

Mapbox.setAccessToken(
  "pk.eyJ1IjoidHJlZXdoYWNrc3VuIiwiYSI6ImNtZHRzOG9oYTByNGQyaXB6ZXJoOTlscGkifQ.Rm7XvHtehOxhaPHLWHIrog"
);

export default function HomeScreen() {
  return (
    <>
      <View style={styles.page}>
        <View style={styles.container}>
          <MapView style={styles.map} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});
