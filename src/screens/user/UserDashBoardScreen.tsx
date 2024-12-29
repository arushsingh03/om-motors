import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import { TruckList } from "../../components/shared/TruckList";
import { getAllTrucks } from "../../services/database";
import { TruckDetails, UserProfile } from "../../types";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { logOut } from "../../services/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const UserDashboardScreen = () => {
  const [trucks, setTrucks] = useState<TruckDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    phone: "+1234567890",
    address: "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setUserProfile(userData);
        }
      }
    };

    loadUserData();

    const loadTrucks = async () => {
      try {
        setLoading(true);
        const trucksData = await getAllTrucks();
        setTrucks(trucksData);
      } catch (error) {
        Alert.alert("Error", "Failed to load trucks");
      } finally {
        setLoading(false);
      }
    };

    loadTrucks();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logOut();
            Alert.alert("Logged out successfully");
            // Optionally navigate to the login screen after logout
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        }
        Alert.alert("Error", "Phone call not supported");
      })
      .catch((error) => Alert.alert("Error", "Failed to make call"));
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });

      if (!result.canceled) {
        Alert.alert("Success", "Document uploaded successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload document");
    }
  };

  const handleUpdateProfile = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      if (!auth.currentUser) return;

      // Update profile info in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        address: userProfile.address,
        password: newPassword ? newPassword : userProfile.password,
      });

      Alert.alert("Success", "Profile updated successfully");
      setProfileModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0100" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Trucks</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setProfileModalVisible(true)}
            style={styles.iconButton}
          >
            <Feather name="user" size={24} color="#ff0100" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Feather name="log-out" size={24} color="#ff0100" />
          </TouchableOpacity>
        </View>
      </View>

      <TruckList
        trucks={trucks}
        onCall={handleCall}
        onUploadReceipt={handleUploadDocument}
      />

      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <View style={styles.formField}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{auth.currentUser?.email}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={userProfile.address}
                onChangeText={(text) =>
                  setUserProfile((prev) => ({ ...prev, address: text }))
                }
                placeholder="Enter Address"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerButtons: { flexDirection: "row", gap: 12 },
  iconButton: { padding: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "white", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  formField: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  value: { fontSize: 16, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#f3f4f6" },
  cancelButtonText: { color: "#333" },
  updateButton: { backgroundColor: "#ff0100" },
  updateButtonText: { color: "white" },
});
