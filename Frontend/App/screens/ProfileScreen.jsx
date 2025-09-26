import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Switch,
  Image 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ onLogout }) => {
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [safetyNotifications, setSafetyNotifications] = useState(true);
  const [autoReporting, setAutoReporting] = useState(false);

  const user = {
    name: 'John Traveler',
    email: 'john.traveler@email.com',
    phone: '+1 (555) 123-4567',
    safetyScore: 85,
    totalTrips: 12,
    reportsSubmitted: 3
  };

  const emergencyContacts = [
    { id: 1, name: 'Emergency Services', number: '911', type: 'emergency' },
    { id: 2, name: 'Sarah Miller (Wife)', number: '+1 (555) 987-6543', type: 'personal' },
    { id: 3, name: 'Mike Johnson (Friend)', number: '+1 (555) 456-7890', type: 'personal' }
  ];

  const profileSections = [
    {
      title: 'Safety Settings',
      items: [
        {
          icon: 'location-on',
          title: 'Location Sharing',
          subtitle: 'Share location with emergency contacts',
          type: 'toggle',
          value: locationSharing,
          onToggle: setLocationSharing
        },
        {
          icon: 'notification-important',
          title: 'Emergency Alerts',
          subtitle: 'Receive local emergency notifications',
          type: 'toggle',
          value: emergencyAlerts,
          onToggle: setEmergencyAlerts
        },
        {
          icon: 'security',
          title: 'Safety Notifications',
          subtitle: 'Get safety tips and warnings',
          type: 'toggle',
          value: safetyNotifications,
          onToggle: setSafetyNotifications
        },
        {
          icon: 'auto-fix-high',
          title: 'Auto Incident Reporting',
          subtitle: 'Automatically report detected incidents',
          type: 'toggle',
          value: autoReporting,
          onToggle: setAutoReporting
        }
      ]
    },
    {
      title: 'Travel & Safety',
      items: [
        {
          icon: 'history',
          title: 'Travel History',
          subtitle: 'View your past journeys',
          type: 'navigation'
        },
        {
          icon: 'favorite',
          title: 'Safe Places',
          subtitle: 'Your saved safe locations',
          type: 'navigation'
        },
        {
          icon: 'assessment',
          title: 'Safety Reports',
          subtitle: 'View submitted incident reports',
          type: 'navigation'
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'person',
          title: 'Personal Information',
          subtitle: 'Edit your profile details',
          type: 'navigation'
        },
        {
          icon: 'privacy-tip',
          title: 'Privacy Settings',
          subtitle: 'Control your data and privacy',
          type: 'navigation'
        },
        {
          icon: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigation'
        }
      ]
    }
  ];

  const handleItemPress = (item) => {
    if (item.type === 'navigation') {
      Alert.alert(item.title, `${item.title} functionality will be implemented`);
    }
  };

  const handleEmergencyContactPress = (contact) => {
    if (contact.type === 'emergency') {
      Alert.alert('Emergency Call', `Calling ${contact.number}`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', contact.number) }
      ]);
    } else {
      Alert.alert('Contact', `Calling ${contact.name} at ${contact.number}`);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => onLogout && onLogout() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ 
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              }} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={16} color="#4A90E2" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.safetyScore}%</Text>
            <Text style={styles.statLabel}>Safety Score</Text>
            <View style={styles.safetyScoreBar}>
              <View style={[styles.safetyScoreFill, { width: `${user.safetyScore}%` }]} />
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.reportsSubmitted}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
          </View>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.contactItem}
              onPress={() => handleEmergencyContactPress(contact)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.type === 'emergency' ? '#FF6B6B' : '#34C759' }]}>
                <Ionicons 
                  name={contact.type === 'emergency' ? 'medical' : 'person'} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <Ionicons name="call" size={20} color="#4A90E2" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={styles.settingItem}
                onPress={() => handleItemPress(item)}
                disabled={item.type === 'toggle'}
              >
                <View style={styles.settingLeft}>
                  <MaterialIcons name={item.icon} size={24} color="#4A90E2" />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.type === 'toggle' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                    thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Smart Tourist Safety v1.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  safetyScoreBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  safetyScoreFill: {
    height: 4,
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  addButton: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ProfileScreen;