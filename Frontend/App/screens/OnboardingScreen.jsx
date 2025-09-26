import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const slides = [
    {
      id: 1,
      icon: 'shield-checkmark',
      iconColor: '#4A90E2',
      title: 'Safe Travel, Smart Protection',
      subtitle: 'Leverage AI and Blockchain for unparalleled safety and security on your journeys.',
      backgroundColor: '#F0F8FF',
      features: [
        { icon: 'location', text: 'Real-time location sharing' },
        { icon: 'notifications', text: 'Instant safety alerts' },
        { icon: 'people', text: 'Emergency contacts' }
      ]
    },
    {
      id: 2,
      icon: 'chatbubble-ellipses',
      iconColor: '#34C759',
      title: 'AI Safety Assistant',
      subtitle: '24/7 intelligent companion providing personalized safety guidance and instant emergency support.',
      backgroundColor: '#F0FFF0',
      features: [
        { icon: 'brain', text: 'Smart safety recommendations' },
        { icon: 'time', text: '24/7 availability' },
        { icon: 'language', text: 'Multi-language support' }
      ]
    },
    {
      id: 3,
      icon: 'warning',
      iconColor: '#FF6B6B',
      title: 'Instant Incident Reporting',
      subtitle: 'Report incidents quickly with blockchain-secured evidence and automatic E-FIR generation.',
      backgroundColor: '#FFF5F5',
      features: [
        { icon: 'camera', text: 'Photo & video evidence' },
        { icon: 'document-text', text: 'Auto E-FIR generation' },
        { icon: 'shield', text: 'Blockchain secured' }
      ]
    },
    {
      id: 4,
      icon: 'map',
      iconColor: '#FFB347',
      title: 'Smart Journey Planning',
      subtitle: 'Plan safer routes with AI-powered recommendations and real-time safety updates.',
      backgroundColor: '#FFFAF0',
      features: [
        { icon: 'navigate', text: 'Safe route planning' },
        { icon: 'warning-outline', text: 'Risk area alerts' },
        { icon: 'calendar', text: 'Travel timeline tracking' }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true,
      });
    } else {
      onComplete && onComplete();
    }
  };

  const handleSkip = () => {
    onComplete && onComplete();
  };

  const handleDotPress = (index) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide, index) => (
    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.slideContent}>
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: slide.backgroundColor }]}>
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              <View style={styles.phoneScreen}>
                <Ionicons name={slide.icon} size={36} color={slide.iconColor} />
              </View>
            </View>
            <View style={[styles.shieldBadge, { backgroundColor: slide.iconColor }]}>
              <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {slide.features.map((feature, featureIndex) => (
            <View key={featureIndex} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: slide.iconColor }]}>
                <Ionicons name={feature.icon} size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, dotIndex) => (
            <TouchableOpacity
              key={dotIndex}
              style={[
                styles.dot,
                {
                  backgroundColor: dotIndex === currentSlide ? slide.iconColor : '#E5E5EA',
                  width: dotIndex === currentSlide ? 18 : 6,
                }
              ]}
              onPress={() => handleDotPress(dotIndex)}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: slide.iconColor }]}
          onPress={handleNext}
        >
          <Text style={styles.actionButtonText}>
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={index === slides.length - 1 ? 'rocket' : 'arrow-forward'} 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    paddingTop: StatusBar.currentHeight || 44,
  },
  skipButton: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 44) + 12,
    right: 20,
    zIndex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phoneContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  phone: {
    width: 140,
    height: 280,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;