import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import * as SMS from "expo-sms";

import * as Linking from "expo-linking";

const HomeScreen = () => {
  const handleSOSPress = async () => {
    try {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required to send SOS.");
        return;
      }

      // Get current location
      let loc = await Location.getCurrentPositionAsync({});
      let location = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setLocation(location); // store for map

      // 3️⃣ Prepare message
      const message = `SOS Alert! Location: https://maps.google.com/?q=${location.lat},${location.lng}`;

      // 4️⃣ Send family SMS using device
      const familyNumbers = ["6299486245"]; // replace with dynamic list if needed
      if (Platform.OS === "android") {
        // Android can auto-send
        await SMS.sendSMSAsync(familyNumbers, message);
      } else {
        // iOS opens Messages app with prefilled message
        await SMS.sendSMSAsync(familyNumbers, message);
      }

      // 5️⃣ Send to backend for saving SOS & Admin notification
      let response = await fetch("http://192.168.1.5:5000/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "64a12345abcd6789abcdef01", // replace with actual logged-in user ID
          location,
          message, // pass the message for SMS fallback to admin
        }),
      });

      let data = await response.json();

      if (data.success) {
        Alert.alert("✅ SOS Sent", `Family and Admin notified. Zone: ${data.zoneStatus}`);
      } else {
        Alert.alert("❌ Failed", "Could not trigger SOS");
      }

    } catch (error) {
      Alert.alert("Error", "Something went wrong while sending SOS.");
      console.error(error);
    }
  };



  const handleQuickDial = (contact) => {
    let number = contact === 'Family' ? '6299486245' : '100'; // family / police
    Linking.openURL(`tel:${number}`);
  };

  const handleReportIncident = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "Theft", location: "Central Market", description: "Wallet stolen" })
      });
      const data = await res.json();
      Alert.alert("Incident Reported", `Type: ${data.type}`);
    } catch (err) {
      Alert.alert("Error", "Failed to report incident");
    }
  };

  const [location, setLocation] = React.useState(null);
  const [zoneStatus, setZoneStatus] = React.useState(null);



  const handleAIAssistant = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "What are safety tips for tourists in Kolkata?" })
      });
      const data = await res.json();
      Alert.alert("AI Assistant", data.reply);
    } catch (err) {
      Alert.alert("Error", "Failed to connect to AI Assistant");
    }
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* SOS Button */}
      <View style={styles.sosSection}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <Ionicons name="alert-circle" size={32} color="#FFFFFF" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Zone Section */}
      <View style={styles.safeZoneSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Safe Zone</Text>
        </View>
        <View style={styles.safeZoneContent}>
          <Text style={styles.safeZoneRating}>Excellent</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingNumber}>92</Text>
            <Text style={styles.ratingLabel}>Personal Safety Score</Text>
          </View>
        </View>
        <Text style={styles.areaLabel}>Area Safety Rating</Text>
      </View>

      {/* Live Location Map */}
      <View style={styles.mapSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={20} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Live Location</Text>
        </View>
        {location ? (
          <MapView
            style={styles.mapImage}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{ latitude: location.lat, longitude: location.lng }}
              title="You"
              description={`Zone: ${zoneStatus || "Unknown"}`}
            />
          </MapView>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>

      {/* Quick Dial Contacts */}
      <View style={styles.quickDialSection}>
        <Text style={styles.sectionTitle}>Quick Dial Contacts</Text>
        <View style={styles.contactsRow}>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleQuickDial('Family')}>
            <Ionicons name="people" size={24} color="#4A90E2" />
            <Text style={styles.contactLabel}>Family</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleQuickDial('Police')}>
            <MaterialIcons name="local-police" size={24} color="#4A90E2" />
            <Text style={styles.contactLabel}>Police</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nearby Incidents */}
      <View style={styles.incidentsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Incidents</Text>
          <TouchableOpacity onPress={handleReportIncident}>
            <Ionicons name="add-circle" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={styles.incidentsList}>
          <View style={styles.incidentItem}>
            <Ionicons name="warning" size={16} color="#FF6B6B" />
            <View style={styles.incidentDetails}>
              <Text style={styles.incidentType}>Theft Reported</Text>
              <Text style={styles.incidentTime}>Central Market • 2 hours ago</Text>
            </View>
          </View>
          <View style={styles.incidentItem}>
            <Ionicons name="car" size={16} color="#FFB347" />
            <View style={styles.incidentDetails}>
              <Text style={styles.incidentType}>Minor Accident</Text>
              <Text style={styles.incidentTime}>Main Street • 4 hours ago</Text>
            </View>
          </View>
          <View style={styles.incidentItem}>
            <Ionicons name="alert-circle" size={16} color="#4A90E2" />
            <View style={styles.incidentDetails}>
              <Text style={styles.incidentType}>Suspicious Activity</Text>
              <Text style={styles.incidentTime}>Park Area • Yesterday</Text>
            </View>
          </View>
        </View>
      </View>

      {/* AI Assistant */}
      <TouchableOpacity style={styles.aiSection} onPress={handleAIAssistant}>
        <View style={styles.aiHeader}>
          <FontAwesome5 name="robot" size={20} color="#4A90E2" />
          <Text style={styles.sectionTitle}>AI Assistant</Text>
        </View>
        <Text style={styles.aiDescription}>
          Need help or have questions about local safety? Our AI assistant is here to guide you.
        </Text>
        <Text style={styles.aiCTA}>Start Chat</Text>
      </TouchableOpacity>

      {/* Alerts & Notifications */}
      <View style={styles.alertsSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
        </View>
        <View style={styles.alertsList}>
          <View style={styles.alertItem}>
            <View style={styles.alertDot} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>New safety guidelines updated for your region.</Text>
              <Text style={styles.alertTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.alertItem}>
            <View style={styles.alertDot} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Weather advisory: Heavy rainfall expected in your area.</Text>
              <Text style={styles.alertTime}>1 hour ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom padding for navigation */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  sosSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  safeZoneSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  safeZoneContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  safeZoneRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  areaLabel: {
    fontSize: 12,
    color: '#666',
  },
  mapSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  mapContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E8E8E8',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safeZoneIndicator: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskZoneIndicator: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  quickDialSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  contactsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  contactButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    width: '45%',
  },
  contactLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  incidentsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  incidentsList: {
    marginTop: 12,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  incidentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  incidentTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  aiSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiCTA: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  alertsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  alertsList: {
    marginTop: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
    marginTop: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
})