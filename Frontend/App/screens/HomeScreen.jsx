import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

const HomeScreen = () => {
  const handleSOSPress = () => {
    Alert.alert(
      'SOS Alert',
      'Emergency services will be contacted immediately!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive' }
      ]
    )
  }

  const handleQuickDial = (contact) => {
    Alert.alert('Calling', `Calling ${contact}...`)
  }

  const handleReportIncident = () => {
    Alert.alert('Report Incident', 'Report incident feature will be implemented.')
  }

  const handleAIAssistant = () => {
    Alert.alert('AI Assistant', 'Starting chat with AI Assistant...')
  }

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
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/350x150/E8E8E8/666666?text=Interactive+Map' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.safeZoneIndicator}>
              <Text style={styles.indicatorText}>Safe Zone</Text>
            </View>
            <View style={styles.riskZoneIndicator}>
              <Text style={styles.indicatorText}>Risk Zone Detected</Text>
            </View>
          </View>
        </View>
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