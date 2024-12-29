import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TruckDetails } from "../../types";
import { GOOGLE_MAPS_API_KEY } from "@env";
import Geocoding from "react-native-geocoding";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { addTruckDetails, updateTruckDetails } from "../../services/database";

Geocoding.init(GOOGLE_MAPS_API_KEY);

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface TruckFormProps {
  truck?: TruckDetails;
  onSuccess: () => void;
}

export const TruckForm = ({ truck, onSuccess }: TruckFormProps) => {
  const [formData, setFormData] = useState({
    currentLocation: truck?.currentLocation || "",
    destinationLocation: truck?.destinationLocation || "",
    weight: truck?.weight.toString() || "",
    dimensions: {
      length: truck?.dimensions.length.toString() || "",
    },
    contactDetails: {
      phone: truck?.contactDetails.phone || "",
      email: truck?.contactDetails.email || "",
    },
  });

  const [currentLocationCoords, setCurrentLocationCoords] =
    useState<Location | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Location | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 20.5937, // Default to valid coordinates
    longitude: 78.9629, // Default to valid coordinates
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentLocationCoords && destinationCoords) {
      const midLat =
        (currentLocationCoords.latitude + destinationCoords.latitude) / 2;
      const midLng =
        (currentLocationCoords.longitude + destinationCoords.longitude) / 2;

      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta:
          Math.abs(
            currentLocationCoords.latitude - destinationCoords.latitude
          ) * 1.5,
        longitudeDelta:
          Math.abs(
            currentLocationCoords.longitude - destinationCoords.longitude
          ) * 1.5,
      });
    }
  }, [currentLocationCoords, destinationCoords]);

  const geocodeAddress = async (address: string): Promise<Location> => {
    try {
      const result = await Geocoding.from(address);
      console.log("Geocoding result:", result); // Log the full response
      if (result.status === "OK" && result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        return {
          latitude: lat,
          longitude: lng,
          address: result.results[0].formatted_address,
        };
      } else {
        throw new Error("No results found for the given address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error(`Failed to geocode address: ${error}`);
    }
  };

  const updateLocationCoordinates = async (
    address: string,
    locationType: "current" | "destination"
  ) => {
    try {
      const coords = await geocodeAddress(address);

      if (locationType === "current") {
        setCurrentLocationCoords(coords);
      } else {
        setDestinationCoords(coords);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find location on map");
    }
  };

  // Debounced updateField function
  const updateField = useCallback(
    (field: string, value: string) => {
      // Clear previous timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      const newTimeoutId = setTimeout(() => {
        if (field === "currentLocation") {
          updateLocationCoordinates(value, "current");
        } else if (field === "destinationLocation") {
          updateLocationCoordinates(value, "destination");
        }
      }, 500); 

      setTimeoutId(newTimeoutId);
    },
    [timeoutId]
  );

  const updateDimension = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value,
      },
    }));
  };

  const updateContactDetail = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const truckData: Omit<TruckDetails, "id" | "createdAt" | "updatedAt"> = {
        currentLocation: formData.currentLocation,
        destinationLocation: formData.destinationLocation,
        weight: Number(formData.weight),
        dimensions: {
          length: Number(formData.dimensions.length),
        },
        contactDetails: {
          phone: formData.contactDetails.phone,
          email: formData.contactDetails.email,
        },
      };

      if (truck?.id) {
        await updateTruckDetails(truck.id, truckData);
      } else {
        await addTruckDetails(truckData);
      }

      Alert.alert("Success", "Load details saved successfully");
      onSuccess();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Location Details</Text>

      <View style={styles.mapContainer}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          {currentLocationCoords && (
            <Marker
              coordinate={{
                latitude: currentLocationCoords.latitude,
                longitude: currentLocationCoords.longitude,
              }}
              title="Current Location"
              pinColor="blue"
            />
          )}
          {destinationCoords && (
            <Marker
              coordinate={{
                latitude: destinationCoords.latitude,
                longitude: destinationCoords.longitude,
              }}
              title="Destination"
              pinColor="red"
            />
          )}
        </MapView>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Current Location"
        value={formData.currentLocation}
        onChangeText={(value) => updateField("currentLocation", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination Location"
        value={formData.destinationLocation}
        onChangeText={(value) => updateField("destinationLocation", value)}
      />

      <Text style={styles.sectionTitle}>Load Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={formData.weight}
        onChangeText={(value) => updateField("weight", value)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Dimensions</Text>
      <TextInput
        style={styles.input}
        placeholder="Length (ft)"
        value={formData.dimensions.length}
        onChangeText={(value) => updateDimension("length", value)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Contact Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.contactDetails.phone}
        onChangeText={(value) => updateContactDetail("phone", value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.contactDetails.email}
        onChangeText={(value) => updateContactDetail("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Saving..." : truck?.id ? "Update Load" : "Add Load"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  mapContainer: {
    height: 250,
    marginBottom: 16,
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#ff0100",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 44,
    marginTop: 16,
    width: "25%",
    alignSelf: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
