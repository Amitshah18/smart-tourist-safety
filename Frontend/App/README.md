# 🛡️ Smart Tourist Safety App

A comprehensive React Native mobile application designed to enhance tourist safety through AI-powered assistance, real-time alerts, and blockchain-secured incident reporting.

## 🌟 Features

### 🚨 Core Safety Features
- **SOS Emergency Button** - One-tap emergency assistance with location sharing
- **Real-time Safety Alerts** - Instant notifications about nearby incidents and safety concerns
- **Emergency Contacts** - Quick dial access to pre-configured emergency contacts
- **Location Sharing** - Continuous location tracking for safety monitoring
- **Safety Score Display** - Real-time safety rating of current location

### 🤖 AI-Powered Assistant
- **24/7 Safety Companion** - Intelligent chat assistant providing personalized safety guidance
- **Smart Recommendations** - AI-driven safety tips based on location and time
- **Multi-language Support** - Assistance available in multiple languages
- **Quick Commands** - Instant access to emergency features through chat interface

### 📝 Incident Reporting
- **Instant Reporting** - Quick incident reporting with category selection
- **Evidence Upload** - Photo and video evidence collection
- **Blockchain Security** - Tamper-proof evidence storage using blockchain technology
- **Auto E-FIR Generation** - Automatic electronic FIR generation for legal purposes

### 🗺️ Smart Journey Planning
- **Safe Route Planning** - AI-powered route recommendations prioritizing safety
- **Risk Area Alerts** - Real-time warnings about high-risk areas
- **Travel Timeline** - Track journey progress and estimated arrival times
- **Destination Safety Analysis** - Safety assessment of planned destinations

### 🎯 User Experience
- **Professional Onboarding** - Feature introduction with interactive slides
- **Secure Authentication** - Login/signup with validation and safety messaging
- **Responsive Design** - Optimized for all screen sizes and orientations
- **Intuitive Navigation** - Bottom navigation with 5 main sections

## 🛠️ Technology Stack

### Frontend
- **React Native** `0.81.4` - Cross-platform mobile development
- **Expo SDK** `54` - Development platform and tools
- **React** `19.1.0` - UI library with latest features
- **React Native Web** `0.21.1` - Web platform compatibility

### UI/UX
- **SafeAreaView** (react-native-safe-area-context `5.6.0`) - Modern safe area handling
- **Vector Icons** (expo-vector-icons `15.0.2`) - Comprehensive icon library
- **Custom Components** - Professionally designed UI components
- **Responsive Layout** - Platform-specific optimizations

### Key Libraries
- **Ionicons** - Primary icon set for consistency
- **MaterialIcons & FontAwesome5** - Additional icon options
- **Platform API** - Cross-platform compatibility checks

## 📱 App Structure

```
src/
├── app/
│   └── index.jsx           # Main app entry point with navigation
├── components/
│   ├── TopBar.jsx         # Header component with notifications
│   ├── BottomNavigation.jsx # Tab navigation component
│   └── index.js           # Component exports
├── screens/
│   ├── OnboardingScreen.jsx # Feature introduction slides
│   ├── HomeScreen.jsx      # Safety dashboard and SOS
│   ├── JourneyScreen.jsx   # Trip planning and safe routes
│   ├── ReportScreen.jsx    # Incident reporting interface
│   ├── ChatScreen.jsx      # AI assistant chat
│   ├── ProfileScreen.jsx   # User settings and emergency contacts
│   ├── LoginScreen.jsx     # Authentication interface
│   ├── SignupScreen.jsx    # User registration
│   └── index.js           # Screen exports
├── assets/
│   ├── icon.png           # App icon
│   ├── adaptive-icon.png  # Android adaptive icon
│   ├── favicon.png        # Web favicon
│   └── splash-icon.png    # Splash screen icon
└── utils/
    └── errorSuppression.js # Error handling utilities
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amitshah18/smart-tourist-safety.git
   cd smart-tourist-safety/Frontend/App
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on specific platforms**
   ```bash
   # Web development
   npm run web
   
   # Android (requires Android Studio/emulator)
   npm run android
   
   # iOS (requires Xcode - macOS only)
   npm run ios
   ```

### Development Commands

```bash
# Start development server
npm start

