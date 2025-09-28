import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Share,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";

// 👇 Apna TomTom API key yahan daalo
const TOMTOM_API_KEY = "3gk1CnKeQxpqjlphTxMf2Aj85IkA8ePR";

const JourneyScreen = () => {
  const [originLocation, setOriginLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedJourneyType, setSelectedJourneyType] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // 🔎 Geocoding
  const fetchCoordinates = async (placeName, type) => {
    try {
      if (!placeName.trim()) return;
      const response = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
          placeName
        )}.json?key=${TOMTOM_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lon } = data.results[0].position;

        if (type === "origin") {
          setOriginCoords({ latitude: lat, longitude: lon });
        } else if (type === "destination") {
          setDestinationCoords({ latitude: lat, longitude: lon });
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // 🚗 Routing API
  const fetchRoute = async () => {
    if (!originCoords || !destinationCoords) return;

    try {
      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${originCoords.latitude},${originCoords.longitude}:${destinationCoords.latitude},${destinationCoords.longitude}/json?key=${TOMTOM_API_KEY}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].legs[0].points.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        }));
        setRouteCoords(points);
      }
    } catch (error) {
      console.error("Routing error:", error);
    }
  };

  const journeyTypes = [
    {
      id: "mountain",
      name: "Mountain",
      icon: "terrain",
      description: "Explore nature trails safely",
    },
    {
      id: "road",
      name: "Road Trip",
      icon: "directions-car",
      description: "Long drives, scenic routes",
    },
  ];

  const safetyTips = [
    {
      icon: "location-on",
      text: "Avoid poorly lit areas at night, especially in unfamiliar neighborhoods.",
      type: "warning",
    },
    {
      icon: "warning",
      text: "High-risk zone identified near your destination. Consider alternative routes.",
      type: "alert",
    },
    {
      icon: "info",
      text: "Stay updated on local alerts and emergency protocols from official sources.",
      type: "info",
    },
  ];

  const handleJourneyTypeSelect = (typeId) => {
    setSelectedJourneyType(typeId);
  };

  const handleFindRoute = () => {
    if (!originCoords || !destinationCoords) {
      Alert.alert("Error", "Please enter valid origin and destination");
      return;
    }
    fetchRoute();
  };

  const handleShareTrip = async () => {
    try {
      await Share.share({
        message: `🚗 Trip Plan\n\nOrigin: ${originLocation}\nDestination: ${destination}\nStart: ${startDate.toDateString()}\nEnd: ${endDate.toDateString()}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const onChangeStart = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Journey Planning</Text>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 22.5726,
              longitude: 88.3639,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            {originCoords && <Marker coordinate={originCoords} title="Origin" />}
            {destinationCoords && (
              <Marker coordinate={destinationCoords} title="Destination" />
            )}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeWidth={4}
                strokeColor="#4A90E2"
              />
            )}
          </MapView>

          <View style={styles.locationInputs}>
            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color="#4A90E2" />
              <TextInput
                style={styles.locationInput}
                placeholder="Origin Location"
                value={originLocation}
                onChangeText={(text) => {
                  setOriginLocation(text);
                  fetchCoordinates(text, "origin");
                }}
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="flag" size={20} color="#4A90E2" />
              <TextInput
                style={styles.locationInput}
                placeholder="Destination"
                value={destination}
                onChangeText={(text) => {
                  setDestination(text);
                  fetchCoordinates(text, "destination");
                }}
                placeholderTextColor="#8E8E93"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.findRouteButton}
            onPress={handleFindRoute}
          >
            <Text style={styles.findRouteButtonText}>Find Route</Text>
          </TouchableOpacity>
        </View>

        {/* Journey Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Journey Type</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.journeyTypes}>
            {journeyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.journeyTypeCard,
                  selectedJourneyType === type.id && styles.selectedJourneyType,
                ]}
                onPress={() => handleJourneyTypeSelect(type.id)}
              >
                <MaterialIcons name={type.icon} size={32} color="#4A90E2" />
                <Text style={styles.journeyTypeName}>{type.name}</Text>
                <Text style={styles.journeyTypeDescription}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Safety Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.safetyTipsHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#34C759" />
              <Text style={styles.sectionTitle}>AI Safety Tips</Text>
            </View>
          </View>

          <View style={styles.safetyTipsContainer}>
            {safetyTips.map((tip, index) => (
              <View key={index} style={styles.safetyTipItem}>
                <View style={styles.safetyTipIcon}>
                  <MaterialIcons
                    name={tip.icon}
                    size={16}
                    color={
                      tip.type === "alert"
                        ? "#FF6B6B"
                        : tip.type === "warning"
                        ? "#FFB347"
                        : "#4A90E2"
                    }
                  />
                </View>
                <Text style={styles.safetyTipText}>{tip.text}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.viewAllSuggestionsButton}
              onPress={() => setShowTipsModal(true)}
            >
              <Text style={styles.viewAllSuggestionsText}>
                View All Suggestions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline & Dates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.timelineHeader}>
              <Ionicons name="calendar" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Timeline & Dates</Text>
            </View>
          </View>

          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateText}>
                  {startDate.toISOString().split("T")[0]}
                </Text>
                <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onChangeStart}
                />
              )}
            </View>

            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateText}>
                  {endDate.toISOString().split("T")[0]}
                </Text>
                <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onChangeEnd}
                />
              )}
            </View>
          </View>
        </View>

        {/* Share Trip Button */}
        <TouchableOpacity style={styles.shareTripButton} onPress={handleShareTrip}>
          <Ionicons name="share" size={20} color="#FFFFFF" />
          <Text style={styles.shareTripButtonText}>Share Trip Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for AI Safety Tips */}
      <Modal visible={showTipsModal} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            All Safety Suggestions
          </Text>
          {safetyTips.map((tip, index) => (
            <View key={index} style={{ flexDirection: "row", marginBottom: 12 }}>
              <MaterialIcons
                name={tip.icon}
                size={20}
                color={
                  tip.type === "alert"
                    ? "#FF6B6B"
                    : tip.type === "warning"
                    ? "#FFB347"
                    : "#4A90E2"
                }
              />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>{tip.text}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "#4A90E2",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => setShowTipsModal(false)}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 24 },
  mapSection: { marginBottom: 32 },
  map: { height: 200, borderRadius: 16 },
  locationInputs: { marginTop: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  locationInput: { flex: 1, fontSize: 16, color: "#333" },
  findRouteButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  findRouteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  viewAllButton: { fontSize: 14, color: "#4A90E2", fontWeight: "500" },
  safetyTipsHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  timelineHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  journeyTypes: { flexDirection: "row", gap: 16 },
  journeyTypeCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedJourneyType: {
    borderColor: "#4A90E2",
    backgroundColor: "#F0F8FF",
  },
  journeyTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  journeyTypeDescription: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 16,
  },
  safetyTipsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  safetyTipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  safetyTipIcon: { marginTop: 2 },
  safetyTipText: { flex: 1, fontSize: 14, color: "#333", lineHeight: 20 },
  viewAllSuggestionsButton: { alignItems: "center", paddingVertical: 8 },
  viewAllSuggestionsText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  dateSection: { gap: 16 },
  dateItem: { gap: 8 },
  dateLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: { fontSize: 16, color: "#333" },
  shareTripButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
  },
  shareTripButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
});

export default JourneyScreen;
