import React, { useState, useEffect } from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";

GoogleSignin.configure({
  webClientId:
    "570857851821-m50d9eli4d2g4d0s4a8eimnt39luokpm.apps.googleusercontent.com",
});

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userToken");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error retrieving login state:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await AsyncStorage.setItem("userToken", JSON.stringify(userInfo));
      setUser(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login process");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services not available");
      } else {
        console.error("Sign-in error:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem("userToken");
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff724c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {user ? (
        <HomeScreen user={user} onSignOut={handleSignOut} />
      ) : (
        <AuthScreen onSignIn={handleGoogleSignIn} />
      )}
    </NavigationContainer>
  );
};

export default App;
