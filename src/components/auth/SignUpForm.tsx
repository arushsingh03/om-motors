import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// @ts-ignore
import { signUp } from "../../services/auth";
import { User } from "../../types";

export const SignUpForm = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("driver");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await signUp(email, password, name, role);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color="#ff0100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#020617"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#ff0100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#020617"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#ff0100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#020617"
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
          dropdownIconColor="#ff0100"
        >
          <Picker.Item label="Driver" value="driver" />
          <Picker.Item label="Motor Owner" value="motor_owner" />
          <Picker.Item label="Transporter" value="transporter" />
        </Picker>
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signInLink}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB", 
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#FFFFFF", 
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#000000", 
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB", 
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#FFFFFF", 
  },
  picker: {
    color: "#374151", 
  },
  button: {
    backgroundColor: "#ff0100", 
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5B4FC", 
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signInLink: {
    marginTop: 16,
    alignItems: "center",
  },
  signInText: {
    color: "#ff0100", 
    fontWeight: "bold",
  },
});
