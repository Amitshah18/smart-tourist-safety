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
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [isQuickCommandsVisible, setIsQuickCommandsVisible] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your AI Assistant. How can I help ensure your safety today?",
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'user',
      text: "I'm looking for safe places near me.",
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'bot',
      text: "Great! I can help you find nearby safe places like police stations, hospitals, or accredited safe zones. Would you like me to share your current location to get started?",
      timestamp: new Date()
    }
  ]);

  const quickCommands = [
    {
      id: 'report',
      title: 'Report Incident',
      icon: 'warning-outline',
      color: '#FF6B6B'
    },
    {
      id: 'location',
      title: 'Share Location',
      icon: 'location-outline',
      color: '#4A90E2'
    },
    {
      id: 'call',
      title: 'Call',
      icon: 'call-outline',
      color: '#34C759'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        type: 'user',
        text: message.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: "Thank you for your message. I'm processing your request and will provide assistance shortly.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleQuickCommand = (commandId) => {
    switch (commandId) {
      case 'report':
        Alert.alert('Report Incident', 'Redirecting to incident report...');
        break;
      case 'location':
        Alert.alert('Share Location', 'Location sharing functionality will be implemented');
        break;
      case 'call':
        Alert.alert('Emergency Call', 'Calling emergency services...');
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
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {msg.text}
          </Text>
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

      {/* Message Input */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#333',
  },
  userText: {
    color: '#FFFFFF',
  },
  messageAction: {
    padding: 8,
    marginLeft: 8,
  },
  quickCommandsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F8F9FA',
  },
  quickCommandsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickCommandsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickCommands: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickCommandButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickCommandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickCommandText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default ChatScreen;