# Run on web browser
npm run web

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator
npm run ios

# Clear cache and restart
expo start -c
```

## 📋 Configuration

### App Configuration (`app.json`)
```json
{
  "expo": {
    "name": "Smart Tourist Safety",
    "slug": "sih-2026",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "platforms": ["ios", "android", "web"],
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Environment Variables
Create a `.env` file in the root directory for configuration:
```env
# API Configuration (when backend is integrated)
API_BASE_URL=https://your-api-endpoint.com
BLOCKCHAIN_ENDPOINT=https://blockchain-service.com
AI_ASSISTANT_API=https://ai-service.com

# Feature Flags
ENABLE_LOCATION_TRACKING=true
ENABLE_BLOCKCHAIN_LOGGING=true
DEBUG_MODE=false
```

## 🔧 Key Components

### Authentication Flow
- **OnboardingScreen** - Feature showcase with 4 interactive slides
- **LoginScreen** - Secure login with validation and social options
- **SignupScreen** - Registration with safety feature introduction

### Main Application
- **HomeScreen** - Central safety dashboard with SOS and quick actions
- **JourneyScreen** - Travel planning with AI safety recommendations
- **ReportScreen** - Incident reporting with blockchain evidence storage
- **ChatScreen** - AI assistant with collapsible quick commands
- **ProfileScreen** - User settings, emergency contacts, and logout

### Navigation Components
- **TopBar** - Header with notifications and profile access
- **BottomNavigation** - 5-tab navigation (Home, Journey, Report, Chat, Profile)

## 🌐 Platform Support

### Mobile Platforms
- **iOS** (iPhone/iPad)
- **Android** (Phone/Tablet)

### Web Platform
- **Progressive Web App** (PWA) ready
- **Responsive design** for desktop and mobile browsers
- **Cross-platform compatibility** maintained

## 🔒 Security Features

### Data Protection
- **Secure Authentication** with form validation
- **Location Privacy** controls in profile settings
- **Emergency Data Encryption** for sensitive information

### Blockchain Integration
- **Evidence Integrity** - Tamper-proof incident evidence storage
- **Auto E-FIR** - Automated legal documentation generation
- **Audit Trail** - Complete incident reporting history

## 🤝 Contributing

We welcome contributions to improve the Smart Tourist Safety app! Here's how you can help:

### Development Guidelines
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (ESLint configuration provided)
4. **Test thoroughly** on multiple platforms
5. **Commit changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style
- Use **ES6+** syntax
- Follow **React Native best practices**
- Maintain **component modularity**
- Add **PropTypes** for component validation
- Include **JSDoc comments** for functions

## 📞 Support & Contact

### Technical Support
- **Email**: support@smarttouristsafety.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/Amitshah18/smart-tourist-safety/issues)
- **Documentation**: Check this README for common solutions

### Emergency Resources
- **National Emergency**: 112 (India)
- **Tourist Helpline**: 1363 (India)
- **Police**: 100
- **Medical Emergency**: 108

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

### Built For
- **Smart India Hackathon (SIH) 2026**
- **Tourism Safety Initiative**
- **Digital India Mission**

### Special Thanks
- **React Native Community** for excellent documentation
- **Expo Team** for development tools
- **Open Source Contributors** for libraries used

### Development Team
- **Frontend Development**: React Native with Expo
- **UI/UX Design**: Professional safety-focused interface
- **Security Implementation**: Blockchain integration planning
- **AI Integration**: Assistant chat interface

---

<div align="center">

**🛡️ Stay Safe, Travel Smart 🛡️**

*Making tourism safer through technology*

</div>
