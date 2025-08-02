// LoginPage.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Auth0 from 'react-native-auth0';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your navigation stack params (adjust as needed)
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Initialize Auth0 client
const auth0 = new Auth0({
  domain: 'dev-2e2z4f5bd70giowe.us.auth0.com',
  clientId: 'E3gm2Dy8RoSILXqg2o2yhk8Ma9h7uQWc',
});

export default function LoginPage({ navigation }: Props) {
  const handleLogin = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
      });

      // Optionally send the access token to your backend for storing UID
      await fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      navigation.replace('Home'); // Navigate to Home on success
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login with Auth0</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#23272A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
