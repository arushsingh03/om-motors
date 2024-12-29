import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TruckList } from "../../components/shared/TruckList";
import { TruckForm } from "../../components/admin/TruckForm";
import { getAllTrucks, deleteTruckDetails } from "../../services/database";
import { TruckDetails } from "../../types";

export const AdminDashboardScreen = () => {
  const [trucks, setTrucks] = useState<TruckDetails[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckDetails | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const trucksData = await getAllTrucks();
      // Convert the database data to match our TruckDetails interface
      const formattedTrucks: TruckDetails[] = trucksData.map((truck) => ({
        id: truck.id,
        currentLocation: truck.currentLocation,
        destinationLocation: truck.destinationLocation || "",
        weight: truck.weight,
        dimensions: {
          length: truck.dimensions?.length || 0,
        },
        contactDetails: {
          phone: truck.contactDetails?.phone || "",
          email: truck.contactDetails?.email || "",
        },
        createdAt: truck.createdAt,
        updatedAt: truck.updatedAt,
      }));
      setTrucks(formattedTrucks);
    } catch (error) {
      Alert.alert("Error", "Failed to load loads", [
        { text: "Retry", onPress: loadTrucks },
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (truck: TruckDetails) => {
    setSelectedTruck(truck);
  };

  const handleDelete = async (truck: TruckDetails) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this load?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTruckDetails(truck.id);
              await loadTrucks();
              Alert.alert("Success", "Load deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete load");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Load Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedTruck(undefined);
            setShowAddForm(true);
          }}
        >
          <Text style={styles.addButtonText}>Add New Load</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading loads...</Text>
        </View>
      ) : showAddForm || selectedTruck ? (
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {selectedTruck ? "Edit Load" : "Add New Load"}
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddForm(false);
                setSelectedTruck(undefined);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TruckForm
            truck={selectedTruck}
            onSuccess={() => {
              setShowAddForm(false);
              setSelectedTruck(undefined);
              loadTrucks();
            }}
          />
        </View>
      ) : (
        <TruckList
          trucks={trucks}
          isAdmin
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#ff0100",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  formHeader: {
    backgroundColor: "#e5e7eb",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#ff0100",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 16,
  },
});
