import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Auth0 from "react-native-auth0";

const auth0 = new Auth0({
  domain: "dev-2e2z4f5bd70giowe.us.auth0.com",
  clientId: "E3gm2Dy8RoSILXqg2o2yhk8Ma9h7uQWc",
});

export default function AuthPage() {
  const handleLogin = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile email",
      });
      console.log("Logged in!", credentials);
      // You can store credentials.idToken or credentials.accessToken here
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
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
