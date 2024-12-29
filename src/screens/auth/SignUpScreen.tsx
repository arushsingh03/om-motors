import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SignUpForm } from "../../components/auth/SignUpForm";

export const SignUpScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ImageBackground
      source={require("../../../assets/background.png")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Sign up to embark on a seamless experience
          </Text>
        </View>
        <View style={styles.formContainer}>
          <SignUpForm navigation={navigation} />
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
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28, 
    fontWeight: "700", 
    color: "#ff0100", 
    textAlign: "center",
    textShadowRadius: 4,
    textShadowColor: "#1e293b",
    textShadowOffset: { width: 2, height: 2 },
  },
  subtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    textShadowRadius: 4,
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white", 
    borderRadius: 12,
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
