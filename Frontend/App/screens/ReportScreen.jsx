import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [incidentDetails, setIncidentDetails] = useState('');

  const categories = [
    { id: 'theft', name: 'Theft', color: '#4A90E2' },
    { id: 'harassment', name: 'Harassment', color: '#8E8E93' },
    { id: 'medical', name: 'Medical Emergency', color: '#8E8E93' },
    { id: 'lost', name: 'Lost', color: '#8E8E93' },
    { id: 'disaster', name: 'Natural Disaster', color: '#8E8E93' },
    { id: 'other', name: 'Other', color: '#8E8E93' }
  ];

  const uploadOptions = [
    { id: 'image', name: 'Image', icon: 'image-outline', color: '#4A90E2' },
    { id: 'video', name: 'Video', icon: 'videocam-outline', color: '#4A90E2' },
    { id: 'other', name: 'Other', icon: 'document-outline', color: '#4A90E2' }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleUpload = (type) => {
    Alert.alert('Upload', `${type} upload functionality will be implemented`);
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select an incident category');
      return;
    }
    if (!incidentDetails.trim()) {
      Alert.alert('Error', 'Please provide incident details');
      return;
    }
    Alert.alert('Success', 'Incident report submitted successfully');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Submit a New Incident</Text>
        <Text style={styles.subtitle}>
          Provide details of the incident. Your report helps ensure community safety.
        </Text>

        {/* Incident Category */}
        <Text style={styles.sectionTitle}>Incident Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Incident Details */}
        <Text style={styles.sectionTitle}>Incident Details</Text>
        <Text style={styles.fieldLabel}>Description of Incident</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Describe what happened, when, and where..."
            value={incidentDetails}
            onChangeText={setIncidentDetails}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Upload Evidence */}
        <Text style={styles.sectionTitle}>Upload Evidence</Text>
        <View style={styles.uploadOptions}>
          {uploadOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.uploadButton}
              onPress={() => handleUpload(option.name)}
            >
              <Ionicons name={option.icon} size={24} color={option.color} />
              <Text style={styles.uploadButtonText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.uploadNote}>Max 5 files, up to 20MB each</Text>

        {/* Data Integrity */}
        <Text style={styles.sectionTitle}>Data Integrity</Text>
        <View style={styles.integrityItem}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <View style={styles.integrityContent}>
            <Text style={styles.integrityTitle}>Blockchain-Logged Evidence</Text>
            <Text style={styles.integrityDescription}>
              All uploaded evidence is securely logged on the blockchain, ensuring tamper-proof 
              integrity and admissibility as court record.
            </Text>
          </View>
        </View>

        <View style={styles.integrityItem}>
          <Ionicons name="document-text" size={20} color="#34C759" />
          <View style={styles.integrityContent}>
            <Text style={styles.integrityTitle}>Auto E-FIR Generation</Text>
            <Text style={styles.integrityDescription}>
              Upon submission, an electronic First Information Report (E-FIR) will be 
              automatically generated and shared with relevant authorities.
            </Text>
          </View>
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#8E8E93" />
          <Text style={styles.securityText}>Blockchain Secured</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Incident</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    position: 'relative',
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlignVertical: 'top',
  },
  micButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 4,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A90E2',
    marginTop: 4,
  },
  uploadNote: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  integrityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  integrityContent: {
    flex: 1,
  },
  integrityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  integrityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  securityText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ReportScreen;