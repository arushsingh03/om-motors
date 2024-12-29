import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SignInForm } from "../../components/auth/SignInForm";

export const SignInScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Om Motors</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
        <View style={styles.formContainer}>
          <SignInForm navigation={navigation} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ff0100",
    textAlign: "center",
    textShadowRadius: 4,
    textShadowColor: "#1e293b",
    textShadowOffset: { width: 2, height: 2 },
  },
  subtitle: {
    fontSize: 18,
    color: "#D1D5DB",
    marginTop: 8,
    textShadowRadius: 4,
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.49)",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
