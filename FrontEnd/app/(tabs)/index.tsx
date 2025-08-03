import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  HeatmapLayer,
  CircleLayer,
} from "@rnmapbox/maps";
import * as Location from "expo-location";

Mapbox.setAccessToken(
  "pk.eyJ1IjoidHJlZXdoYWNrc3VuIiwiYSI6ImNtZHRzOG9oYTByNGQyaXB6ZXJoOTlscGkifQ.Rm7XvHtehOxhaPHLWHIrog"
);

const geojson: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    [-74.006, 40.7128],
    [-74.005, 40.7138],
    [-74.007, 40.7118],
    [-118.2437, 34.0522],
    [-118.2537, 34.0532],
    [-118.2337, 34.0512],
    [-87.6298, 41.8781],
    [-87.6398, 41.8791],
    [-87.6198, 41.8771],
    [-95.3698, 29.7604],
    [-95.3798, 29.7614],
    [-95.3598, 29.7594],
    [-79.3832, 43.6532],
    [-79.3832, 43.6532],
    [-79.3832, 43.6532],
    [-79.3787, 43.6601],
    [-79.375, 43.648],
    [-79.3942, 43.6555],
    [-79.39, 43.645],
    [-79.3732, 43.6432],
    [-79.38, 43.64],
    [-79.3632, 43.6592],
    [-79.41, 43.665],
    [-79.347, 43.6511],
    [-79.4297, 43.6629],
    [-79.4163, 43.7001],
  ].map((coordinates) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {}, // Required!
  })),
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState("");
  const camera = useRef<Camera>(null);

  // 1. Get location (but don't set camera here)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      if (location) {
        setLocation(location);
        console.log(
          "📍 User location:",
          location.coords.longitude,
          location.coords.latitude
        );
      }
    })();
  }, []);

  // 2. Once camera and location are ready, center the map
  useEffect(() => {
    if (location && camera.current) {
      camera.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 10,
        animationMode: "flyTo",
        animationDuration: 2000,
      });
    }
  }, [location, camera.current]);

  // Optional fallback to fly to Toronto
  const flyToToronto = () => {
    camera.current?.setCamera({
      centerCoordinate: [-79.3832, 43.6532], // Toronto [lng, lat]
      zoomLevel: 10,
      animationDuration: 2000,
      animationMode: "flyTo",
    });
  };

  return (
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
              centerCoordinate: location
                ? [location.coords.longitude, location.coords.latitude]
                : [104.89847, 11.56362], // Fallback to Cambodia
              zoomLevel: 10,
              animationMode: "flyTo",
              animationDuration: 2000,
            }}
          />
          <ShapeSource id="locations" shape={geojson}>
            <HeatmapLayer
              id="heatmap-layer"
              sourceID="locations"
              maxZoomLevel={5}
              style={{
                heatmapWeight: 1,
                heatmapIntensity: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  1,
                  9,
                  3,
                ],
                heatmapColor: [
                  "interpolate",
                  ["linear"],
                  ["heatmapDensity"],
                  0,
                  "rgba(33,102,172)",
                  0.2,
                  "rgb(103,169,207)",
                  0.4,
                  "rgb(124,252,0)",
                  0.6,
                  "rgb(253,219,199)",
                  0.8,
                  "rgb(239,138,98)",
                  1,
                  "rgb(178,24,43)",
                ],
                heatmapRadius: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  2,
                  9,
                  20,
                ],
                heatmapOpacity: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  1,
                  9,
                  0,
                ],
              }}
            />

            <CircleLayer
              id="point-layer"
              sourceID="locations"
              minZoomLevel={7}
              maxZoomLevel={12}
              style={{
                circleRadius: 5,
                circleColor: "rgb(178,24,43)",
                circleStrokeColor: "white",
                circleStrokeWidth: 1,
                circleOpacity: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7,
                  0,
                  8,
                  1,
                ],
              }}
            />
          </ShapeSource>
        </MapView>
      </View>
    </View>
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
