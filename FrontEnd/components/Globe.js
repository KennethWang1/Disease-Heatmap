//ai code

import {
  Atmosphere,
  Camera,
  Logger,
  MapView,
  RasterDemSource,
  SkyLayer,
  Terrain,
} from "@rnmapbox/maps";
import { useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../assets/mapbox-config"; // Import your config

// Enable logging for debugging
Logger.setLogLevel("verbose");

const Globe3D = () => {
  const [projection, setProjection] = useState("globe");
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const cameraRef = useRef(null);

  const toggleProjection = () => {
    setProjection(projection === "globe" ? "mercator" : "globe");
  };

  const flyToLocation = (coordinates, zoomLevel = 8, pitch = 30) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      zoomLevel: zoomLevel,
      pitch: pitch,
      animationDuration: 2500,
    });
  };

  const presetLocations = [
    { name: "🌍 Globe View", coords: [0, 20], zoom: 1.5, pitch: 0 },
    { name: "🏔️ Himalayas", coords: [86.925, 27.9881], zoom: 8, pitch: 60 },
    { name: "🌊 Pacific", coords: [-150, 0], zoom: 3, pitch: 30 },
    { name: "🏜️ Sahara", coords: [10, 20], zoom: 5, pitch: 45 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <MapView
        style={styles.map}
        projection={projection}
        styleURL="mapbox://styles/mapbox/satellite-streets-v12"
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [0, 20],
            zoomLevel: 1.8,
            pitch: 15,
            heading: 0,
          }}
        />

        <RasterDemSource
          id="mapbox-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={514}
          maxZoomLevel={14}
        >
          {/* 3D Terrain */}
          <Terrain
            style={{
              exaggeration: 1.8, // More dramatic terrain for Android
            }}
          />

          {/* Atmosphere Effect */}
          {showAtmosphere && (
            <Atmosphere
              style={{
                color: "rgb(186, 210, 235)",
                highColor: "rgb(36, 92, 223)",
                horizonBlend: 0.03,
                spaceColor: "rgb(11, 11, 25)",
                starIntensity: 0.9,
              }}
            />
          )}

          {/* Sky Layer */}
          <SkyLayer
            id="sky-layer"
            style={{
              skyType: "atmosphere",
              skyAtmosphereSun: [0.0, 0.0],
              skyAtmosphereSunIntensity: 18.0,
            }}
          />
        </RasterDemSource>
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleProjection}
        >
          <Text style={styles.buttonText}>
            {projection === "globe" ? "🗺️ Flat" : "🌍 Globe"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowAtmosphere(!showAtmosphere)}
        >
          <Text style={styles.buttonText}>
            {showAtmosphere ? "🌌 Hide Space" : "⭐ Show Space"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationPanel}>
        {presetLocations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() =>
              flyToLocation(location.coords, location.zoom, location.pitch)
            }
          >
            <Text style={styles.navButtonText}>{location.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  map: {
    flex: 1,
  },
  topControls: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  navigationPanel: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  navButton: {
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  navButtonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default Globe3D;
