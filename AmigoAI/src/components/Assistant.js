import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const Assistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [recording, setRecording] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));

  useEffect(() => {
    // Cleanup recording on unmount
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Animate button when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animationValue.setValue(1);
    }
  }, [isListening]);

  const startListening = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsListening(true);
      
      // Simulate voice recognition (replace with actual implementation later)
      setTimeout(() => stopListening(), 3000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      if (!recording) return;

      setIsListening(false);
      await recording.stopAndUnloadAsync();
      setRecording(null);

      // Simulate processing (replace with actual STT later)
      handleUserInput('Olá, como posso ajudar?');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleUserInput = async (text) => {
    setSpokenText(text);
    
    // Simple response logic (expand this later)
    const response = getAssistantResponse(text);
    setAssistantResponse(response);
    
    await speak(response);
  };

  const getAssistantResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('olá') || lowerText.includes('oi')) {
      return 'Olá! Sou seu assistente virtual. Como posso ajudar?';
    }
    return 'Desculpe, ainda estou aprendendo a responder isso.';
  };

  const speak = async (text) => {
    try {
      await Speech.speak(text, {
        language: 'pt-BR',
        pitch: 1.0,
        rate: 0.9,
        onStart: () => console.log('Started speaking'),
        onDone: () => console.log('Done speaking'),
        onError: (error) => console.error('Speech error:', error),
      });
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        {isListening ? 'Ouvindo...' : 'Toque para falar'}
      </Text>

      <Animated.View style={{ transform: [{ scale: animationValue }] }}>
        <TouchableOpacity 
          style={[styles.button, isListening && styles.buttonListening]}
          onPress={isListening ? stopListening : startListening}
          disabled={isListening}
        >
          <MaterialCommunityIcons 
            name={isListening ? "microphone" : "microphone-outline"} 
            size={30} 
            color="#fff" 
          />
        </TouchableOpacity>
      </Animated.View>

      {spokenText && (
        <Text style={styles.text}>Você: {spokenText}</Text>
      )}
      {assistantResponse && (
        <Text style={styles.responseText}>Assistente: {assistantResponse}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  buttonListening: {
    backgroundColor: '#002200',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  responseText: {
    color: '#00ff00',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Assistant;