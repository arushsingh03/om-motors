import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { TruckDetails } from "../../types";
import { Feather } from "@expo/vector-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface TruckListProps {
  trucks: TruckDetails[];
  isAdmin?: boolean;
  onEdit?: (truck: TruckDetails) => void;
  onDelete?: (truck: TruckDetails) => void;
  onCall: (phoneNumber: string) => void;
  onUploadReceipt: (truckId: string) => void;
}

export const TruckList = ({
  trucks,
  isAdmin,
  onEdit,
  onDelete,
  onCall,
  onUploadReceipt,
}: TruckListProps) => {
  const renderItem = ({ item: truck }: { item: TruckDetails }) => (
    <View style={styles.card}>
      <Text style={styles.truckId}>Load #{truck.id.slice(0, 6)}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Current Location:</Text>
        <Text style={styles.value}>{truck.currentLocation}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Destination:</Text>
        <Text style={styles.value}>{truck.destinationLocation}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Weight:</Text>
        <Text style={styles.value}>{truck.weight} kg</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Dimensions:</Text>
        <Text style={styles.value}>
          {truck.dimensions.length}ft
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactHeader}>Contact Details</Text>
        <View style={styles.contactRow}>
          <Text>Phone: {truck.contactDetails.phone}</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onCall(truck.contactDetails.phone)}
          >
            <Feather name="phone" size={20} color="#ff0100" />
          </TouchableOpacity>
        </View>
        <Text>Email: {truck.contactDetails.email}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={() => onUploadReceipt(truck.id)}
        >
          <Feather name="upload" size={16} color="white" />
          <Text style={styles.buttonText}>Upload Receipt</Text>
        </TouchableOpacity>

        {isAdmin && (
          <View style={styles.adminButtons}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => onEdit?.(truck)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => onDelete?.(truck)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={trucks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  truckId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    width: 120,
  },
  value: {
    flex: 1,
  },
  contactSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  contactHeader: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconButton: {
    padding: 8,
  },
  actionButtons: {
    marginTop: 16,
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButton: {
    backgroundColor: "#ff0100",
    alignSelf: 'flex-start',
  },
  editButton: {
    backgroundColor: "#ff0100",
  },
  deleteButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});