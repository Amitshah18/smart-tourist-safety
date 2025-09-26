import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'

const TopBar = ({ onProfilePress, onNotificationPress }) => {
  return (
    <View style={[styles.container, { paddingTop: Constants.statusBarHeight - 25}]}>
      {/* Title */}
      <Text style={styles.title}>Smart Tourist Safety</Text>
      
      {/* Right side icons */}
      <View style={styles.rightSection}>
        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Profile Picture */}
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Image 
            source={{ 
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TopBar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom:10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    minHeight: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
})