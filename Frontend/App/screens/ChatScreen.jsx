import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import * as Location from 'expo-location';
import * as SMS from "expo-sms";

// 👉 Gemini API
const GEMINI_API_KEY = "AIzaSyDP4qygUtSzRgG34vodvb8p2Y10WZW4";

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [isQuickCommandsVisible, setIsQuickCommandsVisible] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your AI Assistant. How can I help ensure your safety today?",
      timestamp: new Date()
    }
  ]);

  const quickCommands = [
    { id: 'report', title: 'Report Incident', icon: 'warning-outline', color: '#FF6B6B' },
    { id: 'location', title: 'Share Location', icon: 'location-outline', color: '#4A90E2' },
    { id: 'call', title: 'Call', icon: 'call-outline', color: '#34C759' }
  ];

  // 🔥 Gemini API call
  const fetchGeminiResponse = async (userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }]
        }),
      });

      const data = await response.json();
      console.log("🔍 Gemini API Raw Response:", JSON.stringify(data, null, 2));

      if (data?.candidates?.length > 0 && data.candidates[0]?.content?.parts?.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "🤔 I couldn't understand that right now.";
      }
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      return "⚠️ Error: Unable to connect to AI service.";
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        type: 'user',
        text: message.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      const userText = message.trim();
      setMessage('');

      // 🟢 Gemini se reply lao
      const botReplyText = await fetchGeminiResponse(userText);

      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: botReplyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }
  };

  const handleQuickCommand = async (commandId) => {
    switch (commandId) {
      case 'report':
        Alert.alert('Report Incident', 'Incident reporting functionality will be added soon.');
        break;

      case 'location':
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is required to share location.');
            return;
          }

          let loc = await Location.getCurrentPositionAsync({});
          let location = { lat: loc.coords.latitude, lng: loc.coords.longitude };

          const message = `📍 SOS Alert!\nMy location: https://maps.google.com/?q=${location.lat},${location.lng}`;

          const familyNumbers = ["6299486245"]; // 👈 same as HomeScreen
          const isAvailable = await SMS.isAvailableAsync();

          if (isAvailable) {
            await SMS.sendSMSAsync(familyNumbers, message);
            Alert.alert("✅ Location Shared", "Your location has been sent to family contacts.");
          } else {
            Alert.alert("❌ Failed", "SMS service not available on this device.");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Something went wrong while sharing location.");
        }
        break;

      case 'call':
        Alert.alert(
          "Quick Call",
          "Who would you like to call?",
          [
            { text: "Family", onPress: () => Linking.openURL(`tel:9632587412`) },
            { text: "Police", onPress: () => Linking.openURL(`tel:9874563214`) },
            { text: "Cancel", style: "cancel" }
          ]
        );
        break;
    }
  };

  const renderMessage = (msg) => {
    const isBot = msg.type === 'bot';
    return (
      <View key={msg.id} style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
        {isBot && (
          <View style={styles.botAvatar}>
            <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
          </View>
        )}
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          {isBot ? (
            <Markdown style={markdownStyles}>
              {msg.text}
            </Markdown>
          ) : (
            <Text style={[styles.messageText, styles.userText]}>
              {msg.text}
            </Text>
          )}
        </View>
        {isBot && (
          <TouchableOpacity style={styles.messageAction}>
            <Ionicons name="copy-outline" size={16} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Quick Commands */}
      <View style={styles.quickCommandsSection}>
        <TouchableOpacity 
          style={styles.quickCommandsHeader}
          onPress={() => setIsQuickCommandsVisible(!isQuickCommandsVisible)}
        >
          <Text style={styles.quickCommandsTitle}>Quick Commands</Text>
          <Ionicons 
            name={isQuickCommandsVisible ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#333" 
          />
        </TouchableOpacity>
        {isQuickCommandsVisible && (
          <View style={styles.quickCommands}>
            {quickCommands.map((command) => (
              <TouchableOpacity
                key={command.id}
                style={styles.quickCommandButton}
                onPress={() => handleQuickCommand(command.id)}
              >
                <View style={[styles.quickCommandIcon, { backgroundColor: command.color }]}>
                  <Ionicons name={command.icon} size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.quickCommandText}>{command.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const markdownStyles = {
  body: { color: '#333', fontSize: 16, lineHeight: 22 },
  strong: { fontWeight: '700' },
  bullet_list: { marginTop: 4, marginBottom: 4 },
  ordered_list: { marginTop: 4, marginBottom: 4 },
  bullet_list_icon: { color: '#333' },
  heading1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  heading2: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  heading3: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center' },
  messagesContainer: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  botMessage: { justifyContent: 'flex-start' },
  userMessage: { justifyContent: 'flex-end' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#8E8E93',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  botBubble: { backgroundColor: '#F2F2F7', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#4A90E2', borderBottomRightRadius: 4, marginLeft: 'auto' },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#FFFFFF' },
  messageAction: { padding: 8, marginLeft: 8 },
  quickCommandsSection: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#F8F9FA' },
  quickCommandsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  quickCommandsTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  quickCommands: { flexDirection: 'row', justifyContent: 'space-around' },
  quickCommandButton: { alignItems: 'center', flex: 1 },
  quickCommandIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  quickCommandText: { fontSize: 12, color: '#333', textAlign: 'center', fontWeight: '500' },
  inputContainer: { padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  messageInputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: '#F2F2F7', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 8, minHeight: 48,
  },
  messageInput: { flex: 1, fontSize: 16, color: '#333', maxHeight: 100, paddingVertical: 8 },
  sendButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
});

export default ChatScreen;
