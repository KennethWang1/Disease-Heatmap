import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";

export default function LoginPage() {
  const handleLogin = () => {
    Linking.openURL(
      "https://dev-2e2z4f5bd70giowe.us.auth0.com/authorize?response_type=code&client_id=E3gm2Dy8RoSILXqg2o2yhk8Ma9h7uQWc&redirect_uri=http://localhost:3000/callback"
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24, marginBottom: 20 }}>
        Welcome
      </Text>
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#1E90FF",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Login with Auth0</Text>
      </TouchableOpacity>
    </View>
  );
}
