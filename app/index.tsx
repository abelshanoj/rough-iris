import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { GoogleSignin, statusCodes, isSuccessResponse, isErrorWithCode } from '@react-native-google-signin/google-signin';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import CLIENT_IDS from "@/keys";
import { NavigationProp } from '@react-navigation/native';
import { useRouter,router } from "expo-router";

GoogleSignin.configure({
  webClientId: CLIENT_IDS.web,
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/classroom.courses',
    'https://www.googleapis.com/auth/classroom.coursework.me',
    'https://www.googleapis.com/auth/classroom.coursework.students',
    'https://www.googleapis.com/auth/classroom.rosters',
    'https://www.googleapis.com/auth/classroom.announcements',
    'https://www.googleapis.com/auth/classroom.guardianlinks.students',
    'https://www.googleapis.com/auth/classroom.profile.emails',
  ],
  offlineAccess: true,
  iosClientId: CLIENT_IDS.ios,
});

interface IndexProps {
  navigation: NavigationProp<any>;
}

export default function LoginScreen({ navigation }: IndexProps) {
  
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const tokens = await GoogleSignin.getTokens();
        if (tokens) {
          const { accessToken } = tokens;
          console.log("Access Token: ", accessToken);
          router.push(`/main?accessToken=${accessToken}`,{ relativeToDirectory: true })
        } else {
          console.log("Token not generated..");
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Sign-in in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available or outdated");
            break;
          default:
            console.log("Sign-in error:", error);
        }
      } else {
        console.log("Non-Google sign-in error:", error);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1D2671", "#C33764"]} // Gradient colors (top to bottom)
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iris</Text>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          style={styles.googleButton}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  googleButton: {
    width: 250,
    height: 60,
  },
});

