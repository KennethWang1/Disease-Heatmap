import { Text, View } from "react-native";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { StyleSheet } from "react-native";
import { Camera } from "@rnmapbox/maps";
import { useEffect, useRef } from "react";

Mapbox.setAccessToken(
  "pk.eyJ1IjoidHJlZXdoYWNrc3VuIiwiYSI6ImNtZHRzOG9oYTByNGQyaXB6ZXJoOTlscGkifQ.Rm7XvHtehOxhaPHLWHIrog"
);

export default function HomeScreen() {
  const camera = useRef<Camera>(null);
  const flyToToronto = () => {
    camera.current?.setCamera({
      centerCoordinate: [-79.347015, 43.65107], // Toronto [lng, lat]
      zoomLevel: 5,
      animationDuration: 2000,
      animationMode: "flyTo",
    });
  };

  return (
    <>
      <View style={styles.page}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            styleURL="mapbox://styles/mapbox/dark-v11"
            projection="globe"
            scaleBarEnabled={false}
            onPress={flyToToronto}
          >
            <Camera
              ref={camera}
              defaultSettings={{
                centerCoordinate: [-0.1276, 51.5072], // Default to London
                zoomLevel: 2,
              }}
            />
          </MapView>
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
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});
